import { determineKeyType, createAddresses, prepareKeyForStorage } from "../key_import";

test('determine BTC wif', () => {
    const input = 'L5EZftvrYaSudiozVRzTqLcHLNDoVn7H5HSfM9BAN6tMJX8oTWz6';
    expect(determineKeyType(input).isBtcWif).toBe(true);
    expect(determineKeyType(input).is12Words).toBe(false);
    expect(determineKeyType(input).isDogeDingoWif).toBe(false);
    expect(determineKeyType(input).isPrivateKey).toBe(false);
});

test('determine doge/dingo wif', () => {
    const input = 'QQ325ssnFj8YoNMFYT5eFzyAis1LBFB8bVYm1d9Mppk1o1JgLrnZ';
    expect(determineKeyType(input).isDogeDingoWif).toBe(true);
    expect(determineKeyType(input).is12Words).toBe(false);
    expect(determineKeyType(input).isBtcWif).toBe(false);
    expect(determineKeyType(input).isPrivateKey).toBe(false);
});

test('determine 12 words', () => {
    const input = 'shield tip flower sorry judge yard dilemma sure sunset pudding remember rubber';
    expect(determineKeyType(input).is12Words).toBe(true);
    expect(determineKeyType(input).isBtcWif).toBe(false);
    expect(determineKeyType(input).isDogeDingoWif).toBe(false);
    expect(determineKeyType(input).isPrivateKey).toBe(false);
});

test('determine private key', () => {
    const input = 'E9873D79C6D87DC0FB6A5778633389F4453213303DA61F20BD67FC233AA33262';
    const type = determineKeyType(input);
    expect(type.isPrivateKey).toBe(true);
    expect(type.is12Words).toBe(false);
    expect(type.isBtcWif).toBe(false);
    expect(type.isDogeDingoWif).toBe(false);
});

test('test 11 words determine key type', () => {
    expect(() => {
        determineKeyType('tip flower judge yard dilemma sure sunset pudding remember rubber');
    }).toThrow('Invalid format, more than one string provided but not 12 words.');
})

test('test address creation from bitcoin wif ------', async () => {
    const input = 'L5EZftvrYaSudiozVRzTqLcHLNDoVn7H5HSfM9BAN6tMJX8oTWz6';
    const addresses = await createAddresses(input);
    expect(addresses.DINGO).toBe('DJcczDr7oNvfj5qP17Qa7p9ZUNTfnYYDJC');
    expect(addresses.DOGE).toBe('DJcczDr7oNvfj5qP17Qa7p9ZUNTfnYYDJC');
    expect(addresses.BTC).toBe('bc1qj08ys4ct2hzzc2hcz6h2hgrvlmsjynawlht528');
});

test('test address creation from dingo wif', () => {
    const input = 'QQ325ssnFj8YoNMFYT5eFzyAis1LBFB8bVYm1d9Mppk1o1JgLrnZ';
    const addresses = createAddresses(input);
    expect(addresses.DINGO).toEqual('DBphczK2Zrn7Ne3xvQzpMfxUEgbSdJ9wUV');
    expect(addresses.DOGE).toEqual('DBphczK2Zrn7Ne3xvQzpMfxUEgbSdJ9wUV');
    expect(addresses.BTC).toEqual('bc1qf98yxphgmu9jn3lwqtxxzjdvzeh6pl3vr2ej56');
});

test('test address creation from dingo wif', () => {
    const input = 'ad2413018f2f4afedc7765a9bff1801e5072b8c72748000bc4a1b503cbdb9dc0';
    const addresses = createAddresses(input);
    expect(addresses.DINGO).toBe('DPVY5i5YrwipMg8VEepbED2SZYJWybkU6f');
    expect(addresses.DOGE).toBe('DPVY5i5YrwipMg8VEepbED2SZYJWybkU6f');
    expect(addresses.BTC).toBe('bc1qe98702jfazfqvgpmw06qw54s3cq9wayklut8ms');
});

 test('test prepare key for storage', () => {
     const input12Words = 'shield tip flower sorry judge yard dilemma sure sunset pudding remember rubber';
     expect(prepareKeyForStorage(input12Words)).toBe(input12Words);
     const inputPrivateKey = 'ad2413018f2f4afedc7765a9bff1801e5072b8c72748000bc4a1b503cbdb9dc0';
     expect(prepareKeyForStorage(inputPrivateKey)).toBe(inputPrivateKey);
 });


/*test('test address creation from 12 words', () => {
   const input = 'shield tip flower sorry judge yard dilemma sure sunset pudding remember rubber';
   const addresses = createAddresses(input);
   expect(addresses.DINGO).toBe('D8bQ6PyxKqWQHeG9aesAt2YENJSWdgxWp1');
   expect(addresses.DOGE).toBe('D8bQ6PyxKqWQHeG9aesAt2YENJSWdgxWp1');
   expect(addresses.BTC).toBe('bc1q3ue4uawjvzmqkt4lfj4vnwvm9wl2dnl7jlq56r');
});*/
