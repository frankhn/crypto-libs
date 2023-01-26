import { signTransaction } from "../transaction";
import bi from "big-integer";
import { fromWif } from "../bitcoin";

const currency = 'BTC';
const fee = bi("1000"); // Spec. for calculation separately
const senderAddress = "tb1q98zkqpez4qey2l3ejj34hax79ffynqhclukrm2";
const privateKey = fromWif("cSPeEQdqY6Uty2GfNy17eq1fSQ2pwqP6aDNC4yWZNZ1A4ompD6gY", true);

const senderAmount = "10000";
let recipientAddress;
const vins = [
    { txid: "4aad84e2530ca1e8f1343d5e2d59105792779bd03255130cf8ead5fb20be296f", amount: "40000", vout: 1 }
];

test('test sign BTC transaction Native Segwit to Segwit-compatible', () => {
    recipientAddress = '2MtyXkDwyLQqWgki1tfbBoovaR2LCi3p669';
    expect(signTransaction(senderAmount, currency, senderAddress, recipientAddress, vins, fee, privateKey).toHex()).toBe('020000000001016f29be20fbd5eaf80c135532d09b77925710592d5e3d34f1e8a10c53e284ad4a0100000000ffffffff02102700000000000017a91412f86b622e305b75739fe1772b9a4fe289f2675b87487100000000000016001429c5600722a832457e3994a35bf4de2a524982f802473044022072434a464606748e0f4cdf816b17a2b57fa1e65791bc5a2edfc0910bfdbe654002205a4dc503d13137967b990564ee870b70c58a8d895cae5d7e8bd51baaf5671821012103608041c2a1364b48325cc90cc15eb892e817be2d0e6ebb522f2cc2dbfdaf58d600000000');
});

test('test sign BTC transaction Native Segwit to Native Segwit', () => {
    recipientAddress = "tb1qmjmxjz68ca47ntmqe5tlltm8ntcu52uy9rgvu3";
    expect(signTransaction(senderAmount, currency, senderAddress, recipientAddress, vins, fee, privateKey).toHex()).toBe('020000000001016f29be20fbd5eaf80c135532d09b77925710592d5e3d34f1e8a10c53e284ad4a0100000000ffffffff021027000000000000160014dcb6690b47c76be9af60cd17ffaf679af1ca2b84487100000000000016001429c5600722a832457e3994a35bf4de2a524982f802483045022100f6190841346863807d2050c379611c1757e5c782bce8cbd3d26195edbebddd1b0220799d3489e1096f630a8ca28f0c7555a52ab16f261ee65ad2ff848b65f354ac96012103608041c2a1364b48325cc90cc15eb892e817be2d0e6ebb522f2cc2dbfdaf58d600000000');
});

test('test sign BTC transaction Native Segwit to Legacy', () => {
    recipientAddress = "mhSYaxeavy3986mMfqPDfc7NhNWBhfQ8oN";
    expect(signTransaction(senderAmount, currency, senderAddress, recipientAddress, vins, fee, privateKey).toHex()).toBe('020000000001016f29be20fbd5eaf80c135532d09b77925710592d5e3d34f1e8a10c53e284ad4a0100000000ffffffff0210270000000000001976a914151acbfe62f6f1b93ec0d0eaa4c81b60b79db4eb88ac487100000000000016001429c5600722a832457e3994a35bf4de2a524982f802483045022100f470767ad5f95715f3439605d45e067971f296529e46bf509f3784ecd133e1a0022044e3c5e48c1b8bbe604f22536330213a63305b7953d562a51da9b0142fbdfee6012103608041c2a1364b48325cc90cc15eb892e817be2d0e6ebb522f2cc2dbfdaf58d600000000');
});

test('test sign BTC transaction Native Segwit to Taproot', () => {
    recipientAddress = "tb1pyh4w059mqzs5ecxnxwjl92n4uq3eqj039lz3penhf28r83xquxnqj0epq9";
    expect(signTransaction(senderAmount, currency, senderAddress, recipientAddress, vins, fee, privateKey).toHex()).toBe('020000000001016f29be20fbd5eaf80c135532d09b77925710592d5e3d34f1e8a10c53e284ad4a0100000000ffffffff02102700000000000022512025eae7d0bb00a14ce0d333a5f2aa75e0239049f12fc510e6774a8e33c4c0e1a6487100000000000016001429c5600722a832457e3994a35bf4de2a524982f8024730440220434c0ef64f9655cb8e01a6ea82b49122ef8e68db0dc4e2f00a17b6051618056d02205cd222810639f661b14e6b9fc61aaba6a7f5eaf4bbc8119bba52c968b6c4580a012103608041c2a1364b48325cc90cc15eb892e817be2d0e6ebb522f2cc2dbfdaf58d600000000');
});

