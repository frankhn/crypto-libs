import { checkStringAgainstWhiteList, fromSatoshi, isBs58, toSatoshi } from "../shared";

test('check is bs58', () => {
    expect(isBs58('2MtyXkDwyLQqWgki1tfbBoovaR2LCi3p669')).toBe(true);
});

test('check is bs58 2', () => {
    expect(isBs58('2JdsZN4b464en')).toBe(true);
});

test('test checkStringAgainstWhiteList', () => {
    expect(checkStringAgainstWhiteList('abc', 'abcd')).toBe(true);
    expect(checkStringAgainstWhiteList('abc', 'abd')).toBe(false);
    expect(checkStringAgainstWhiteList('abc', 'a')).toBe(false);
    expect(checkStringAgainstWhiteList('abcq', 'abcqwertyuipl')).toBe(true);
});

test('test to satoshi', () => {
    expect(toSatoshi('1')).toBe('100000000');
});

test('test from satoshi', () => {
    expect(fromSatoshi('100000000')).toBe('1');
});
