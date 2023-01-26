import secp256k1 from "secp256k1";
import bs58 from "bs58";
import { Buffer } from "safe-buffer";
import Sha256 from "sha256";
import RIPEMD160 from "ripemd160";
import { isBs58 } from "./shared";

global.Buffer = global.Buffer || require('buffer').Buffer


// Helper SHA256.
export const sha256 = (x) => {
    return Buffer.from(Sha256(x), "hex");
};

// Helper RIPEMD160.
export const ripemd160 = (x) => {
    return new RIPEMD160().update(x).digest();
};

// Validate WIF.
export const isWif = (wif) => {
    if (!isBs58(wif)) {
        return false;
    }
    const raw = Buffer.from(bs58.decode(wif));
    if (raw.length !== 37 && raw.length !== 38) {
        return false;
    }
    if (raw[0] !== 0x9e) {
        return false;
    }
    const checksum = sha256(sha256(raw.slice(0, raw.length - 4)));
    return raw.slice(raw.length - 4, raw.length).equals(checksum.slice(0, 4));
};


// Export private key to WIF.
export const toWif = (privKey) => {
    const header = Buffer.from([0x9e]);
    const data = privKey;
    const extra = Buffer.from([0x01]);
    const checksum = sha256(sha256(Buffer.concat([header, data, extra])));
    const buff = Buffer.concat([header, data, extra, checksum.slice(0, 4)])
    // @ts-ignore
    return bs58.encode(buff);
};


// Import private key from WIF.
export const fromWif = (wif) => {
    if (!isWif(wif)) {
  //      return new Error("Incorrect or unsupported format")
         throw new Error("Incorrect or unsupported format");
    }
    return Buffer.from(bs58.decode(wif)).slice(1, 1 + 32);
};


// Validate Dingocoin address.
export const isAddress = (address) => {
    if (!isBs58(address)) {
        return false;
    }
    const raw = Buffer.from(bs58.decode(address));

    if (raw.length !== 25) {
        return false;
    }
    if (raw[0] !== 0x16 && raw[0] !== 0x1e) {
        return false;
    }
    const checksum = sha256(sha256(raw.slice(0, 21)));
    return raw.slice(21, 25).equals(checksum.slice(0, 4));
};

 // Create Dingocoin address from secp256k1 priv key.
export function toAddress(privKey) {
    // @ts-ignore
    const pubKey = secp256k1.publicKeyCreate(privKey);
    // @ts-ignore
    const data = ripemd160(sha256(pubKey));
    const header = Buffer.from([0x1e]);
    const checksum = sha256(sha256(Buffer.concat([header, data]))).slice(0, 4);
    const buff = Buffer.concat([header, data, checksum])
    // @ts-ignore
    return bs58.encode(buff);
};


export function isP2pkh(address) {
    if (!isAddress(address)) {
        return false;
    }
    return bs58.decode(address)[0] === 0x1e;
};

export const isP2sh = (address) => {
    if (!isAddress(address) || !isBs58(address)) {
        return false;
    }

    if (!address.startsWith('9') || !address.startsWith('A')) {
        return false;
    }
    return (address.length > 25 && address.length < 35);
};