const { fromWif: fromWifDingo } = require("../dingo");
const Dcurrency = 'DINGO';
const Dfee = bi("100000000"); // Spec. for calculation separately
const DsenderAddress = "DBphczK2Zrn7Ne3xvQzpMfxUEgbSdJ9wUV";
const DprivateKey = fromWifDingo("QQ325ssnFj8YoNMFYT5eFzyAis1LBFB8bVYm1d9Mppk1o1JgLrnZ")
const DsenderAmount = "1000000000";
const Dvins = [{ txid: "c13d94b091ab068ef30d6f6b983ed6e1d3fdd6a5b1583e00a2964051693aecf4", amount: "2000000000", vout: 0 }];

test('Dingo Legacy', () => {
    recipientAddress = "DSVQgywvodX8d29F9GiN4AAocpQg3VFJEk";
    expect(signTransaction(DsenderAmount, Dcurrency, DsenderAddress, recipientAddress, Dvins, Dfee, DprivateKey).toHex()).toBe('0100000001f4ec3a69514096a2003e58b1a5d6fdd3e1d63e986b6f0df38e06ab91b0943dc1000000006b483045022100d84e0b56b2113fd48e208779f71252993614331624a60010d3b24000f713d97502200bd6413bee451b5aaac95df2a254547710ef4f0a999bf58ed5fee8aff8155427012103b7a0d720290809b41c3e70ed21d9f8996bda90ed7b739218bea102a4c91b19acffffffff0200ca9a3b000000001976a914ea321ca586f081960f01a86448722cbb3cc1b84c88ac00e9a435000000001976a914494e4306e8df0b29c7ee02cc6149ac166fa0fe2c88ac00000000');
});

const D2currency = 'DINGO';
const D2fee = bi("200000000"); // Spec. for calculation separately
const D2senderAddress = "DBphczK2Zrn7Ne3xvQzpMfxUEgbSdJ9wUV";
const D2privateKey = fromWifDingo("QQ325ssnFj8YoNMFYT5eFzyAis1LBFB8bVYm1d9Mppk1o1JgLrnZ")
const D2senderAmount = "3000000000";
const D2vins = [{ txid: "eb102f890c6d8728454d624257067fa12fcbaba5158956fadc70fcb493370534", amount: "2100000000", vout: 0 }, { txid: "71b4355d1378951865daaecd672a14becdb72255a03a1bbb162a96cacd3ba59f", amount: "2200000000", vout: 0 }]

test('Dingo Legacy multi-input 2', () => {
    recipientAddress = "DSVQgywvodX8d29F9GiN4AAocpQg3VFJEk";
    expect(signTransaction(D2senderAmount, D2currency, D2senderAddress, recipientAddress, D2vins, D2fee, D2privateKey).toHex()).toBe('010000000234053793b4fc70dcfa568915a5abcb2fa17f065742624d4528876d0c892f10eb000000006a473044022014b0b5b9583c8f44ce26cc26cac1ed07531c77a744aea1a04ccc75b3717656750220695f22c72cebbc407939fdf2cc82ebc3841a1a5d4f9598d86cac4936be758a01012103b7a0d720290809b41c3e70ed21d9f8996bda90ed7b739218bea102a4c91b19acffffffff9fa53bcdca962a16bb1b3aa05522b7cdbe142a67cdaeda65189578135d35b471000000006b483045022100be0f5b87c906e82edde2c71bbec6449f3f3aea378e16985494c724bf1900fb380220222a64f9d390b5729216072e02ae5e40fdeff0e30fbaca99e7a2d022e8c2018e012103b7a0d720290809b41c3e70ed21d9f8996bda90ed7b739218bea102a4c91b19acffffffff02005ed0b2000000001976a914ea321ca586f081960f01a86448722cbb3cc1b84c88ac00ab9041000000001976a914494e4306e8df0b29c7ee02cc6149ac166fa0fe2c88ac00000000');
});

const D3vins = [{ txid: "c618aa436550a3fe66b64d1b8d522ebe606245abf6fbf8cb53b7cc3d363377ce", amount: "2300000000", vout: 0 }, { txid: "490fde158c22b3db3ab249002ee124c8930e96e126e71c5f3db287cc9aae727a", amount: "2400000000", vout: 0 }, { txid: "1ad3d9d9c2b362662021f529e0d16de130e7b37fdadf567be2798977e6da1881", amount: "2500000000", vout: 0 }];

