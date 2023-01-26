import { isP2pkh, isP2sh } from "./dingo";
import { isP2pkh as isP2pkhBtc, isP2SH as isP2SHBtc, isP2SH, isP2TR, isP2WPKH, isP2WSH } from "./bitcoin";
import { Buffer } from "safe-buffer";
import bs58 from "bs58";
import bi from "big-integer";
import { script, Transaction } from "bitcoinjs-lib";
import secp256k1 from "secp256k1";
import { fromBech32 } from "bitcoinjs-lib/src/address";
import { isBs58, isDogeOrDingo } from "./shared";

const DUST_THRESHOLD = bi("1000");

export function signTransaction(senderAmount, currency, senderAddress, recipientAddress, vins, fee, privateKey) {
    const tx = new Transaction();
    const publicKey = Buffer.from(secp256k1.publicKeyCreate(privateKey));

    let inputAmount = bi(0);
    vins.forEach(function (vin) {
        inputAmount = inputAmount.add(bi(vin.amount));
    });

    if (isDogeOrDingo(currency)) {
        const P2PKH = isP2pkh(recipientAddress);
        const P2SH = isP2sh(recipientAddress);
    } else if (currency === 'BTC') {
        tx.version = 2;
        // For Bitcoin: Find out type of address & verify validity
        const P2PKH = isP2pkhBtc(recipientAddress);
        const P2WPKH = isP2WPKH(recipientAddress);
    }

    let hashOutput;
    if (isBs58(recipientAddress)) {
        hashOutput = Buffer.from(bs58.decode(recipientAddress)).slice(1, 21).toString("hex");
    } else if (isP2TR(recipientAddress)) {
        hashOutput = Buffer.from(fromBech32(recipientAddress).data).slice(0, 32).toString("hex");
    } else {
        hashOutput = Buffer.from(fromBech32(recipientAddress).data).slice(0, 21).toString("hex");
    }


    if (isP2pkh(recipientAddress) || isP2pkhBtc(recipientAddress)) {
        // @ts-ignore
        tx.addOutput(Buffer.from("76a914" + hashOutput + "88" + "ac", "hex"), bi(senderAmount));
    } else if (isP2SH(recipientAddress) || isP2SHBtc(recipientAddress)) {
        // @ts-ignore
        tx.addOutput(Buffer.from("a914" + hashOutput + "87", "hex"), bi(senderAmount));
    } else if (isP2TR(recipientAddress)) {
        // @ts-ignore
        tx.addOutput(Buffer.from("5120" + hashOutput, "hex"), bi(senderAmount));
    } else if (isP2WSH(recipientAddress) || isP2WPKH(recipientAddress)) {
        // @ts-ignore
        tx.addOutput(Buffer.from("0014" + hashOutput, "hex"), bi(senderAmount));
    }


    let hashInput;
    if (isDogeOrDingo(currency)) {
        hashInput = Buffer.from(bs58.decode(senderAddress)).slice(1, 21).toString("hex");
        if (inputAmount.subtract(senderAmount).subtract(fee).greaterOrEquals(DUST_THRESHOLD)) {
        // @ts-ignore
            tx.addOutput(Buffer.from("76" + "a9" + "14" + hashInput + "88" + "ac", "hex"), inputAmount.subtract(senderAmount).subtract(fee));
        }
    } else if (currency === 'BTC') {
        // IF BTC: Create change address output; first calculate hash of input (for change address and also later to be used for previous Script)
        hashInput = Buffer.from(fromBech32(senderAddress).data).slice(0, 21).toString("hex");
        if (inputAmount.subtract(senderAmount).subtract(fee).greaterOrEquals(DUST_THRESHOLD)) {
        // @ts-ignore
            tx.addOutput(Buffer.from("0014" + hashInput, "hex"), inputAmount.subtract(senderAmount).subtract(fee));
        }
    }


    // IF Doge/Dingo: Add Inputs and sign them - needs to be done for each vin
    if (isDogeOrDingo(currency)) {
        let instCounter = 0;
        vins.forEach(function (vin) {
        // @ts-ignore
            tx.addInput(Buffer.from(vin.txid, "hex").reverse(), vin.vout); // vins[0] to be incremented, to be done for each vin
        });
        vins.forEach(function (vin) {
            const prevScript = Buffer.from("76a914" + hashInput + "88ac", "hex");
        // @ts-ignore
            const signHash = tx.hashForSignature(instCounter, prevScript, Transaction.SIGHASH_ALL); // ER does 0 work?
            const signature = Buffer.from(secp256k1.ecdsaSign(signHash, privateKey).signature);
        // @ts-ignore
            const signatureDer = script.signature.encode(signature, Transaction.SIGHASH_ALL);
            const publicKey = Buffer.from(secp256k1.publicKeyCreate(privateKey));
        // @ts-ignore
            const scriptSig = Buffer.concat([Buffer.from([signatureDer.length]), signatureDer, Buffer.from([publicKey.length]), publicKey,]);
        // @ts-ignore
            tx.ins[instCounter].script = scriptSig; // ins[0] to be incremented and done for each vin; double-check if that is all which is needed
            instCounter++;
        });
    } else if (currency === 'BTC') {
        let instCounter = 0;
        vins.forEach(function (vin) {
        // @ts-ignore
            tx.addInput(Buffer.from(vin.txid, "hex").reverse(), vin.vout); // vins[0] to be incremented, to be done for each vin
        });

        vins.forEach(function (vin) {
            const prevScript = Buffer.from("76a914" + hashInput + "88ac", "hex");
        // @ts-ignore
            const signHash = tx.hashForWitnessV0(instCounter, prevScript, bi(vin.amount), Transaction.SIGHASH_ALL);
            const signature = Buffer.from(secp256k1.ecdsaSign(signHash, privateKey).signature);
        // @ts-ignore
            const signatureDer = script.signature.encode(signature, Transaction.SIGHASH_ALL);
        // @ts-ignore
            const scriptSig = Buffer.concat([signatureDer]);
        // @ts-ignore
            tx.ins[instCounter].witness = [scriptSig, Buffer.from(secp256k1.publicKeyCreate(privateKey))];
            instCounter++;
        });
    }

    return tx;
};
