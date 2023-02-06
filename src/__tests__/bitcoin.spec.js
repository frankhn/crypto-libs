import { fromWif, isP2SH, getP2wpkhAddressFromPublicKey } from "../bitcoin";
import { generateRandom12Words } from '../shared'
import { createBip32NodeFromTwelveWords } from '../key_import'

test('check is not P2pkh', () => {
    expect(isP2SH('xxxxxx')).toBe(false);
});

test('check fromWif bitcoin', () => {
    expect(fromWif('cSPeEQdqY6Uty2GfNy17eq1fSQ2pwqP6aDNC4yWZNZ1A4ompD6gY',true).toString('hex')).toBe('8f7f73e7cf05753c0915d87a602e565c37b72880f58dfd1d6dc51b6569d6d2a6');
});

// test('check address returned', () => {
//     const twelveWords = generateRandom12Words()
//     const pAddress = createBip32NodeFromTwelveWords(twelveWords, 'BTC')
//     const result = getP2wpkhAddressFromPublicKey(pAddress)
//     console.log(result, "ADDRESSES")
//     // expect()
// })