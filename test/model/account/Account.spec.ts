/*
 * Copyright 2023 ProximaX
 * Copyright 2018 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {expect} from 'chai';
import { Crypto, DerivationScheme } from '../../../src/core/crypto';
import {Account} from '../../../src/model/account/Account';
import {NetworkType} from '../../../src/model/blockchain/NetworkType';


describe('Account', () => {
    const accountInformation = {
        address: 'SCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPRLIKCF2',
        privateKey: '26b64cb10f005e5988a36744ca19e20d835ccc7c105aaa5f3b212da593180930'.toUpperCase(),
        publicKey: 'c2f93346e27ce6ad1a9f8f5e3066f8326593a406bdf357acb041e2f9ab402efe'.toUpperCase(),
    };

    it('should be created via private key', () => {
        const account = Account.createFromPrivateKey(accountInformation.privateKey, NetworkType.MIJIN_TEST, 1);
        expect(account.publicKey).to.be.equal(accountInformation.publicKey);
        expect(account.privateKey).to.be.equal(accountInformation.privateKey);
        expect(account.address.plain()).to.be.equal(accountInformation.address);
    });

    it('should throw exception when the private key is not valid', () => {
        expect(() => {
            Account.createFromPrivateKey('', NetworkType.MIJIN_TEST, 1);
        }).to.throw();
    });

    it('should generate a new account', () => {
        const account = Account.generateNewAccount(NetworkType.MIJIN_TEST);
        expect(account.publicKey).to.not.be.equal(undefined);
        expect(account.privateKey).to.not.be.equal(undefined);
        expect(account.address).to.not.be.equal(undefined);
    });

    it('should create a new account from random mnemonic', () => {
        const mnemonic = Crypto.randomMnemonic(256);
        const account = Account.createFromMnemonic(mnemonic, NetworkType.MIJIN_TEST, 1);
        expect(account.publicKey).to.not.be.equal(undefined);
        expect(account.privateKey).to.not.be.equal(undefined);
        expect(account.address).to.not.be.equal(undefined);
    });

/* not possible, need HD wallet implementation to get the seed, refer to bip32 and bip39
    it('should create a new account from mnemonic with 12 words', () => {
        const mnemonic = 'fish palm fall kick undo fine match welcome early three once unfair';
        const account = Account.createFromMnemonic(mnemonic,NetworkType.MIJIN_TEST);
   
        expect(account.publicKey).equal('3520DCC5F559FA5A5F64D837D1919052E4C00EA317FAEF6164657CA7E1803123');
        expect(account.privateKey).equal('524694E81B43FB4AA46313A73A39DA0929C8F98D1C5BD73B20806C1F5485C249');
        expect(account.address.plain()).equal('SAWLSZ5VWGPENUEZ6PY6DLSM7O4GEVM4MP2KQGNN');
    });
*/
    it('should create a new account from mnemonic with 24 words', () => {
        const mnemonic = 'forest pole smooth device derive party ribbon hedgehog spring tent frown mask alter tape describe such anchor goddess example screen pistol guilt close twin';
        const account = Account.createFromMnemonic(mnemonic,NetworkType.MIJIN_TEST, 1);

        expect(account.publicKey).equal('797B5E711FDBA4BEA0467717CF7FA4A6BD42390B251AF3DF9400A5DE7A24599F');
        expect(account.privateKey).equal('5B34F3339E53B7412E4354D33BE976443077BB8EE6C3086C8539E0CA56CF4AEF');
        expect(account.address.plain()).equal('SAGNWV5RA4CAAPJ7ZN5M2KIVCESEQCITMVTXX7LY');
    });

    describe('signData with account v1', () => {
        it('utf-8', () => {
            const account = Account.createFromPrivateKey(
                'AB860ED1FE7C91C02F79C02225DAC708D7BD13369877C1F59E678CC587658C47',
                NetworkType.MIJIN_TEST, 1
            );
            const publicAccount = account.publicAccount;
            const signed = account.signData('ProximaX rocks!');
            expect(publicAccount.verifySignature('ProximaX rocks!', signed))
                .to.be.true;
        });

        it('hexadecimal - bytes', () => {
            const account = Account.createFromPrivateKey(
                'AB860ED1FE7C91C02F79C02225DAC708D7BD13369877C1F59E678CC587658C47',
                NetworkType.MIJIN_TEST, 1
            );
            const publicAccount = account.publicAccount;
            const signed = account.signHexString('AA');
            expect(publicAccount.verifySignatureWithHexString('AA', signed))
                .to.be.true;
        });
    });

    describe('signData with account v2', () => {
        it('utf-8', () => {
            const account = Account.createFromPrivateKey(
                'AB860ED1FE7C91C02F79C02225DAC708D7BD13369877C1F59E678CC587658C47',
                NetworkType.MIJIN_TEST, 2
            );
            const publicAccount = account.publicAccount;
            const signed = account.signData('ProximaX rocks!');
            expect(publicAccount.verifySignature('ProximaX rocks!', signed))
                .to.be.true;
        });

        it('hexadecimal - bytes', () => {
            const account = Account.createFromPrivateKey(
                'AB860ED1FE7C91C02F79C02225DAC708D7BD13369877C1F59E678CC587658C47',
                NetworkType.MIJIN_TEST, 2
            );
            const publicAccount = account.publicAccount;
            const signed = account.signHexString('AA');
            expect(publicAccount.verifySignatureWithHexString('AA', signed))
                .to.be.true;
        });
    });
});

