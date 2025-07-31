const aes = require ("aes-js");
import ConfigBase from "../configBase";


const key = aes.utils.utf8.toBytes(ConfigBase.AES_KEY);
if(key.length !== 32) throw new Error(`Invalid key size for AES. Must be 256-bits/ 32 bytes.`);


export function encrypt(text: string): string{
    const byteInfo = aes.utils.utf8.toBytes(text);
    const aesCtr =  new aes.ModeOfOperation.ctr(key);
    const encryptBytes = aesCtr.encrypt(byteInfo);
    return aes.utils.hex.fromBytes(encryptBytes)

}

export function decrypt(encryptedHex: string): string{
    const encrytedBytes = aes.utils.utf8.toBytes(encryptedHex);
    const aesCtr =  new aes.ModeOfOperation.ctr(key);
    const decryptedBytes = aesCtr.decrypt(encrytedBytes);
    return aes.utils.utf8.fromBytes(decryptedBytes);
}