/*
 * Copyright 2023 ProximaX
 * Copyright 2019 NEM
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
import {Crypto, KeyPair} from '../../../src/core/crypto';
import { DerivationScheme } from '../../../src/core/crypto/DerivationScheme';
import {Convert as convert} from '../../../src/core/format';
import { Convert } from '../../../src/core/format/Convert';

describe('key pair', () => {
    const randomKeyPair = () => KeyPair.createKeyPairFromPrivateKeyString(convert.uint8ArrayToHex(Crypto.randomBytes(32)));
    const Private_Key_Size = 32;
    const Signature_Size = 64;

    const Private_Keys = [
        '8D31B712AB28D49591EAF5066E9E967B44507FC19C3D54D742F7B3A255CFF4AB',
        '15923F9D2FFFB11D771818E1F7D7DDCD363913933264D58533CB3A5DD2DAA66A',
        'A9323CEF24497AB770516EA572A0A2645EE2D5A75BC72E78DE534C0A03BC328E',
        'D7D816DA0566878EE739EDE2131CD64201BCCC27F88FA51BA5815BCB0FE33CC8',
        '27FC9998454848B987FAD89296558A34DEED4358D1517B953572F3E0AAA0A22D',
    ];

    describe('construction', () => {
        it('can extract from private key test vectors', () => {
            // Arrange:
            const Expected_Public_Keys = [
                '53C659B47C176A70EB228DE5C0A0FF391282C96640C2A42CD5BBD0982176AB1B',
                '3FE4A1AA148F5E76891CE924F5DC05627A87047B2B4AD9242C09C0ECED9B2338',
                'F398C0A2BDACDBD7037D2F686727201641BBF87EF458F632AE2A04B4E8F57994',
                '6A283A241A8D8203B3A1E918B1E6F0A3E14E75E16D4CFFA45AE4EF89E38ED6B5',
                '4DC62B38215826438DE2369743C6BBE6D13428405025DFEFF2857B9A9BC9D821',
            ];

            // Sanity:
            expect(Private_Keys.length).equal(Expected_Public_Keys.length);

            for (let i = 0; i < Private_Keys.length; ++i) {
                // Arrange:
                const privateKeyHex = Private_Keys[i];
                const expectedPublicKey = Expected_Public_Keys[i];

                // Act:
                const keyPair = KeyPair.createKeyPairFromPrivateKeyString(privateKeyHex);

                // Assert:
                const message = ` from ${privateKeyHex}`;
                expect(convert.uint8ArrayToHex(keyPair.publicKey), `public ${message}`).equal(expectedPublicKey);
                expect(convert.uint8ArrayToHex(keyPair.privateKey), `private ${message}`).equal(privateKeyHex);
            }
        });

        it('cannot extract from invalid private key', () => {
            // Arrange:
            const invalidPrivateKeys = [
                '', // empty
                '53C659B47C176A70EB228DE5C0A0FF391282C96640C2A42CD5BBD0982176AB', // short
                '53C659B47C176A70EB228DE5C0A0FF391282C96640C2A42CD5BBD0982176AB1BBB', // long
            ];

            // Act:
            invalidPrivateKeys.forEach((privateKey) => {
                // Assert:
                expect(() => {
                        KeyPair.createKeyPairFromPrivateKeyString(privateKey);
                    }, `from ${privateKey}`)
                    .to.throw('private key has unexpected size');
            });
        });
    });

    /**
     * @see https://raw.githubusercontent.com/nemtech/test-vectors/master/1.test-keys-catapult.json
     */
    describe('Catapult test vector - SHA3', () => {
        it('can extract from private key test vectors', () => {
            // Arrange:
            const Private_Key = [
                '575dbb3062267eff57c970a336ebbc8fbcfe12c5bd3ed7bc11eb0481d7704ced',
                '5b0e3fa5d3b49a79022d7c1e121ba1cbbf4db5821f47ab8c708ef88defc29bfe',
                '738ba9bb9110aea8f15caa353aca5653b4bdfca1db9f34d0efed2ce1325aeeda',
                'e8bf9bc0f35c12d8c8bf94dd3a8b5b4034f1063948e3cc5304e55e31aa4b95a6',
                'c325ea529674396db5675939e7988883d59a5fc17a28ca977e3ba85370232a83',
            ];

            const Expected_Public_Keys = [
                'BD8D3F8B7E1B3839C650F458234AB1FF87CDB1EDA36338D9E446E27D454717F2',
                '26821636A618FD524A3AB57276EFC36CAF787DF19EE00F60035CE376A18E8C47',
                'DFC7F40FC549AC8BB2EF097600103FF457A1D7DC5755D434474761459B030E6F',
                '96C7AB358EBB91104322C56435642BD939A77432286B229372987FC366EA319F',
                '9488CFB5D7D439213B11FA80C1B57E8A7AB7E41B64CBA18A89180D412C04915C',
            ];

            // Sanity:
            expect(Private_Key.length).equal(Expected_Public_Keys.length);

            for (let i = 0; i < Private_Key.length; ++i) {
                // Arrange:
                const privateKeyHex = Private_Key[i];
                const expectedPublicKey = Expected_Public_Keys[i];

                // Act:
                const keyPair = KeyPair.createKeyPairFromPrivateKeyString(privateKeyHex);

                // Assert:
                const message = ` from ${privateKeyHex}`;
                expect(convert.uint8ArrayToHex(keyPair.publicKey).toUpperCase(), `public ${message}`).equal(expectedPublicKey.toUpperCase());
                expect(convert.uint8ArrayToHex(keyPair.privateKey).toUpperCase(), `private ${message}`).equal(privateKeyHex.toUpperCase());
            }
        });

        it('cannot extract from invalid private key', () => {
            // Arrange:
            const invalidPrivateKeys = [
                '', // empty
                '53C659B47C176A70EB228DE5C0A0FF391282C96640C2A42CD5BBD0982176AB', // short
                '53C659B47C176A70EB228DE5C0A0FF391282C96640C2A42CD5BBD0982176AB1BBB', // long
            ];

            // Act:
            invalidPrivateKeys.forEach((privateKey) => {
                // Assert:
                expect(() => {
                        KeyPair.createKeyPairFromPrivateKeyString(privateKey);
                    }, `from ${privateKey}`)
                    .to.throw('private key has unexpected size');
            });
        });
    });

    describe('sign & verify- Test Vector', () => {

        /**
         * @see https://raw.githubusercontent.com/nemtech/test-vectors/master/2.test-sign-catapult.json
         */
        it('CATAPULT', () => {
            const Catapult_Private_Key = [
                'abf4cf55a2b3f742d7543d9cc17f50447b969e6e06f5ea9195d428ab12b7318d',
                '6aa6dad25d3acb3385d5643293133936cdddd7f7e11818771db1ff2f9d3f9215',
                '8e32bc030a4c53de782ec75ba7d5e25e64a2a072a56e5170b77a4924ef3c32a9',
                'c83ce30fcb5b81a51ba58ff827ccbc0142d61c13e2ed39e78e876605da16d8d7',
                '2da2a0aae0f37235957b51d15843edde348a559692d8fa87b94848459899fc27',
            ];
            const Catapult_Data = [
                '8ce03cd60514233b86789729102ea09e867fc6d964dea8c2018ef7d0a2e0e24bf7e348e917116690b9',
                'e4a92208a6fc52282b620699191ee6fb9cf04daf48b48fd542c5e43daa9897763a199aaa4b6f10546109f47ac3564fade0',
                '13ed795344c4448a3b256f23665336645a853c5c44dbff6db1b9224b5303b6447fbf8240a2249c55',
                'a2704638434e9f7340f22d08019c4c8e3dbee0df8dd4454a1d70844de11694f4c8ca67fdcb08fed0cec9abb2112b5e5f89',
                'd2488e854dbcdfdb2c9d16c8c0b2fdbc0abb6bac991bfe2b14d359a6bc99d66c00fd60d731ae06d0',
            ];
            const Expected_Signature = [
                '26E2C18BD0865AC141EDC181C61D2EC74231A4C8EB644C732D4830E82EB143094E7078086648964B0B91363E555907EC53E2AE7BD185D609805099F5C3A4CF07',
                '079B761E8C6A0AF15664D86E8DCCC67D78286384732CF3E36332E7E839DAB617C4A7F942B9C40F84513613089011378B43D43706648317564E3F77EF142F280A',
                '2AD313E2BFFE35A6AFBBCBC1AC673922EB760EC1FF91C35BAA76275E4E9BA3D9A5FA7F5B005D52F5E3B9DB381DD268499234C7F0774C297823693955C382D00B',
                'C846A755CF670A8C13861D27380568480FFC96D99CA2F560EC432DEE244D41D7B180EC6B756ED393A249C28932D6CE1BD5A3A7D28396DEBA7739BAEF611A180B',
                'DF852FB53BF166ACF784E2C906BFE35AA0A7D51A0193265288945111D066906C77874AD1E13555E274A4425673AF046B102137ADE1DF5A361614C7411B53F50F',
            ];

            for (let i = 0; i < Catapult_Private_Key.length; ++i) {
                // Arrange:
                const keyPair = KeyPair.createKeyPairFromPrivateKeyString(Catapult_Private_Key[i], DerivationScheme.Ed25519Sha3);
                const payload = Convert.hexToUint8(Catapult_Data[i]);

                // Act:
                const signature = KeyPair.sign(keyPair, payload, DerivationScheme.Ed25519Sha3);

                // Assert:
                const message = ` from ${Catapult_Private_Key[i]}`;
                expect(Convert.uint8ArrayToHex(signature).toUpperCase(),
                    `private ${message}`).to.deep.equal(Expected_Signature[i].toUpperCase());
                const isVerified = KeyPair.verify(keyPair.publicKey, payload, signature, DerivationScheme.Ed25519Sha3);
                expect(isVerified, `private ${message}`).to.equal(true);
            }
        });
    });

    describe('sign', () => {
        it('fills the signature', () => {
            // Arrange:
            const keyPair = randomKeyPair();
            const payload = Crypto.randomBytes(100);

            // Act:
            const signature = KeyPair.sign(keyPair, payload);

            // Assert:
            expect(signature).to.not.deep.equal(new Uint8Array(Signature_Size));
        });

        it('returns same signature for same data signed by same key pairs', () => {
            // Arrange:
            const privateKey = convert.uint8ArrayToHex(Crypto.randomBytes(Private_Key_Size));
            const keyPair1 = KeyPair.createKeyPairFromPrivateKeyString(privateKey);
            const keyPair2 = KeyPair.createKeyPairFromPrivateKeyString(privateKey);
            const payload = Crypto.randomBytes(100);

            // Act:
            const signature1 = KeyPair.sign(keyPair1, payload);
            const signature2 = KeyPair.sign(keyPair2, payload);

            // Assert:
            expect(signature2).to.deep.equal(signature1);
        });

        it('returns different signature for same data signed by different key pairs', () => {
            // Arrange:
            const keyPair1 = randomKeyPair();
            const keyPair2 = randomKeyPair();
            const payload = Crypto.randomBytes(100);

            // Act:
            const signature1 = KeyPair.sign(keyPair1, payload);
            const signature2 = KeyPair.sign(keyPair2, payload);

            // Assert:
            expect(signature2).to.not.deep.equal(signature1);
        });
    });

    describe('verify', () => {
        it('returns true for data signed with same key pair', () => {
            // Arrange:
            const keyPair = randomKeyPair();
            const payload = Crypto.randomBytes(100);
            const signature = KeyPair.sign(keyPair, payload);

            // Act:
            const isVerified = KeyPair.verify(keyPair.publicKey, payload, signature, DerivationScheme.Ed25519Sha3);

            // Assert:
            expect(isVerified).to.equal(true);
        });

        it('returns false for data signed with different key pair', () => {
            // Arrange:
            const keyPair1 = randomKeyPair();
            const keyPair2 = randomKeyPair();
            const payload = Crypto.randomBytes(100);
            const signature = KeyPair.sign(keyPair1, payload);

            // Act:
            const isVerified = KeyPair.verify(keyPair2.publicKey, payload, signature, DerivationScheme.Ed25519Sha3);

            // Assert:
            expect(isVerified).to.equal(false);
        });

        it('returns false if signature has been modified', () => {
            // Arrange:
            const keyPair = randomKeyPair();
            const payload = Crypto.randomBytes(100);

            for (let i = 0; i < Signature_Size; i += 4) {
                const signature = KeyPair.sign(keyPair, payload);
                signature[i] ^= 0xFF;

                // Act:
                const isVerified = KeyPair.verify(keyPair.publicKey, payload, signature, DerivationScheme.Ed25519Sha3);

                // Assert:
                expect(isVerified, `signature modified at ${i}`).to.equal(false);
            }
        });

        it('returns false if payload has been modified', () => {
            // Arrange:
            const keyPair = randomKeyPair();
            const payload = Crypto.randomBytes(44);

            for (let i = 0; i < payload.length; i += 4) {
                const signature = KeyPair.sign(keyPair, payload);
                payload[i] ^= 0xFF;

                // Act:
                const isVerified = KeyPair.verify(keyPair.publicKey, payload, signature, DerivationScheme.Ed25519Sha3);

                // Assert:
                expect(isVerified, `payload modified at ${i}`).to.equal(false);
            }
        });

        it('fails if public key is not on curve', () => {
            // Arrange:
            const keyPair = randomKeyPair();
            keyPair.publicKey.fill(0);
            keyPair.publicKey[keyPair.publicKey.length - 1] = 1;

            const payload = Crypto.randomBytes(100);
            const signature = KeyPair.sign(keyPair, payload);

            // Act:
            const isVerified = KeyPair.verify(keyPair.publicKey, payload, signature, DerivationScheme.Ed25519Sha3);

            // Assert:
            expect(isVerified).to.equal(false);
        });

        it('fails if public key does not correspond to private key', () => {
            // Arrange:
            const keyPair = randomKeyPair();
            const payload = Crypto.randomBytes(100);
            const signature = KeyPair.sign(keyPair, payload);

            for (let i = 0; i < keyPair.publicKey.length; ++i) {
                keyPair.publicKey[i] ^= 0xFF;
            }

            // Act:
            const isVerified = KeyPair.verify(keyPair.publicKey, payload, signature, DerivationScheme.Ed25519Sha3);

            // Assert:
            expect(isVerified).to.equal(false);
        });

        it('rejects zero public key', () => {
            // Arrange:
            const keyPair = randomKeyPair();
            keyPair.publicKey.fill(0);

            const payload = Crypto.randomBytes(100);
            const signature = KeyPair.sign(keyPair, payload);

            // Act:
            const isVerified = KeyPair.verify(keyPair.publicKey, payload, signature, DerivationScheme.Ed25519Sha3);

            // Assert:
            expect(isVerified).to.equal(false);
        });

        it('cannot verify non canonical signature', () => {
            function scalarAddGroupOrder(scalar) {
                // 2^252 + 27742317777372353535851937790883648493, little endian
                const Group_Order = [
                    0xed, 0xd3, 0xf5, 0x5c, 0x1a, 0x63, 0x12, 0x58, 0xd6, 0x9c, 0xf7, 0xa2, 0xde, 0xf9, 0xde, 0x14,
                    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x10,
                ];

                let r = 0;
                for (let i = 0; i < scalar.length; ++i) {
                    const t = scalar[i] + Group_Order[i];
                    scalar[i] += Group_Order[i] + r;
                    r = (t >> 8) & 0xFF;
                }
            }

            // Arrange:
            const keyPair = randomKeyPair();
            const payload = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);
            const canonicalSignature = KeyPair.sign(keyPair, payload);

            // this is signature with group order added to 'encodedS' part of signature
            const nonCanonicalSignature = canonicalSignature.slice();
            scalarAddGroupOrder(nonCanonicalSignature.subarray(32));

            // Act:
            const isCanonicalVerified = KeyPair.verify(keyPair.publicKey, payload, canonicalSignature, DerivationScheme.Ed25519Sha3);
            const isNonCanonicalVerified = KeyPair.verify(keyPair.privateKey, payload, nonCanonicalSignature, DerivationScheme.Ed25519Sha3);

            // Assert:
            expect(isCanonicalVerified).to.equal(true);
            expect(isNonCanonicalVerified).to.equal(false);
        });
    });

    describe('test vectors', () => {
        const Input_Data = [
            '8ce03cd60514233b86789729102ea09e867fc6d964dea8c2018ef7d0a2e0e24bf7e348e917116690b9',
            'e4a92208a6fc52282b620699191ee6fb9cf04daf48b48fd542c5e43daa9897763a199aaa4b6f10546109f47ac3564fade0',
            '13ed795344c4448a3b256f23665336645a853c5c44dbff6db1b9224b5303b6447fbf8240a2249c55',
            'a2704638434e9f7340f22d08019c4c8e3dbee0df8dd4454a1d70844de11694f4c8ca67fdcb08fed0cec9abb2112b5e5f89',
            'd2488e854dbcdfdb2c9d16c8c0b2fdbc0abb6bac991bfe2b14d359a6bc99d66c00fd60d731ae06d0',
        ];
        const Expected_Signatures = [
            'C9B1342EAB27E906567586803DA265CC15CCACA411E0AEF44508595ACBC47600D0' +
            '2527F2EED9AB3F28C856D27E30C3808AF7F22F5F243DE698182D373A9ADE03',
            '0755E437ED4C8DD66F1EC29F581F6906AB1E98704ECA94B428A25937DF00EC6479' +
            '6F08E5FEF30C6F6C57E4A5FB4C811D617FA661EB6958D55DAE66DDED205501',
            '15D6585A2A456E90E89E8774E9D12FE01A6ACFE09936EE41271AA1FBE0551264A9' +
            'FF9329CB6FEE6AE034238C8A91522A6258361D48C5E70A41C1F1C51F55330D',
            'F6FB0D8448FEC0605CF74CFFCC7B7AE8D31D403BCA26F7BD21CB4AC87B00769E9C' +
            'C7465A601ED28CDF08920C73C583E69D621BA2E45266B86B5FCF8165CBE309',
            'E88D8C32FE165D34B775F70657B96D8229FFA9C783E61198A6F3CCB92F487982D0' +
            '8F8B16AB9157E2EFC3B78F126088F585E26055741A9F25127AC13E883C9A05',
        ];

        function assertCanSignTestVectors() {
            // Sanity:
            expect(Private_Keys.length).equal(Input_Data.length);
            expect(Private_Keys.length).equal(Expected_Signatures.length);

            for (let i = 0; i < Private_Keys.length; ++i) {
                // Arrange:
                const inputData = convert.hexToUint8(Input_Data[i]);
                const keyPair = KeyPair.createKeyPairFromPrivateKeyString(Private_Keys[i]);

                // Act:
                const signature = KeyPair.sign(keyPair, inputData);

                // Assert:
                const message = `signing with ${Private_Keys[i]}`;
                expect(convert.uint8ArrayToHex(signature), message).equal(Expected_Signatures[i]);
            }
        }

        it('can sign test vectors as binary', () => {
            // Assert:
            assertCanSignTestVectors();
        });

        function assertCanVerifyTestVectors() {
            // Sanity:
            expect(Private_Keys.length).equal(Input_Data.length);
            expect(Private_Keys.length).equal(Expected_Signatures.length);

            for (let i = 0; i < Private_Keys.length; ++i) {
                // Arrange:
                const inputData = convert.hexToUint8(Input_Data[i]);
                const keyPair = KeyPair.createKeyPairFromPrivateKeyString(Private_Keys[i]);
                const signature = KeyPair.sign(keyPair, inputData);

                // Act:
                const isVerified = KeyPair.verify(keyPair.publicKey, inputData, signature, DerivationScheme.Ed25519Sha3);

                // Assert:
                const message = `verifying with ${Private_Keys[i]}`;
                expect(isVerified, message).equal(true);
            }
        }

        it('can verify test vectors as binary', () => {
            // Assert:
            assertCanVerifyTestVectors();
        });
    });

    describe('derive shared key', () => {
        const Salt_Size = 32;

        it('fails if salt is wrong size', () => {
            // Arrange: create a salt that is too long
            const keyPair = randomKeyPair();
            const publicKey = Crypto.randomBytes(32);
            const salt = Crypto.randomBytes(Salt_Size + 1);

            // Act:
            expect(() => {
                    KeyPair.deriveSharedKey(keyPair.privateKey, publicKey, salt, DerivationScheme.Ed25519Sha3);
                })
                .to.throw('salt has unexpected size');
        });

        it('derives same shared key for both partners', () => {
            // Arrange:
            const keyPair1 = randomKeyPair();
            const keyPair2 = randomKeyPair();
            const salt = Crypto.randomBytes(Salt_Size);

            // Act:
            const sharedKey1 = KeyPair.deriveSharedKey(keyPair1.privateKey, keyPair2.publicKey, salt, DerivationScheme.Ed25519Sha3);
            const sharedKey2 = KeyPair.deriveSharedKey(keyPair2.privateKey, keyPair1.publicKey, salt, DerivationScheme.Ed25519Sha3);

            // Assert:
            expect(sharedKey1).to.deep.equal(sharedKey2);
        });

        it('derives different shared keys for different partners', () => {
            // Arrange:
            const keyPair = randomKeyPair();
            const publicKey1 = Crypto.randomBytes(32);
            const publicKey2 = Crypto.randomBytes(32);
            const salt = Crypto.randomBytes(Salt_Size);

            // Act:
            const sharedKey1 = KeyPair.deriveSharedKey(keyPair.privateKey, publicKey1, salt, DerivationScheme.Ed25519Sha3);
            const sharedKey2 = KeyPair.deriveSharedKey(keyPair.privateKey, publicKey2, salt, DerivationScheme.Ed25519Sha3);

            // Assert:
            expect(sharedKey1).to.not.deep.equal(sharedKey2);
        });

        it('can derive deterministic shared key from well known inputs', () => {
            // Arrange:
            const keyPair = KeyPair.createKeyPairFromPrivateKeyString('8F545C2816788AB41D352F236D80DBBCBC34705B5F902EFF1F1D88327C7C1300');
            const publicKey = convert.hexToUint8('BF684FB1A85A8C8091EE0442EDDB22E51683802AFA0C0E7C6FE3F3E3E87A8D72');
            const salt = convert.hexToUint8('422C39DF16AAE42A74A5597D6EE2D59CFB4EEB6B3F26D98425B9163A03DAA3B5');

            // Act:
            const sharedKey = KeyPair.deriveSharedKey(keyPair.privateKey, publicKey, salt, DerivationScheme.Ed25519Sha3);

            // Assert:
            expect(convert.uint8ArrayToHex(sharedKey)).to.equal('007FD607264C64C7BB83509E7CFA96E0FEAF34A373CDA75FACAA4DE9E141257B');
        });
    });

    /**
     * @see https://github.com/nemtech/test-vectors/blob/master/3.test-derive-catapult.json
     */
    describe('derive shared key - Test Vecto Catapult', () => {
        it('derive shared key using sha3', () => {
            // Arrange: create a salt that is too long
            // Arrange:
            const Private_Key = [
                '00137c7c32881d1fff2e905f5b7034bcbcdb806d232f351db48a7816285c548f',
                'e8857f8e488d4e6d4b71bcd44bb4cff49208c32651e1f6500c3b58cafeb8def6',
                'd7f67b5f52cbcd1a1367e0376a8eb1012b634acfcf35e8322bae8b22bb9e8dea',
                'd026ddb445fb3bbf3020e4b55ed7b5f9b7fd1278c34978ca1a6ed6b358dadbae',
                'c522b38c391d1c3fa539cc58802bc66ac34bb3c73accd7f41b47f539bedcd016',
            ];

            const Public_Keys = [
                'bf684fb1a85a8c8091ee0442eddb22e51683802afa0c0e7c6fe3f3e3e87a8d72',
                '9d8e5f200b05a2638fb084a375408cabd6d5989590d96e3eea5f2cb34668178e',
                '9735c92d150dcee0ade5a8d1822f46a4db22c9cda25f33773ae856fe374a3e8a',
                'd19e6beca3b26b9d1abc127835ebeb7a6c19c33dec8ec472e1c4d458202f4ec8',
                'ea5b6a0053237f7712b1d2347c447d3e83e0f2191762d07e1f53f8eb7f2dfeaa',
            ];

            const Salt = [
                '422c39df16aae42a74a5597d6ee2d59cfb4eeb6b3f26d98425b9163a03daa3b5',
                'ad63ac08f9afc85eb0bf4f8881ca6eaa0215924c87aa2f137d56109bb76c6f98',
                '96104f0a28f9cca40901c066cd435134662a3b053eb6c8df80ee0d05dc941963',
                'd8f94a0bbb1de80aea17aab42e2ffb982e73fc49b649a318479e951e392d8728',
                '3f8c969678a8abdbfb76866a142c284a6f01636c1c1607947436e0d2c30d5245',
            ];

            const Expected_Derived_Key = [
                '32628d4ecf167487881de9e81466614a3442c1b1f6eb146ebe7ad69c37184696',
                'da30f8081c065f5c4e2d17a551af3634a63395991af9642c29a7bbc9312b98a5',
                '58c9a027b30fcbec8ac7962df1eb81f27317ab6f39ada66be8d9453653a305af',
                '58815adb5f8ef154c6091c65b28e3d6d5ea25da40040e7489ee05f65ecffa61c',
                '8c677358d7512c4d53b0f5d59cff421625851322fae4c66e98f670c49c916f32',
            ];

            for (let i = 0; i < Private_Key.length; ++i) {
                // Arrange:
                const keyPair = KeyPair.createKeyPairFromPrivateKeyString(Private_Key[i]);
                const publicKey = Convert.hexToUint8(Public_Keys[i]);
                const salt = Convert.hexToUint8(Salt[i]);

                // Act:
                const sharedKey = Convert.uint8ArrayToHex(KeyPair.deriveSharedKey(keyPair.privateKey, publicKey, salt, DerivationScheme.Ed25519Sha3));

                // Assert:
                const message = ` from ${Private_Key[i]}`;
                expect(sharedKey.toUpperCase()).to.deep.equal(Expected_Derived_Key[i].toUpperCase());
            }
        });
    });
});

