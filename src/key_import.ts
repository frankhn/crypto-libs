import {isWif, fromWif, toAddress} from "./dingo";
import {isWif as isWifBtc, fromWif as fromBtcWif, getP2wpkhAddressFromPublicKey} from "./bitcoin";
import * as Bip39 from "bip39";

import {getPublicKeyFromPrivateKey} from "./shared";

/**
 * Used for import of keys in flip, will try to determine which key type is imported. Will throw an error if unable to determine type of invalid input
 *
 * @param  key
 * @returns {{is12Words: boolean, isBtcWif: boolean, isDogeDingoWif: boolean, isPrivateKey: boolean}}
 */
export function determineKeyType(key) {
    let is_12_words = false;
    let is_btc_wif = false;
    let is_doge_dingow_wif = false;
    let is_private_key = false;
    const length = key.split(" ").length;

    if (length === 12) {
        if (Bip39.validateMnemonic(key) === false) {
            throw new Error('Invalid 12 word phrase provided');
        }
        is_12_words = true;
    } else if (length === 1) {
        is_12_words = false;
        is_doge_dingow_wif = isWif(key);
        is_btc_wif = isWifBtc(key);
        if (is_btc_wif === false && is_doge_dingow_wif === false && key.length === 64) {
            is_private_key = true;
        }
    } else {
        throw new Error('Invalid format, more than one string provided but not 12 words.');
    }

    if (is_doge_dingow_wif === false && is_btc_wif === false && is_12_words === false && is_private_key === false) {
        throw new Error('Unknown format');
    }

    return {
        is12Words: is_12_words,
        isBtcWif: is_btc_wif,
        isDogeDingoWif: is_doge_dingow_wif,
        isPrivateKey: is_private_key,
    }
}

export function getPrivateKeyFromSavedKey(savedKey:Buffer, currency:string):Buffer {
    const type = determineKeyType(savedKey);

    if (type.is12Words) {
        return createBip32NodeFromTwelveWords(savedKey.toString(), currency).getWallet().getPrivateKey();
    } else if (type.isBtcWif) {
        return fromBtcWif(savedKey)
    } else if (type.isDogeDingoWif) {
        return fromWif(savedKey);
    } else {
        return savedKey;
    }
}

/**
 * Based on input key, return key in the type expected to be saved on device (unencrypted)
 * @param key
 */
export function prepareKeyForStorage(key) {
    const type = determineKeyType(key);

    if (type.is12Words) {
        return key;
    } else {
        // called with single argument
        return getPrivateKeyFromSavedKey(key, 'DINGO');
    }
}

export function createAddressResponse(btcAddress, dingoDogeAddress) {
    return {
        DINGO: dingoDogeAddress,
        DOGE: dingoDogeAddress,
        BTC: btcAddress
    }
}

export function createAddressesFromPrivateKey(privateKey) {

    const publicKey = getPublicKeyFromPrivateKey(privateKey);
    const address = getP2wpkhAddressFromPublicKey(publicKey);
    const dingoDogeAddress = toAddress(privateKey);

    return createAddressResponse(address, dingoDogeAddress)
}


/**
 *  Creates bitcoin, dogecoin and dingocoin addresses based on supported key input (12 words, private key, wif)
 * @param key
 */
export function createAddresses(key: string) {
    const type = determineKeyType(key);
    let privateKey;

    if (type.is12Words) {
        return createAddressesFrom12Words(key);
    } else if (type.isBtcWif) {
        privateKey = fromBtcWif(key)
    } else if (type.isDogeDingoWif) {
        privateKey = fromWif(key);
    } else {
        privateKey = Buffer.from(key, 'hex');
    }

    return createAddressesFromPrivateKey(privateKey);
}

export function createBip32NodeFromTwelveWords  (mnemonics: string, currency:string) {
    const seed =  Bip39.mnemonicToSeedSync(mnemonics);
    // const hdNode = hdkey.fromMasterSeed(seed);

    // if (currency === 'BTC') {
    //     return hdNode.derivePath("m/84'/0'/0'/0/0")
    // } else {
    //     return hdNode.derivePath("m/44'/3'/0'/0/0");
    // }
};

export function createAddressesFrom12Words(twelveWords) {
    const nodeBtc = createBip32NodeFromTwelveWords(twelveWords, 'BTC');
    const nodeDogeDingo = createBip32NodeFromTwelveWords(twelveWords, 'DOGE');

    return createAddressResponse(getP2wpkhAddressFromPublicKey(nodeBtc.getWallet().getPublicKey()), toAddress(nodeDogeDingo.getWallet().getPrivateKey()));
}