test('Dingo Legacy multi-input', () => {
    recipientAddress = "DSVQgywvodX8d29F9GiN4AAocpQg3VFJEk";
    expect(signTransaction(D2senderAmount, D2currency, D2senderAddress, recipientAddress, D3vins, D2fee, D2privateKey).toHex()).toBe('0100000003ce7733363dccb753cbf8fbf6ab456260be2e528d1b4db666fea3506543aa18c6000000006b483045022100cdc87d0681b3304ff752978cf9e4682fc54d53037230e7cf9b8c52967f90b7e902203026c94e2ff417a0bf60cddc1d3eaffca616c3273f6e6bc961e0317e92f04140012103b7a0d720290809b41c3e70ed21d9f8996bda90ed7b739218bea102a4c91b19acffffffff7a72ae9acc87b23d5f1ce726e1960e93c824e12e0049b23adbb3228c15de0f49000000006b4830450221008cab506bb35b8fc074d6f3a56c50f84fd7dd9d2ed557c029bcd6db15e021be8702203f6a966f57cb74c756ab199be71657c87f26e4877ccd2ae54f965d1b422df8f2012103b7a0d720290809b41c3e70ed21d9f8996bda90ed7b739218bea102a4c91b19acffffffff8118dae6778979e27b56dfda7fb3e730e16dd1e029f521206662b3c2d9d9d31a000000006b483045022100e14e4eb0a1b942f91dcaa1deabc6c5d856a72d4871f1bba8ee22bcfc9182b7fd022075bd623765ae9b5a09240e8294426db2ecb833b6ed0d33ee6f0bc8f9022635bf012103b7a0d720290809b41c3e70ed21d9f8996bda90ed7b739218bea102a4c91b19acffffffff02005ed0b2000000001976a914ea321ca586f081960f01a86448722cbb3cc1b84c88ac00286bee000000001976a914494e4306e8df0b29c7ee02cc6149ac166fa0fe2c88ac00000000');
});

const Dogecurrency = 'DOGE';
const Dogefee = bi("300000"); // Spec. for calculation separately
const DogesenderAddress = "DUFY8jEpCMWvLqqX9eXN891ZvRKsmU6uEW";
const DogeprivateKey = fromWifDingo("QUdPbEKzuSgTBMu96auKmZm8gkQAs4Bu5ibZ6RyrTdZ2KiuX9nJh");
const DogesenderAmount = "10000000";
const Dogevins = [{ txid: "60dd94fa128e3d4c4346b201c804b1ad73fba7814fd98cc433be8f26e80f23c3", amount: "89569654", vout: 0 }];

test('Doge Legacy', () => {
    recipientAddress = "D7J9csRqgWAw6YxGQYHDuribkWCdR1dHct";
    expect(signTransaction(DogesenderAmount, Dogecurrency, DogesenderAddress, recipientAddress, Dogevins, Dogefee, DogeprivateKey).toHex()).toBe('0100000001c3230fe8268fbe33c48cd94f81a7fb73adb104c801b246434c3d8e12fa94dd60000000006a4730440220301e27d70d19b12ef4feb485b8bc3086e32637901cdc2580357b0552a0c35cb6022079aa54f5c0888bbfc029dd6d9ff7d90cccd176b44786fe89c74dbdd0911b83f80121022f0415cb63c785c1620da5253de250a4d99468e2be8797a6ea587ee83b861735ffffffff0280969800000000001976a91417a690dd09540ca1774277b59f788531ef67006088ac168fb904000000001976a914fd82c0fd073a9421125087db972423c8235d28a188ac00000000');
});

const Bcurrency = 'BTC';
const Bfee = bi("30000"); // Spec. for calculation separately
const BsenderAddress = "tb1qxjq0c6nn0ah2jsufvr8wpkrj8h3p926fcuh5xh";
const BprivateKey = fromWif("cQ2No2fJxx8UWzWTojtKBd6kf4s1hq2evQnyT72zEKHg5PXgKjvT", true);
const BsenderAmount = "300000";
const Bvins = [{ txid: "d5e27b3c64f918e8cdc05233db01d7f9d9d8cbf2329c1b9daf888ed4280b0c44", amount: "815577", vout: 1 }, { txid: "3d9c6d55cadbdb1b1e5e8146998223fa14c33e1316a1f241621b816def3d277d", amount: "50000", vout: 0 }]

test('BTC Multi-UTXO', () => {
    recipientAddress = "tb1qcjaxg80fayqcrx5y9wv0f5l2c49ajdg3xaluvt";
    expect(signTransaction(BsenderAmount, Bcurrency, BsenderAddress, recipientAddress, Bvins, Bfee, BprivateKey).toHex()).toBe('02000000000102440c0b28d48e88af9d1b9c32f2cbd8d9f9d701db3352c0cde818f9643c7be2d50100000000ffffffff7d273def6d811b6241f2a116133ec314fa23829946815e1e1bdbdbca556d9c3d0000000000ffffffff02e093040000000000160014c4ba641de9e901819a842b98f4d3eac54bd93511192c0800000000001600143480fc6a737f6ea9438960cee0d8723de212ab4902473044022058ab004e943b3feab1c1315d9dfc9081119652f72b444fca89378eeb2ca1c60e022037e884963d09bf7a0d063208dcfe6916cc8e101d6562df8ca8b3dd7d48a17a2001210275bfffd92ce224d6bc833fe8565dd1af8a8ab8eb2df1096f7d2659adbb69f9a40247304402201cd9e04e04ef10cef3ff5af0860709b97fa1fcd8cb0649d2b1e0ca031aa2883502201b0d03e1cd843c33ca7c199b25b0098b9f3d77839147bcd22b4fed4b838f092801210275bfffd92ce224d6bc833fe8565dd1af8a8ab8eb2df1096f7d2659adbb69f9a400000000');
});
