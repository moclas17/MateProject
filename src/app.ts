import { Context, Markup, Telegraf, Telegram, Input } from 'telegraf';
import { Update } from 'typegram';
import dotenv from "dotenv";
import CloudConvert from 'cloudconvert';
import { LitAuthClient } from '@lit-protocol/lit-auth-client';
import { ProviderType } from '@lit-protocol/constants';

import { chat } from './xmtp';

const cloudConvert = new CloudConvert('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNDkyNjI2OGE2NTAzOTFmMzRlNzQzNDQ3MTZmNzVmNDkyYzMzNjIyMWUzNTQzNTgxMDAxZjMzNmU2NmQwZTQ4NjNlMDZiY2M1NWZkZGNhZjAiLCJpYXQiOjE2ODcwNzcwNDkuMTc3NjgsIm5iZiI6MTY4NzA3NzA0OS4xNzc2ODIsImV4cCI6NDg0Mjc1MDY0OS4xNzI1NjgsInN1YiI6IjY0MDQ4MDc2Iiwic2NvcGVzIjpbXX0.FqY8LFB_OeNX4jWvN3yuL8Dp5HQNWpnhSVCDSFnNQCuyXuZNtSpOej9ghHYNghqaj532CHXCFYqiEjiKr1Wo8tAoZ2K_yXZh_fglqqrNdMuY7i5OjnmkSTQm6E5r2NBbddpIC_2fMIFl01L5B4znbJXClWu8OGoY5KXraICxk-A8buxoIfucvCJsAEKoiFEc8Fa90HXRQLRqlZFYDe3Pih710eB6OrY0oJrcbaPbY_KNBb1JwrBTmFqz8FPHGCG-6-KBlaj2pZfU9e7GpJQpFVXHxqkLwKZm7iAHcmF2_LICft9P8Q46U-aV3mI2muJqQ9cVlB8aflVpY3fvScc-4RRYFlMb764d9raP7Mt2s8kYMJAIJDe241RlqNFx6CxcC5bIDrhzYOUZjWgQZ-40SVEqhqlf53mrBYvg_kPIZFZluf4Dq-lyhnkLlEjyCb1wk2KjPe8jJhDB16-zjYos3GQeHW03-qCmlI8AQuphBOyOf4WJkgRlGMwuZWJn541U4xyEmdf0yVfjY5Drn3oZVQ-01ssGfoMXrUZNNH3VVEz9M8WQS1sM7cZGba3MNUs5BTeVDRKckqIvfaluxmWluJiLS9ys6ED8A2gksfUnk09VB5V3aRXb0XfEwKoVMjIMdQWW83PHZJVLnAxcolQkYRStYQ8a0AfSUT_74XSF_tI');
dotenv.config();
const token: string = process.env.BOT_TOKEN as string;
const telegram: Telegram = new Telegram(token);
const bot: Telegraf<Context<Update>> = new Telegraf(token);
const chatId: string = process.env.CHAT_ID as string;
let sessionBot: any;

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
  await ctx.replyWithPhoto(Input.fromURL('https://api.cloudnouns.com/v1/pfp'));
});

bot.command('xmtp', async (ctx) => { 
  await chat(ctx);
});

bot.command('register', async (ctx) => { 
  ctx.reply('Aqui creo wallet con lit');
    const authClient = new LitAuthClient({
      litRelayConfig: {
          relayApiKey: 'C69EBCED-E13C-44B0-89CD-F4050BDF09C4_erik',
      }
  });

  // starting a validation session
  let session = authClient.initProvider(ProviderType.Otp,{
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
