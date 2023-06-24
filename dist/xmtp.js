"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chat = void 0;
const xmtp_js_1 = require("@xmtp/xmtp-js");
const ethers_1 = require("ethers");
const chat = async (ctx) => {
    const data = ctx.update.message.text.split(' ');
    const wallet = data[1];
    const mymessage = data.slice(2).join(' ');
    //aqui tengo que cambiar la wallet que se genera con lit
    const walletenvia = ethers_1.ethers.Wallet.createRandom();
    const xmtp = await xmtp_js_1.Client.create(walletenvia, { env: "production" });
    const conv = await xmtp.conversations.newConversation(wallet);
    const message = await conv.send(mymessage);
    ctx.reply('message delivered');
};
exports.chat = chat;
//# sourceMappingURL=xmtp.js.map