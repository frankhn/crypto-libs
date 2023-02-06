import {createBip32NodeFromTwelveWords, determineKeyType} from "./key_import";
import {nodeToPrivateKey} from "./shared";
import {toWif} from "./dingo";
import {toWif as toWifBtc} from "./bitcoin";

export function getKeyValuesForProfilePage(key: string) {

    const returnObject = {
        twelveWords: undefined,
        btcPrivateKey: undefined,
        dingoDogePrivateKey: undefined,
        dingoDogeWif: undefined,
        btcWif: undefined,
    };
    const type = determineKeyType(key);
    let dogeDingoKey, btcPrivateKey;

    if (type.is12Words) {
        returnObject.twelveWords = key;
        const nodeBtc = createBip32NodeFromTwelveWords(key, 'BTC');
        const nodeDingoDoge = createBip32NodeFromTwelveWords(key, 'DOGE');
        btcPrivateKey = nodeToPrivateKey(nodeBtc);
        dogeDingoKey = nodeToPrivateKey(nodeDingoDoge);
        returnObject.btcPrivateKey = btcPrivateKey.toString('hex');
        returnObject.dingoDogePrivateKey = dogeDingoKey.toString('hex');
    } else if (type.isPrivateKey) {
        returnObject.btcPrivateKey = key;
        returnObject.dingoDogePrivateKey = key;
        dogeDingoKey = Buffer.from(key, 'hex');
        btcPrivateKey = Buffer.from(key, 'hex');
    }

    returnObject.dingoDogeWif = toWif(dogeDingoKey);
    returnObject.btcWif = toWifBtc(btcPrivateKey);

    return returnObject;
}
