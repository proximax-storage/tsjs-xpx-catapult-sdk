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

import { VerifiableTransaction } from 'proximax-nem2-library';
import { expect } from 'chai';
import { NetworkType } from '../../../src/model/blockchain/NetworkType';
import { Account } from '../../../src/model/model';
import { Deadline } from '../../../src/model/transaction/Deadline';
import { SignedTransaction } from '../../../src/model/transaction/SignedTransaction';
import { Transaction } from '../../../src/model/transaction/Transaction';
import { TransactionInfo } from '../../../src/model/transaction/TransactionInfo';
import { TransactionType } from '../../../src/model/transaction/TransactionType';
import { UInt64 } from '../../../src/model/UInt64';

describe('Transaction', () => {
    describe('isUnannounced', () => {
        it('should return true when there is no Transaction Info', () => {
            const transaction = new FakeTransaction(TransactionType.TRANSFER,
                NetworkType.MIJIN_TEST,
                1,
                Deadline.create(),
                UInt64.fromUint(0),
                undefined,
                undefined,
                undefined,
            );
            expect(transaction.isUnannounced()).to.be.equal(true);
        });
    });

    describe('isUnconfirmed', () => {
        it('should return true when height is 0', () => {
            const transaction = new FakeTransaction(TransactionType.TRANSFER,
                NetworkType.MIJIN_TEST,
                1,
                Deadline.create(),
                UInt64.fromUint(0),
                undefined,
                undefined,
                new TransactionInfo(UInt64.fromUint(0), 1, 'id_hash', 'hash', 'hash'),
            );
            expect(transaction.isUnconfirmed()).to.be.equal(true);
        });

        it('should return false when height is not 0', () => {
            const transaction = new FakeTransaction(TransactionType.TRANSFER,
                NetworkType.MIJIN_TEST,
                1,
                Deadline.create(),
                UInt64.fromUint(0),
                undefined,
                undefined,
                new TransactionInfo(UInt64.fromUint(100), 1, 'id_hash', 'hash', 'hash'),
            );
            expect(transaction.isUnconfirmed()).to.be.equal(false);
        });
    });

    describe('isConfirmed', () => {
        it('should return true when height is not 0', () => {
            const transaction = new FakeTransaction(TransactionType.TRANSFER,
                NetworkType.MIJIN_TEST,
                1,
                Deadline.create(),
                UInt64.fromUint(0),
                undefined,
                undefined,
                new TransactionInfo(UInt64.fromUint(100), 1, 'id_hash', 'hash', 'hash'),
            );
            expect(transaction.isConfirmed()).to.be.equal(true);
        });
    });

    describe('hasMissingSignatures', () => {
        it('should return false when height is 0 and hash and markehash are different', () => {
            const transaction = new FakeTransaction(TransactionType.TRANSFER,
                NetworkType.MIJIN_TEST,
                1,
                Deadline.create(),
                UInt64.fromUint(0),
                undefined,
                undefined,
                new TransactionInfo(UInt64.fromUint(0), 1, 'id_hash', 'hash', 'hash_2'),
            );
            expect(transaction.hasMissingSignatures()).to.be.equal(true);
        });
    });

    describe('replyGiven', () => {
        it('should throw an error if the transaction is announced', () => {
            const transaction = new FakeTransaction(TransactionType.TRANSFER,
                NetworkType.MIJIN_TEST,
                1,
                Deadline.create(),
                UInt64.fromUint(0),
                undefined,
                undefined,
                new TransactionInfo(UInt64.fromUint(100), 1, 'id_hash', 'hash', 'hash'),
            );
            expect(() => {
                transaction.replyGiven(Deadline.create());
            }).to.throws('an Announced transaction can\'t be modified');
        });
        it('should return a new transaction', () => {
            const transaction = new FakeTransaction(TransactionType.TRANSFER,
                NetworkType.MIJIN_TEST,
                1,
                Deadline.create(),
                UInt64.fromUint(0),
                undefined,
                undefined,
            );

            const newTransaction = transaction.replyGiven(Deadline.create());
            expect(newTransaction).to.not.equal(transaction);
        });
        it('should overide deadline properly', () => {
            const transaction = new FakeTransaction(TransactionType.TRANSFER,
                NetworkType.MIJIN_TEST,
                1,
                Deadline.create(),
                UInt64.fromUint(0),
                undefined,
                undefined,
            );

            const newDeadline = Deadline.create(3);
            const newTransaction = transaction.replyGiven(newDeadline);
            const equal = newTransaction.deadline.value.equals(transaction.deadline.value);
            const after = newTransaction.deadline.value.isAfter(transaction.deadline.value);
            expect(newTransaction.deadline).to.be.equal(newDeadline);
            expect(equal).to.be.equal(false);
            expect(after).to.be.equal(true);
        });
    });
});

class FakeTransaction extends Transaction {
    public signWith(account: Account): SignedTransaction {
        throw new Error('Method not implemented.');
    }

    protected buildTransaction(): VerifiableTransaction {
        throw new Error('Method not implemented.');
    }
}
