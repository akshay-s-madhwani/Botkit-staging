"use strict";
/**
 * @module botkit-plugin-cms
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotkitCMSHelper = void 0;
const botkit_1 = require("botkit");
const request = require("request");
const Debug = require("debug");
const url = require("url");
const plugin_core_1 = require("./plugin-core");
const debug = Debug('botkit:cms');
/**
 * A plugin for Botkit that provides access to an instance of [Botkit CMS](https://github.com/howdyai/botkit-cms), including the ability to load script content into a DialogSet
 * and bind before, after and onChange handlers to those dynamically imported dialogs by name.
 *
 * ```javascript
 * controller.use(new BotkitCMSHelper({
 *      uri: process.env.CMS_URI,
 *      token: process.env.CMS_TOKEN
 * }));
 *
 * // use the cms to test remote triggers
 * controller.on('message', async(bot, message) => {
 *   await controller.plugins.cms.testTrigger(bot, message);
 * });
 * ```
 */
class BotkitCMSHelper extends plugin_core_1.CmsPluginCore {
    constructor(config) {
        super();
        /**
         * Botkit Plugin name
         */
        this.name = 'Botkit CMS';
        this._config = config;
        if (config.controller) {
            this._controller = this._config.controller;
        }
        // for backwards compat, handle these alternate locations
        if (this._config.cms_uri && !this._config.uri) {
            this._config.uri = this._config.cms_uri;
        }
        if (this._config.cms_token && !this._config.token) {
            this._config.token = this._config.cms_token;
        }
        if (!this._config.uri) {
            throw new Error('Specify the root url of your Botkit CMS instance as `uri`');
        }
        if (!this._config.token) {
            throw new Error('Specify a token that matches one configured in your Botkit CMS instance as `token`');
        }
    }
    /**
     * Botkit plugin init function
     * Autoloads all scripts into the controller's main dialogSet.
     * @param botkit A Botkit controller object
     */
    init(botkit) {
        this._controller = botkit;
        this._controller.addDep('cms');
        // Extend the controller object with controller.plugins.cms
        botkit.addPluginExtension('cms', this);
        // pre-load all the scripts via the CMS api
        this.loadAllScripts(this._controller).then(() => {
            debug('Dialogs loaded from Botkit CMS');
            this._controller.completeDep('cms');
        }).catch((err) => {
            console.error(`****************************************************************\n${err}\n****************************************************************`);
        });
    }
    apiRequest(uri, params = {}, method = 'GET') {
        return __awaiter(this, void 0, void 0, function* () {
            const req = {
                uri: new url.URL(uri + '?access_token=' + this._config.token, this._config.uri),
                headers: {
                    'content-type': 'application/json'
                },
                method: method,
                form: params
            };
            debug('Make request to Botkit CMS: ', req);
            return new Promise((resolve, reject) => {
                request(req, function (err, res, body) {
                    if (err) {
                        debug('Error in Botkit CMS api: ', err);
                        return reject(err);
                    }
                    else {
                        debug('Raw results from Botkit CMS: ', body);
                        if (body === 'Invalid access token') {
                            return reject(new Error('Failed to load Botkit CMS content: Invalid access token provided.\nMake sure the token passed into the CMS plugin matches the token set in the CMS .env file.'));
                        }
                        let json = null;
                        try {
                            json = JSON.parse(body);
                        }
                        catch (err) {
                            debug('Error parsing JSON from Botkit CMS api: ', err);
                            return reject(err);
                        }
                        if (!json || json == null) {
                            reject(new Error('Botkit CMS API response was empty or invalid JSON'));
                        }
                        else if (json.error) {
                            if (res.statusCode === 401) {
                                console.error(json.error);
                            }
                            reject(json.error);
                        }
                        else {
                            resolve(json);
                        }
                    }
                });
            });
        });
    }
    getScripts() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.apiRequest('/api/v1/commands/list');
        });
    }
    evaluateTrigger(text) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.apiRequest('/api/v1/commands/triggers', {
                triggers: text
            }, 'POST');
        });
    }
    /**
     * Load all script content from the configured CMS instance into a DialogSet and prepare them to be used.
     * @param botkit The Botkit controller instance
     */
    loadAllScripts(botkit) {
        return __awaiter(this, void 0, void 0, function* () {
            const scripts = yield this.getScripts();
            scripts.forEach((script) => {
                // map threads from array to object
                const threads = {};
                script.script.forEach((thread) => {
                    threads[thread.topic] = thread.script.map(this.mapFields);
                });
                const d = new botkit_1.BotkitConversation(script.command, this._controller);
                d.script = threads;
                botkit.addDialog(d);
            });
        });
    }
    /**
     * Uses the Botkit CMS trigger API to test an incoming message against a list of predefined triggers.
     * If a trigger is matched, the appropriate dialog will begin immediately.
     * @param bot The current bot worker instance
     * @param message An incoming message to be interpreted
     * @returns Returns false if a dialog is NOT triggered, otherwise returns void.
     */
    testTrigger(bot, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const command = yield this.evaluateTrigger(message.text);
            if (command.command) {
                return yield bot.beginDialog(command.command);
            }
            return false;
        });
    }
}
exports.BotkitCMSHelper = BotkitCMSHelper;
//# sourceMappingURL=cms.js.map