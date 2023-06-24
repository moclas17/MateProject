import { Client } from "@xmtp/xmtp-js";
import { ethers } from  'ethers';

export const chat =async (ctx: any) => {
  const data = ctx.update.message.text.split(' ');
  const wallet = data[1]; 
  const mymessage = data.slice(2).join(' ');

  //aqui tengo que cambiar la wallet que se genera con lit
  const walletenvia=ethers.Wallet.createRandom();
  
  const xmtp = await Client.create(walletenvia, {env: "production" });
  const conv = await xmtp.conversations.newConversation( wallet );
  const message = await conv.send(mymessage);
  ctx.reply('message delivered');
    
}