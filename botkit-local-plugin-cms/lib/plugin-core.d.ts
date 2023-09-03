import { BotkitDialogWrapper, BotWorker } from "botkit";
export declare abstract class CmsPluginCore {
    protected _controller: any;
    /**
     * Map some less-than-ideal legacy fields to better places
     */
    protected mapFields(line: any): void;
    /**
     * Bind a handler function that will fire before a given script and thread begin.
     * Provides a way to use BotkitConversation.before() on dialogs loaded dynamically via the CMS api instead of being created in code.
     *
     * ```javascript
     * controller.cms.before('my_script','my_thread', async(convo, bot) => {
     *
     *  // do stuff
     *  console.log('starting my_thread as part of my_script');
     *  // other stuff including convo.setVar convo.gotoThread
     *
     * });
     * ```
     *
     * @param script_name The name of the script to bind to
     * @param thread_name The name of a thread within the script to bind to
     * @param handler A handler function in the form async(convo, bot) => {}
     */
    before(script_name: string, thread_name: string, handler: (convo: BotkitDialogWrapper, bot: BotWorker) => Promise<void>): void;
    /**
     * Bind a handler function that will fire when a given variable is set within a a given script.
     * Provides a way to use BotkitConversation.onChange() on dialogs loaded dynamically via the CMS api instead of being created in code.
     *
     * ```javascript
     * controller.plugins.cms.onChange('my_script','my_variable', async(new_value, convo, bot) => {
     *
     * console.log('A new value got set for my_variable inside my_script: ', new_value);
     *
     * });
     * ```
     *
     * @param script_name The name of the script to bind to
     * @param variable_name The name of a variable within the script to bind to
     * @param handler A handler function in the form async(value, convo, bot) => {}
     */
    onChange(script_name: string, variable_name: string, handler: (value: any, convo: BotkitDialogWrapper, bot: BotWorker) => Promise<void>): void;
    /**
     * Bind a handler function that will fire after a given dialog ends.
     * Provides a way to use BotkitConversation.after() on dialogs loaded dynamically via the CMS api instead of being created in code.
     *
     * ```javascript
     * controller.plugins.cms.after('my_script', async(results, bot) => {
     *
     * console.log('my_script just ended! here are the results', results);
     *
     * });
     * ```
     *
     * @param script_name The name of the script to bind to
     * @param handler A handler function in the form async(results, bot) => {}
     */
    after(script_name: string, handler: (results: any, bot: BotWorker) => Promise<void>): void;
}
