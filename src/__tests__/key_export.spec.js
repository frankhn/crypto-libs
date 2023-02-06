import {getKeyValuesForProfilePage} from "../key_export";

test('export keys for profile page (12 words saved on profile)', () => {
    const input = 'shield tip flower sorry judge yard dilemma sure sunset pudding remember rubber';
    const profileValues = getKeyValuesForProfilePage(input);
    expect(profileValues.twelveWords).toBe(input);
    expect(profileValues.btcPrivateKey).toBe('89882802b926c58a927462a8c7316fe77afc9d7647f9008809d17af86ee6d567');
    expect(profileValues.dingoDogePrivateKey).toBe('6b17d8c14589065cc9e066755ed5b30048ff138446ac9d024f3fe05b802dfcca');
    expect(profileValues.dingoDogeWif).toBe('QSCoVWPwmJB5QieemTGZBMZ8TemKGMQ6GL3Hg7NariQN9aQkv7u8');
    expect(profileValues.btcWif).toBe('L1q48kpEcUtxM98KvcurXXAKzKyv5svPggLKULLM3d2uCPFxwXyK');
});

test('export keys for profile page (private key saved on profile)', () => {
    const input = '89882802b926c58a927462a8c7316fe77afc9d7647f9008809d17af86ee6d567';
    const profileValues = getKeyValuesForProfilePage(input);
    expect(profileValues.twelveWords).toBe(undefined);
    expect(profileValues.btcPrivateKey).toBe('89882802b926c58a927462a8c7316fe77afc9d7647f9008809d17af86ee6d567');
    expect(profileValues.dingoDogePrivateKey).toBe('89882802b926c58a927462a8c7316fe77afc9d7647f9008809d17af86ee6d567');
    expect(profileValues.dingoDogeWif).toBe('QTDyHbdDs6P5afXNWtkeQjzwTN1V8S4CZw2EFxjBmyeFeKD8sEJD');
    expect(profileValues.btcWif).toBe('L1q48kpEcUtxM98KvcurXXAKzKyv5svPggLKULLM3d2uCPFxwXyK');
});
