/**
 * @module botkit-plugin-cms
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { Botkit, BotkitMessage, BotWorker, BotkitPlugin } from 'botkit';
import { CmsPluginCore } from './plugin-core';
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
export declare class BotkitCMSHelper extends CmsPluginCore implements BotkitPlugin {
    private _config;
    protected _controller: Botkit;
    /**
     * Botkit Plugin name
     */
    name: string;
    constructor(config: CMSOptions);
    /**
     * Botkit plugin init function
     * Autoloads all scripts into the controller's main dialogSet.
     * @param botkit A Botkit controller object
     */
    init(botkit: any): void;
    private apiRequest;
    private getScripts;
    private evaluateTrigger;
    /**
     * Load all script content from the configured CMS instance into a DialogSet and prepare them to be used.
     * @param botkit The Botkit controller instance
     */
    loadAllScripts(botkit: Botkit): Promise<void>;
    /**
     * Uses the Botkit CMS trigger API to test an incoming message against a list of predefined triggers.
     * If a trigger is matched, the appropriate dialog will begin immediately.
     * @param bot The current bot worker instance
     * @param message An incoming message to be interpreted
     * @returns Returns false if a dialog is NOT triggered, otherwise returns void.
     */
    testTrigger(bot: BotWorker, message: Partial<BotkitMessage>): Promise<any>;
}
export interface CMSOptions {
    uri: string;
    token: string;
    controller?: Botkit;
}
