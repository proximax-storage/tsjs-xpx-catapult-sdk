/*
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
import {Account} from '../../../src/model/account/Account';
import {NetworkType} from '../../../src/model/blockchain/NetworkType';
import {MosaicId} from '../../../src/model/mosaic/MosaicId';
import {AliasActionType} from '../../../src/model/namespace/AliasActionType';
import {NamespaceId} from '../../../src/model/namespace/NamespaceId';
import {Deadline} from '../../../src/model/transaction/Deadline';
import {MosaicAliasTransaction} from '../../../src/model/transaction/MosaicAliasTransaction';
import {UInt64} from '../../../src/model/UInt64';
import {TestingAccount} from '../../conf/conf.spec';
import { DefaultFeeCalculationStrategy } from '../../../src/model/transaction/FeeCalculationStrategy';

describe('MosaicAliasTransaction', () => {
    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = TestingAccount;
    });

    it('should default maxFee field be set according to DefaultFeeCalculationStrategy', () => {
        const namespaceId = new NamespaceId([33347626, 3779697293]);
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicAliasTransaction = MosaicAliasTransaction.create(
            Deadline.create(),
            AliasActionType.Link,
            namespaceId,
            mosaicId,
            NetworkType.MIJIN_TEST,
        );

        expect(mosaicAliasTransaction.maxFee.compact()).to.be.equal(mosaicAliasTransaction.size * DefaultFeeCalculationStrategy);
    });

    it('should filled maxFee override transaction maxFee', () => {
        const namespaceId = new NamespaceId([33347626, 3779697293]);
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicAliasTransaction = MosaicAliasTransaction.create(
            Deadline.create(),
            AliasActionType.Link,
            namespaceId,
            mosaicId,
            NetworkType.MIJIN_TEST,
            new UInt64([1, 0])
        );

        expect(mosaicAliasTransaction.maxFee.higher).to.be.equal(0);
        expect(mosaicAliasTransaction.maxFee.lower).to.be.equal(1);
    });

    it('should createComplete an MosaicAliasTransaction object and sign it', () => {
        const namespaceId = new NamespaceId([33347626, 3779697293]);
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicAliasTransaction = MosaicAliasTransaction.create(
            Deadline.create(),
            AliasActionType.Link,
            namespaceId,
            mosaicId,
            NetworkType.MIJIN_TEST,
        );

        expect(mosaicAliasTransaction.actionType).to.be.equal(AliasActionType.Link);
        expect(mosaicAliasTransaction.namespaceId.id.lower).to.be.equal(33347626);
        expect(mosaicAliasTransaction.namespaceId.id.higher).to.be.equal(3779697293);
        expect(mosaicAliasTransaction.mosaicId.id.lower).to.be.equal(2262289484);
        expect(mosaicAliasTransaction.mosaicId.id.higher).to.be.equal(3405110546);

        const signedTransaction = mosaicAliasTransaction.preV2SignWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            244,
            signedTransaction.payload.length,
        )).to.be.equal('002AD8FC018D9A49E14CCCD78612DDF5CA');

    });

    describe('size', () => {
        it('should return 139 for MosaicAliasTransaction transaction byte size', () => {
            const namespaceId = new NamespaceId([33347626, 3779697293]);
            const mosaicId = new MosaicId([2262289484, 3405110546]);
            const mosaicAliasTransaction = MosaicAliasTransaction.create(
                Deadline.create(),
                AliasActionType.Link,
                namespaceId,
                mosaicId,
                NetworkType.MIJIN_TEST,
            );
            expect(mosaicAliasTransaction.size).to.be.equal(139);
        });
    });
});