describe('account v2 key pair', () => {
    const randomKeyPairV2 = () => KeyPair.createKeyPairFromPrivateKeyString(convert.uint8ArrayToHex(Crypto.randomBytes(32)), DerivationScheme.Ed25519Sha2);
    const Private_Key_Size = 32;
    const Signature_Size = 64;

    const Private_Keys = [
        '8D31B712AB28D49591EAF5066E9E967B44507FC19C3D54D742F7B3A255CFF4AB',
        '15923F9D2FFFB11D771818E1F7D7DDCD363913933264D58533CB3A5DD2DAA66A',
        'A9323CEF24497AB770516EA572A0A2645EE2D5A75BC72E78DE534C0A03BC328E',
        'D7D816DA0566878EE739EDE2131CD64201BCCC27F88FA51BA5815BCB0FE33CC8',
        '27FC9998454848B987FAD89296558A34DEED4358D1517B953572F3E0AAA0A22D',
    ];

    /**
     * @see https://github.com/symbol/symbol/blob/dev/tests/vectors/symbol/crypto/1.test-keys.json
     */
    describe('Catapult test vector - SHA2 - v2 account', () => {
        it('can extract from private key test vectors', () => {
            // Arrange:
            const Private_Key = [
                "575DBB3062267EFF57C970A336EBBC8FBCFE12C5BD3ED7BC11EB0481D7704CED",
                "5B0E3FA5D3B49A79022D7C1E121BA1CBBF4DB5821F47AB8C708EF88DEFC29BFE",
                "738BA9BB9110AEA8F15CAA353ACA5653B4BDFCA1DB9F34D0EFED2CE1325AEEDA",
                "E8BF9BC0F35C12D8C8BF94DD3A8B5B4034F1063948E3CC5304E55E31AA4B95A6",
                "C325EA529674396DB5675939E7988883D59A5FC17A28CA977E3BA85370232A83"
            ];

            const Expected_Public_Keys = [
                "2E834140FD66CF87B254A693A2C7862C819217B676D3943267156625E816EC6F",
                "4875FD2E32875D1BC6567745F1509F0F890A1BF8EE59FA74452FA4183A270E03",
                "9F780097FB6A1F287ED2736A597B8EA7F08D20F1ECDB9935DE6694ECF1C58900",
                "0815926E003CDD5AF0113C0E067262307A42CD1E697F53B683F7E5F9F57D72C9",
                "3683B3E45E76870CFE076E47C2B34CE8E3EAEC26C8AA7C1ED752E3E840AF8A27"
            ];

            // Sanity:
            expect(Private_Key.length).equal(Expected_Public_Keys.length);

            for (let i = 0; i < Private_Key.length; ++i) {
                // Arrange:
                const privateKeyHex = Private_Key[i];
                const expectedPublicKey = Expected_Public_Keys[i];

                // Act:
                const keyPair = KeyPair.createKeyPairFromPrivateKeyString(privateKeyHex, DerivationScheme.Ed25519Sha2);

                // Assert:
                const message = ` from ${privateKeyHex}`;
                expect(convert.uint8ArrayToHex(keyPair.publicKey).toUpperCase(), `public ${message}`).equal(expectedPublicKey.toUpperCase());
                expect(convert.uint8ArrayToHex(keyPair.privateKey).toUpperCase(), `private ${message}`).equal(privateKeyHex.toUpperCase());
            }
        });

        it('cannot extract from invalid private key', () => {
            // Arrange:
            const invalidPrivateKeys = [
                '', // empty
                '53C659B47C176A70EB228DE5C0A0FF391282C96640C2A42CD5BBD0982176AB', // short
                '53C659B47C176A70EB228DE5C0A0FF391282C96640C2A42CD5BBD0982176AB1BBB', // long
            ];

            // Act:
            invalidPrivateKeys.forEach((privateKey) => {
                // Assert:
                expect(() => {
                        KeyPair.createKeyPairFromPrivateKeyString(privateKey, DerivationScheme.Ed25519Sha2);
                    }, `from ${privateKey}`)
                    .to.throw('private key has unexpected size');
            });
        });
    });

    /**
     * @see https://github.com/symbol/symbol/blob/dev/tests/vectors/symbol/crypto/2.test-sign.json
     */
    describe('sign & verify - v2 account - Symbol', () => {

        it('should have correct verifiable signature', () => {

            const Private_Keys = [
                "ABF4CF55A2B3F742D7543D9CC17F50447B969E6E06F5EA9195D428AB12B7318D",
                "6AA6DAD25D3ACB3385D5643293133936CDDDD7F7E11818771DB1FF2F9D3F9215",
                "8E32BC030A4C53DE782EC75BA7D5E25E64A2A072A56E5170B77A4924EF3C32A9",
                "C83CE30FCB5B81A51BA58FF827CCBC0142D61C13E2ED39E78E876605DA16D8D7",
                "2DA2A0AAE0F37235957B51D15843EDDE348A559692D8FA87B94848459899FC27"
            ]

            const Signing_Data = [
                '8CE03CD60514233B86789729102EA09E867FC6D964DEA8C2018EF7D0A2E0E24BF7E348E917116690B9',
                'E4A92208A6FC52282B620699191EE6FB9CF04DAF48B48FD542C5E43DAA9897763A199AAA4B6F10546109F47AC3564FADE0',
                '13ED795344C4448A3B256F23665336645A853C5C44DBFF6DB1B9224B5303B6447FBF8240A2249C55',
                'A2704638434E9F7340F22D08019C4C8E3DBEE0DF8DD4454A1D70844DE11694F4C8CA67FDCB08FED0CEC9ABB2112B5E5F89',
                'D2488E854DBCDFDB2C9D16C8C0B2FDBC0ABB6BAC991BFE2B14D359A6BC99D66C00FD60D731AE06D0',
            ];

            const Expected_Signatures = [
                "31D272F0662915CAC43AB7D721CAF65D8601F52B2E793EA1533E7BC20E04EA97B74859D9209A7B18DFECFD2C4A42D6957628F5357E3FB8B87CF6A888BAB4280E",
                "F21E4BE0A914C0C023F724E1EAB9071A3743887BB8824CB170404475873A827B301464261E93700725E8D4427A3E39D365AFB2C9191F75D33C6BE55896E0CC00",
                "939CD8932093571E24B21EA53F1359279BA5CFC32CE99BB020E676CF82B0AA1DD4BC76FCDE41EF784C06D122B3D018135352C057F079C926B3EFFA7E73CF1D06",
                "9B4AFBB7B96CAD7726389C2A4F31115940E6EEE3EA29B3293C82EC8C03B9555C183ED1C55CA89A58C17729EFBA76A505C79AA40EC618D83124BC1134B887D305",
                "7AF2F0D9B30DE3B6C40605FDD4EBA93ECE39FA7458B300D538EC8D0ABAC1756DEFC0CA84C8A599954313E58CE36EFBA4C24A82FD6BB8127023A58EFC52A8410A"
            ];

            for (let i = 0; i < Private_Keys.length; ++i) {
                // Arrange:
                const keyPair = KeyPair.createKeyPairFromPrivateKeyString(Private_Keys[i], DerivationScheme.Ed25519Sha2);
                const payload = Convert.hexToUint8(Signing_Data[i]);

                // Act:
                const signature = KeyPair.sign(keyPair, payload, DerivationScheme.Ed25519Sha2);
                
                // Assert:
                const message = ` from ${Private_Keys[i]}`;
                const isVerified = KeyPair.verify(keyPair.publicKey, payload, signature, DerivationScheme.Ed25519Sha2);
                expect(isVerified, `private ${message}`).to.equal(true);
                expect(convert.uint8ArrayToHex(signature), message).equal(Expected_Signatures[i]);
            }
        });
    });

    describe('sign - Symbol key pair', () => {
        it('fills the signature', () => {
            // Arrange:
            const keyPair = randomKeyPairV2();
            const payload = Crypto.randomBytes(100);

            // Act:
            const signature = KeyPair.sign(keyPair, payload, DerivationScheme.Ed25519Sha2);

            // Assert:
            expect(signature).to.not.deep.equal(new Uint8Array(Signature_Size));
        });

        it('returns same signature for same data signed by same key pairs', () => {
            // Arrange:
            const privateKey = convert.uint8ArrayToHex(Crypto.randomBytes(Private_Key_Size));
            const keyPair1 = KeyPair.createKeyPairFromPrivateKeyString(privateKey, DerivationScheme.Ed25519Sha2);
            const keyPair2 = KeyPair.createKeyPairFromPrivateKeyString(privateKey, DerivationScheme.Ed25519Sha2);
            const payload = Crypto.randomBytes(100);

            // Act:
            const signature1 = KeyPair.sign(keyPair1, payload, DerivationScheme.Ed25519Sha2);
            const signature2 = KeyPair.sign(keyPair2, payload, DerivationScheme.Ed25519Sha2);

            // Assert:
            expect(signature2).to.deep.equal(signature1);
        });

        it('returns different signature for same data signed by different key pairs', () => {
            // Arrange:
            const keyPair1 = randomKeyPairV2();
            const keyPair2 = randomKeyPairV2();
            const payload = Crypto.randomBytes(100);

            // Act:
            const signature1 = KeyPair.sign(keyPair1, payload, DerivationScheme.Ed25519Sha2);
            const signature2 = KeyPair.sign(keyPair2, payload, DerivationScheme.Ed25519Sha2);

            // Assert:
            expect(signature2).to.not.deep.equal(signature1);
        });
    });

    describe('v2 account verify', () => {
        it('returns true for data signed with same key pair', () => {
            // Arrange:
            const keyPair = randomKeyPairV2();
            const payload = Crypto.randomBytes(100);
            const signature = KeyPair.sign(keyPair, payload, DerivationScheme.Ed25519Sha2);

            // Act:
            const isVerified = KeyPair.verify(keyPair.publicKey, payload, signature, DerivationScheme.Ed25519Sha2);

            // Assert:
            expect(isVerified).to.equal(true);
        });

        it('returns false for data signed with different key pair', () => {
            // Arrange:
            const keyPair1 = randomKeyPairV2();
            const keyPair2 = randomKeyPairV2();
            const payload = Crypto.randomBytes(100);
            const signature = KeyPair.sign(keyPair1, payload, DerivationScheme.Ed25519Sha2);

            // Act:
            const isVerified = KeyPair.verify(keyPair2.publicKey, payload, signature, DerivationScheme.Ed25519Sha2);

            // Assert:
            expect(isVerified).to.equal(false);
        });

        it('returns false if signature has been modified', () => {
            // Arrange:
            const keyPair = randomKeyPairV2();
            const payload = Crypto.randomBytes(100);

            for (let i = 0; i < Signature_Size; i += 4) {
                const signature = KeyPair.sign(keyPair, payload, DerivationScheme.Ed25519Sha2);
                signature[i] ^= 0xFF;

                // Act:
                const isVerified = KeyPair.verify(keyPair.publicKey, payload, signature, DerivationScheme.Ed25519Sha2);

                // Assert:
                expect(isVerified, `signature modified at ${i}`).to.equal(false);
            }
        });

        it('returns false if payload has been modified', () => {
            // Arrange:
            const keyPair = randomKeyPairV2();
            const payload = Crypto.randomBytes(44);

            for (let i = 0; i < payload.length; i += 4) {
                const signature = KeyPair.sign(keyPair, payload, DerivationScheme.Ed25519Sha2);
                payload[i] ^= 0xFF;

                // Act:
                const isVerified = KeyPair.verify(keyPair.publicKey, payload, signature, DerivationScheme.Ed25519Sha2);

                // Assert:
                expect(isVerified, `payload modified at ${i}`).to.equal(false);
            }
        });

        it('fails if public key is not on curve', () => {
            // Arrange:
            const keyPair = randomKeyPairV2();
            keyPair.publicKey.fill(0);
            keyPair.publicKey[keyPair.publicKey.length - 1] = 1;

            const payload = Crypto.randomBytes(100);
            const signature = KeyPair.sign(keyPair, payload, DerivationScheme.Ed25519Sha2);

            // Act:
            const isVerified = KeyPair.verify(keyPair.publicKey, payload, signature, DerivationScheme.Ed25519Sha2);

            // Assert:
            expect(isVerified).to.equal(false);
        });

        it('fails if public key does not correspond to private key', () => {
            // Arrange:
            const keyPair = randomKeyPairV2();
            const payload = Crypto.randomBytes(100);
            const signature = KeyPair.sign(keyPair, payload, DerivationScheme.Ed25519Sha2);

            for (let i = 0; i < keyPair.publicKey.length; ++i) {
                keyPair.publicKey[i] ^= 0xFF;
            }

            // Act:
            const isVerified = KeyPair.verify(keyPair.publicKey, payload, signature, DerivationScheme.Ed25519Sha2);

            // Assert:
            expect(isVerified).to.equal(false);
        });
    });

    describe('v2 account derive shared key', () => {
        const Salt_Size = 32;

        it('fails if salt is wrong size', () => {
            // Arrange: create a salt that is too long
            const keyPair = randomKeyPairV2();
            const publicKey = Crypto.randomBytes(32);
            const salt = Crypto.randomBytes(Salt_Size + 1);

            // Act:
            expect(() => {
                    KeyPair.deriveSharedKey(keyPair.privateKey, publicKey, salt, DerivationScheme.Ed25519Sha2);
                })
                .to.throw('salt has unexpected size');
        });

        it('derives same shared key for both partners', () => {
            // Arrange:
            const keyPair1 = randomKeyPairV2();
            const keyPair2 = randomKeyPairV2();
            const salt = Crypto.randomBytes(Salt_Size);

            // Act:
            const sharedKey1 = KeyPair.deriveSharedKey(keyPair1.privateKey, keyPair2.publicKey, salt, DerivationScheme.Ed25519Sha2);
            const sharedKey2 = KeyPair.deriveSharedKey(keyPair2.privateKey, keyPair1.publicKey, salt, DerivationScheme.Ed25519Sha2);

            // Assert:
            expect(sharedKey1).to.deep.equal(sharedKey2);
        });

        it('derives different shared keys for different partners', () => {
            // Arrange:
            const keyPair = randomKeyPairV2();
            const publicKey1 = Crypto.randomBytes(32);
            const publicKey2 = Crypto.randomBytes(32);
            const salt = Crypto.randomBytes(Salt_Size);

            // Act:
            const sharedKey1 = KeyPair.deriveSharedKey(keyPair.privateKey, publicKey1, salt, DerivationScheme.Ed25519Sha2);
            const sharedKey2 = KeyPair.deriveSharedKey(keyPair.privateKey, publicKey2, salt, DerivationScheme.Ed25519Sha2);

            // Assert:
            expect(sharedKey1).to.not.deep.equal(sharedKey2);
        });
    });
});