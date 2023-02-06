import {generateMnemonic} from "bip39";
import bi from "big-integer";
import Web3Utils from "web3-utils";
import {Buffer} from "safe-buffer";
import secp256k1 from "secp256k1";

export function isBs58(x) {
    return x.match(/^[1-9A-HJ-NP-Za-km-z]+$/) !== null;
};

export const checkStringAgainstWhiteList = (string, whitelist) => {
    const whitelistSplit = whitelist.split("")
    const addressSplit = string.split("")

    return addressSplit.every(x => whitelistSplit.includes(x))
}

export function isDogeOrDingo(currency) {
    return (currency === 'DINGO' || currency === 'DOGE');
}

export function isValidCurrency(currency) {
    return (currency === 'DINGO' || currency === 'DOGE' || currency === 'BTC');
}

export function generateRandom12Words() {
    return generateMnemonic();
}

export function toSatoshi(x) {
    if (x === null || x === undefined || typeof x !== "string" || x === "") {
        throw new Error("Expected string input");
    }
    return (bi(Web3Utils.toWei(x, "gwei")).divide(bi(10))).toString();
};

export function fromSatoshi(x) {
    if (x === null || x === undefined || typeof x !== "string" || x === "") {
        throw new Error("Expected string input");
    }
    return Web3Utils.fromWei((bi(x).multiply(bi(10))).toString(), "gwei").toString();
};

export function getPublicKeyFromPrivateKey(privateKey: Uint8Array): Buffer {
    return Buffer.from(toPublicKey(privateKey));
}

// Get SECP256k1 public key of private key.
export function toPublicKey (privKey:Uint8Array):Uint8Array {
    return secp256k1.publicKeyCreate(privKey);
};


export function nodeToPrivateKey(node){
    return node.keyPair.d.toBuffer(32);
}
