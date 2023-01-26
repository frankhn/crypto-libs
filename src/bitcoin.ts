import bs58 from "bs58";
import { sha256 } from "./dingo";
import { checkStringAgainstWhiteList, isBs58 } from "./shared";
import { p2wpkh } from "bitcoinjs-lib/src/payments/index";

/**
 * Generates a P2wpkh bitcoin address based on a public key
 * @param publicKey
 * @param network
 * @returns {*}
 */
export const getP2wpkhAddressFromPublicKey = ( publicKey:Buffer) => {

    return p2wpkh({ pubkey: publicKey }).address;
}
// { checkStringAgainstWhiteList, shared.isBs58 }

export const isWif = (wif, testNet = false) => {
    if (!isBs58(wif)) {
        return false;
    }
    const raw = Buffer.from(bs58.decode(wif));
    if (raw.length !== 37 && raw.length !== 38) {
        return false;
    }
    if (raw[0] !== 0x80) {
        if (testNet === true && raw[0] === 239) {
            return true;
        }
        return false;
    }
    const checksum = sha256(sha256(raw.slice(0, raw.length - 4)));
    return raw.slice(raw.length - 4, raw.length).equals(checksum.slice(0, 4));
};

// Export private key to BTC WIF.
export const toWif = (privKey) => {
    const header = Buffer.from([0x80]);
    const data = privKey;
    const extra = Buffer.from([0x01]);
    const checksum = sha256(sha256(Buffer.concat([header, data, extra])));
    const buff = Buffer.concat([header, data, extra, checksum.slice(0, 4)])
    // @ts-ignore
    return bs58.encode(buff);
};

export const fromWif = (wif, testNet = false) => {
    if (!isWif(wif, testNet)) {
        //return new Error("Incorrect or unsupported format")
         throw new Error("Incorrect or unsupported format");
    }
    return Buffer.from(bs58.decode(wif)).slice(1, 1 + 32);
};

export const isBech32 = (address: string) => {
    return checkStringAgainstWhiteList(address.substring(4), 'qpzry9x8gf2tvdw0s3jn54khce6mua7l');
}

export const isBech32m = (address: string) => {
    return checkStringAgainstWhiteList(address.substring(4), 'qpzry9x8gf2tvdw0s3jn54khce6mua7l');
}

export const isP2pkh = (address: string) => {
    if (!isBs58(address)) {
        return false;
    }

    if (!address.startsWith('1') && !address.startsWith('mh')) {
        return false;
    }

    return address.length < 36 && address.length > 25;
};

export const isP2TR = (address: string) => {
    if (!isBech32m(address)) {
        return false;
    }

    if (!address.startsWith('bc1p') && !address.startsWith('tb1p')) {
        return false;
    }

    return address.length === 62;
};

export const isP2SH = (address: string) => {
    if (!isBs58(address)) {
        return false;
    }

    if (!address.startsWith('3') && !address.startsWith('2')) {
        return false;
    }

    return address.length < 36 && address.length > 25;
};

export const isP2WPKH = (address: string) => {
    if (!isBech32(address)) {
        return false;
    }

    if (!address.startsWith('bc1q') && !address.startsWith('tb1q')) {
        return false;
    }

    return address.length === 42;
};

export const isP2WSH = (address: string) => {
    if (!isBech32(address)) {
        return false;
    }

    if (!address.startsWith('bc1q') && !address.startsWith('tb1q')) {
        return false;
    }

    return address.length === 62;
};
