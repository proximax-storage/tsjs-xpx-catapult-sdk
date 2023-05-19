/*
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

import {deepStrictEqual} from 'assert';
import {expect} from 'chai';
import {PublicAccount} from '../../../src/model/account/PublicAccount';
import {BlockInfo} from '../../../src/model/blockchain/BlockInfo';
import {UInt64} from '../../../src/model/UInt64';

describe('BlockInfo', () => {

    it('should createComplete an BlockInfo object', () => {
        const blockDTO = {
            block:  {
                blockTransactionsHash: '702090BA31CEF9E90C62BBDECC0CCCC0F88192B6625839382850357F70DD68A0',
                blockReceiptsHash: '702090BA31CEF9E90C62BBDECC0CCCC0F88192B6625839382850357F70DD68A0',
                stateHash: '702090BA31CEF9E90C62BBDECC0CCCC0F88192B6625839382850357F70DD68A0',
                difficulty: new UInt64([ 276447232, 23283 ]),
                feeMultiplier: 1,
                height: new UInt64([ 1, 0 ]),
                previousBlockHash: '0000000000000000000000000000000000000000000000000000000000000000',
                signature: '37351C8244AC166BE6664E3FA954E99A3239AC46E51E2B32CEA1C72DD0851100A7731868' +
                'E932E1A9BEF8A27D48E1FFEE401E933EB801824373E7537E51733E0F',
                signer: 'B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF',
                beneficiaryPublicKey: 'B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF',
                timestamp: new UInt64([ 0, 0 ]),
                type: 32768,
                version: 2415919105,
            },
            meta: {
                generationHash: '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6',
                hash: '24E92B511B54EDB48A4850F9B42485FDD1A30589D92C775632DDDD71D7D1D691',
                numTransactions: 25,
                totalFee: new UInt64([ 0, 0 ]),
            },
        };

        const network = parseInt(blockDTO.block.version.toString(16).substring(0, 2), 16);
        const blockInfo = new BlockInfo(
            blockDTO.meta.hash,
            blockDTO.meta.generationHash,
            blockDTO.meta.totalFee,
            blockDTO.meta.numTransactions,
            blockDTO.block.signature,
            PublicAccount.createFromPublicKey(blockDTO.block.signer, network),
            network,
            parseInt(blockDTO.block.version.toString(16).substring(2, 4), 16), // Tx version
            blockDTO.block.type,
            blockDTO.block.height,
            blockDTO.block.timestamp,
            blockDTO.block.difficulty,
            blockDTO.block.feeMultiplier,
            blockDTO.block.previousBlockHash,
            blockDTO.block.blockTransactionsHash,
            blockDTO.block.blockReceiptsHash,
            blockDTO.block.stateHash,
            PublicAccount.createFromPublicKey(blockDTO.block.beneficiaryPublicKey, network),
        );

        expect(blockInfo.hash).to.be.equal(blockDTO.meta.hash);
        expect(blockInfo.generationHash).to.be.equal(blockDTO.meta.generationHash);
        deepStrictEqual(blockInfo.totalFee, blockDTO.meta.totalFee);
        expect(blockInfo.numTransactions).to.be.equal(blockDTO.meta.numTransactions);
        expect(blockInfo.signature).to.be.equal(blockDTO.block.signature);
        expect(blockInfo.signer.publicKey).to.be.equal(blockDTO.block.signer);
        expect(blockInfo.networkType).to.be.equal(parseInt(blockDTO.block.version.toString(16).substring(0, 2), 16));
        expect(blockInfo.version).to.be.equal(parseInt(blockDTO.block.version.toString(16).substring(2, 4), 16));
        expect(blockInfo.type).to.be.equal(blockDTO.block.type);
        deepStrictEqual(blockInfo.height, blockDTO.block.height);
        deepStrictEqual(blockInfo.timestamp, blockDTO.block.timestamp);
        deepStrictEqual(blockInfo.difficulty, blockDTO.block.difficulty);
        expect(blockInfo.feeMultiplier).to.be.equal(blockDTO.block.feeMultiplier);
        expect(blockInfo.previousBlockHash).to.be.equal(blockDTO.block.previousBlockHash);
        expect(blockInfo.blockTransactionsHash).to.be.equal(blockDTO.block.blockTransactionsHash);
        expect(blockInfo.blockReceiptsHash).to.be.equal(blockDTO.block.blockReceiptsHash);
        expect(blockInfo.stateHash).to.be.equal(blockDTO.block.stateHash);
        expect((blockInfo.beneficiaryPublicKey as PublicAccount).publicKey).to.be.equal(blockDTO.block.beneficiaryPublicKey);

    });
});
