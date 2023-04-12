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

import { expect } from 'chai';
import { Account } from '../../../src/model/account/Account';
import { Address } from '../../../src/model/account/Address';
import { NetworkType } from '../../../src/model/blockchain/NetworkType';
import { NetworkCurrencyMosaic } from '../../../src/model/mosaic/NetworkCurrencyMosaic';
import { NamespaceId } from '../../../src/model/namespace/NamespaceId';
import { Deadline } from '../../../src/model/transaction/Deadline';
import { PlainMessage } from '../../../src/model/transaction/PlainMessage';
import { TransferTransaction } from '../../../src/model/transaction/TransferTransaction';
import {UInt64} from '../../../src/model/UInt64';
import { TestingAccount } from '../../conf/conf.spec';
import { DefaultFeeCalculationStrategy } from '../../../src/model/transaction/FeeCalculationStrategy';

describe('TransferTransaction', () => {
    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = TestingAccount;
    });

    it('should default maxFee field be set according to DefaultFeeCalculationStrategy', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            [],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        expect(transferTransaction.maxFee.compact()).to.be.equal(transferTransaction.size * DefaultFeeCalculationStrategy);
    });

    it('should filled maxFee override transaction maxFee', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            [],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
            new UInt64([1, 0])
        );

        expect(transferTransaction.maxFee.higher).to.be.equal(0);
        expect(transferTransaction.maxFee.lower).to.be.equal(1);
    });

    it('should createComplete an TransferTransaction object and sign it without mosaics', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            [],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        expect(transferTransaction.message.message).to.be.equal('test-message');
        expect(transferTransaction.mosaics.length).to.be.equal(0);
        expect(transferTransaction.recipient).to.be.instanceof(Address);
        expect((transferTransaction.recipient as Address).plain()).to.be.equal('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');

        const signedTransaction = transferTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            244,
            signedTransaction.payload.length,
        )).to.be.equal('9050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E1420D000000746573742D6D657373616765');
    });

    it('should createComplete an TransferTransaction object and sign it with mosaics', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            [
                NetworkCurrencyMosaic.createRelative(100),
            ],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        expect(transferTransaction.message.message).to.be.equal('test-message');
        expect(transferTransaction.mosaics.length).to.be.equal(1);
        expect(transferTransaction.recipient).to.be.instanceof(Address);
        expect((transferTransaction.recipient as Address).plain()).to.be.equal('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');

        const signedTransaction = transferTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            244,
            signedTransaction.payload.length,
        )).to.be.equal(
            '9050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E1420D000100746573742D6D657373616765' +
            'F6BD1691A142FBBF00E1F50500000000');
    });

    it('should createComplete an TransferTransaction object with NamespaceId recipient', () => {
        const addressAlias = new NamespaceId('nem.owner');
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            addressAlias,
            [
                NetworkCurrencyMosaic.createRelative(100),
            ],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        expect(transferTransaction.message.message).to.be.equal('test-message');
        expect(transferTransaction.mosaics.length).to.be.equal(1);
        expect(transferTransaction.recipient).to.be.instanceof(NamespaceId);
        expect(transferTransaction.recipient).to.be.equal(addressAlias);
        expect((transferTransaction.recipient as NamespaceId).toHex()).to.be.equal(addressAlias.toHex());

        const signedTransaction = transferTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            244,
            signedTransaction.payload.length,
        )).to.be.equal('9151776168D24257D8000000000000000000000000000000000D000100746573742D6D657373616765' +
            'F6BD1691A142FBBF00E1F50500000000');
    });

    it('should format TransferTransaction payload with 25 bytes binary address', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            [
                NetworkCurrencyMosaic.createRelative(100),
            ],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        // test recipientToString with Address recipient
        expect(transferTransaction.recipientToString()).to.be.equal('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');

        const signedTransaction = transferTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            244,
            294,
        )).to.be.equal('9050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E142');
    });

    it('should format TransferTransaction payload with 8 bytes binary namespaceId', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            new NamespaceId('nem.owner'),
            [
                NetworkCurrencyMosaic.createRelative(100),
            ],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        // test recipientToString with NamespaceId recipient
        expect(transferTransaction.recipientToString()).to.be.equal('d85742d268617751');

        const signedTransaction = transferTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            244,
            294,
        )).to.be.equal('9151776168D24257D800000000000000000000000000000000');
    });

    describe('size', () => {
        it('should return 170 for TransferTransaction with 1 mosaic and message NEM', () => {
            const transaction = TransferTransaction.create(
                Deadline.create(),
                Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
                [
                    NetworkCurrencyMosaic.createRelative(100),
                ],
                PlainMessage.create('NEM'),
                NetworkType.MIJIN_TEST,
            );
            expect(transaction.size).to.be.equal(170);
        });
    });
});
