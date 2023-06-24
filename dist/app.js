"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const dotenv_1 = __importDefault(require("dotenv"));
const cloudconvert_1 = __importDefault(require("cloudconvert"));
const lit_auth_client_1 = require("@lit-protocol/lit-auth-client");
const constants_1 = require("@lit-protocol/constants");
const xmtp_1 = require("./xmtp");
const cloudConvert = new cloudconvert_1.default('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNDkyNjI2OGE2NTAzOTFmMzRlNzQzNDQ3MTZmNzVmNDkyYzMzNjIyMWUzNTQzNTgxMDAxZjMzNmU2NmQwZTQ4NjNlMDZiY2M1NWZkZGNhZjAiLCJpYXQiOjE2ODcwNzcwNDkuMTc3NjgsIm5iZiI6MTY4NzA3NzA0OS4xNzc2ODIsImV4cCI6NDg0Mjc1MDY0OS4xNzI1NjgsInN1YiI6IjY0MDQ4MDc2Iiwic2NvcGVzIjpbXX0.FqY8LFB_OeNX4jWvN3yuL8Dp5HQNWpnhSVCDSFnNQCuyXuZNtSpOej9ghHYNghqaj532CHXCFYqiEjiKr1Wo8tAoZ2K_yXZh_fglqqrNdMuY7i5OjnmkSTQm6E5r2NBbddpIC_2fMIFl01L5B4znbJXClWu8OGoY5KXraICxk-A8buxoIfucvCJsAEKoiFEc8Fa90HXRQLRqlZFYDe3Pih710eB6OrY0oJrcbaPbY_KNBb1JwrBTmFqz8FPHGCG-6-KBlaj2pZfU9e7GpJQpFVXHxqkLwKZm7iAHcmF2_LICft9P8Q46U-aV3mI2muJqQ9cVlB8aflVpY3fvScc-4RRYFlMb764d9raP7Mt2s8kYMJAIJDe241RlqNFx6CxcC5bIDrhzYOUZjWgQZ-40SVEqhqlf53mrBYvg_kPIZFZluf4Dq-lyhnkLlEjyCb1wk2KjPe8jJhDB16-zjYos3GQeHW03-qCmlI8AQuphBOyOf4WJkgRlGMwuZWJn541U4xyEmdf0yVfjY5Drn3oZVQ-01ssGfoMXrUZNNH3VVEz9M8WQS1sM7cZGba3MNUs5BTeVDRKckqIvfaluxmWluJiLS9ys6ED8A2gksfUnk09VB5V3aRXb0XfEwKoVMjIMdQWW83PHZJVLnAxcolQkYRStYQ8a0AfSUT_74XSF_tI');
dotenv_1.default.config();
const token = process.env.BOT_TOKEN;
const telegram = new telegraf_1.Telegram(token);
const bot = new telegraf_1.Telegraf(token);
const chatId = process.env.CHAT_ID;
let sessionBot;
bot.start((ctx) => {
    ctx.reply('Hola ' + ctx.from.first_name + '!');
});
bot.help((ctx) => {
    ctx.reply('Envia /lit');
    ctx.reply('Envia /air');
    ctx.reply('Envia /xmtp');
    ctx.reply('Envia /bridge');
});
bot.command('quit', (ctx) => {
    // Explicit usage
    ctx.telegram.leaveChat(ctx.message.chat.id);
    // Context shortcut
    ctx.leaveChat();
});
bot.command('lit', (ctx) => {
    ctx.reply('Aqui creo wallet con lit');
});
bot.command('air', (ctx) => {
    ctx.reply('Aqui obtengo data con airstack');
});
bot.command('bridge', (ctx) => {
    ctx.reply('Aqui se hace un bridge');
});
bot.command('nouns', async (ctx) => {
    ctx.reply('Envio nouns');
    let job = await cloudConvert.jobs.create({
        "tasks": {
            "import-my-file": {
                "operation": "import/url",
                "url": "https://api.cloudnouns.com/v1/pfp"
            },
            "convert-my-file": {
                "operation": "convert",
                "input": "import-my-file",
                "output_format": "png"
            },
            "export-my-file": {
                "operation": "export/url",
                "input": "convert-my-file"
            }
        }
    });
    let jobok = await cloudConvert.jobs.wait(job.id);
    console.log(jobok);
    await ctx.replyWithPhoto(telegraf_1.Input.fromURL('https://api.cloudnouns.com/v1/pfp'));
});
bot.command('xmtp', async (ctx) => {
    await (0, xmtp_1.chat)(ctx);
});
bot.command('register', async (ctx) => {
    ctx.reply('Aqui creo wallet con lit');
    const authClient = new lit_auth_client_1.LitAuthClient({
        litRelayConfig: {
            relayApiKey: 'C69EBCED-E13C-44B0-89CD-F4050BDF09C4_erik',
        }
    });
    // starting a validation session
    let session = authClient.initProvider(constants_1.ProviderType.Otp, {
        userId: '+527471086815'
    });
    sessionBot = session;
    let status = await session.sendOtpCode();
});
bot.command('confirm', async (ctx) => {
    const data = ctx.update.message.text.split(' ');
    const mycode = data[1];
    let authMethod = await sessionBot.authenticate({
        code: mycode
    });
    const txHash = await sessionBot.mintPKPThroughRelayer(authMethod);
});
bot.launch();
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
//# sourceMappingURL=app.js.map