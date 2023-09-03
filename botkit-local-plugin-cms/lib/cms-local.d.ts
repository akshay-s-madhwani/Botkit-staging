/**
 * @module botkit-plugin-cms
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { Botkit, BotkitMessage, BotkitPlugin, BotWorker } from 'botkit';
import { CmsPluginCore } from './plugin-core';
/**
 * A plugin for Botkit that provides access to local scripts in [Botkit CMS](https://github.com/howdyai/botkit-cms) format,
 * including the ability to load script content into a DialogSet and bind before, after and onChange handlers to those dynamically imported dialogs by name.
 *
 * ```javascript
 * const cms = require("botkit-cms")();
 * controller.usePlugin(new BotkitCmsLocalPlugin({
 *      cms,
 *      path: `${__dirname}/scripts.json`,
 *  }));
 *
 * // use the local cms to test dialog triggers
 * controller.on("message", async (bot, message) => {
 *     const results = await controller.plugins.cms.testTrigger(bot, message);
 *     return results === false;
 * });
 * ```
 */
export declare class BotkitCmsLocalPlugin extends CmsPluginCore implements BotkitPlugin {
    private _config;
    protected _controller: Botkit;
    name: string;
    /**
     * Constructor
     * @param config
     */
    constructor(config: LocalCmsOptions);
    /**
     * Botkit plugin init function
     * @param controller
     */
    init(controller: Botkit): void;
    /**
     * Evaluate if the message's text triggers a dialog from the CMS. Returns a promise
     * with the command object if found, or rejects if not found.
     *
     * @param text
     */
    evaluateTrigger(text: string): Promise<any>;
    /**
     * Uses the Botkit CMS trigger API to test an incoming message against a list of predefined triggers.
     * If a trigger is matched, the appropriate dialog will begin immediately.
     *
     * @param bot The current bot worker instance
     * @param message An incoming message to be interpreted
     * @returns Returns false if a dialog is NOT triggered, otherwise returns void.
     */
    testTrigger(bot: BotWorker, message: BotkitMessage): Promise<any>;
    /**
     * Get all scripts, optionally filtering by a tag
     * @param tag
     */
    getScripts(tag?: string): Promise<any[]>;
    /**
     * Load script from CMS by id
     * @param id
     */
    getScriptById(id: string): Promise<any>;
    /**
     * Load script from CMS by command
     * @param command
     */
    getScript(command: string): Promise<any>;
}
export interface LocalCmsOptions {
    path: string;
    cms: any;
}
