import {isP2pkh, toWif} from "../dingo";
import {fromWif} from "../dingo";
import bs58 from "bs58";

test('check is not P2pkh', () => {
    expect(isP2pkh('2MtyXkDwyLQqWgki1tfbBoovaR2LCi3p669')).toBe(false);
});

test('check fromWif dingocoin', () => {
    expect(fromWif('QQ325ssnFj8YoNMFYT5eFzyAis1LBFB8bVYm1d9Mppk1o1JgLrnZ',true).toString('hex')).toBe('2a62bb515b801e5fc5cc5f542548bc4cff28b315616236ada4e8bec6df0b927e');
});
