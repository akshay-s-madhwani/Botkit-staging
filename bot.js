//  __   __  ___        ___
// |__) /  \  |  |__/ |  |  
// |__) \__/  |  |  \ |  |  

// This is the main file for the facebookBot bot.

// Import Botkit's core features
const { Botkit, BotkitBotFrameworkAdapter  } = require('botkit');
const { BotkitCMSHelper , BotkitCmsLocalPlugin } = require('./botkit-local-plugin-cms/lib/index');

// Import a platform-specific adapter for facebook.

const { FacebookAdapter, FacebookEventTypeMiddleware } = require('botbuilder-adapter-facebook');

const { MongoDbStorage } = require('botbuilder-storage-mongodb');

const restify = require('restify')
// Load process.env values from .env file
require('dotenv').config();
var cms = require('botkit-cms')();

let storage = null;
if (process.env.MONGO_URI) {
    storage = mongoStorage = new MongoDbStorage({
        url : process.env.MONGO_URI,
    });
}

const adapter = BotkitBotFrameworkAdapter;
// const adapter = new FacebookAdapter({

//     // REMOVE THIS OPTION AFTER YOU HAVE CONFIGURED YOUR APP!
//     enable_incomplete: true,

//     verify_token: process.env.FACEBOOK_VERIFY_TOKEN,
//     access_token: process.env.FACEBOOK_ACCESS_TOKEN,
//     app_secret: process.env.FACEBOOK_APP_SECRET,
// })

// // emit events based on the type of facebook event being received
// adapter.use(new FacebookEventTypeMiddleware());



const controller = new Botkit({
    webhook_uri: '/api/messages',

    adapter: adapter,

    storage,
    
});

// if (process.env.CMS_URI) {
//     controller.usePlugin(new BotkitCMSHelper({
//         uri: process.env.CMS_URI,
//         token: process.env.CMS_TOKEN,
//     }))
// }


controller.usePlugin(new BotkitCmsLocalPlugin({
    cms,
    path:__dirname + '/scripts.json'
})) 

if (process.env.CMS_URI) {
    controller.usePlugin(new FacebookAdapter({

        //     // REMOVE THIS OPTION AFTER YOU HAVE CONFIGURED YOUR APP!
          
        
            verify_token: process.env.FACEBOOK_VERIFY_TOKEN,
            access_token: process.env.FACEBOOK_ACCESS_TOKEN,
            app_secret: process.env.FACEBOOK_APP_SECRET,
        })
        )
}

 
// console.log(controller)
// Once the bot has booted up its internal services, you can use them to do stuff.
// controller.ready(() => {
console.log("Bot is ready")
    // load traditional developer-created local custom feature modules
    controller.loadModules(__dirname + '/features');
    /* catch-all that uses the CMS to trigger dialogs */
    if (controller.plugins.cms) {
        controller.on('message,direct_message', async (bot, message) => {
            let results = false;
            results = await controller.plugins.cms.testTrigger(bot, message);
           
            console.log(results)

            if (results !== false) {
                // do not continue middleware!
                return false;
            }
        });
    }
// });


// controller.on('message', async(bot, message) => {
//     await bot.reply(message, 'I heard a message!');
// });

controller.webserver.get('/', (req, res) => {

    res.send(`This app is running Botkit ${ controller.version }.`);

});