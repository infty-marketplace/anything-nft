const { Message, format, sign, PersonalMessage } = require('js-conflux-sdk');

const message = '1';
const PREFIX = '\x19Conflux Signed Message:\n';
const PREFIX2 = '\u0019Conflux Signed Message:\n'; 
const signature = "0x0434f7c7a55d25935217713589cf76b43cb1badba2257dd2fda5cd8db199d12560b4243ed09c6b878b5436b336adc08bcd74060845597b2140dce325734f5d8801"
// message can be a normal string, or a hex encoded string
// const hexAddr = PersonalMessage.recoverPortalPersonalSign(signature, message);
const publicKey = PersonalMessage.recover(
    "0x38b9713aa578ccd601555e269da61e3c6352b3871a0a93760f78aed6c329544b6e60f2762303ea7495bb95a0adef73d926eab51130fe85484d65011c59d4972501",
    'Hello World',
    )
console.log(format.address(sign.publicKeyToAddress(publicKey), 1029))
// console.log(`PublicKey: ${publicKey}`)
//cfxtest:aatms2jxa3ma0xh9a81n12x1mzzkh682bj6z7v8cz3

// const addr = sign.publicKeyToAddress(publicKey)
// console.log(addr)
// const hexaddr = "0x"+addr.toString('hex')
// console.log(format.address(hexAddr, 1029));
// console.log(address.isValidCfxHexAddress(hexaddr));
// function recoverPortalPersonalSign(signature, message) {
//     let v = parseInt(signature.slice(130), 16) - 27;
//     signature = signature.slice(0, 130) + format.hex(v).slice(2);  // deal the value v
//     const messageHex = message.startsWith('0x') ? message : format.hex(Buffer.from(message));
//     let msg = new Message(PREFIX + messageHex.length + messageHex);
//     let publicKey = Message.recover(signature, msg.hash);
//     return '0x' + sign.publicKeyToAddress(format.hexBuffer(publicKey)).toString('hex')
//   }