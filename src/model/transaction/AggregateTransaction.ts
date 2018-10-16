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

import { AggregateTransaction as AggregateTransactionLibrary } from 'proximax-nem2-library';
import { Account } from '../account/Account';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { UInt64 } from '../UInt64';
import { AggregateTransactionCosignature } from './AggregateTransactionCosignature';
import { Deadline } from './Deadline';
import { InnerTransaction } from './InnerTransaction';
import { SignedTransaction } from './SignedTransaction';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';

/**
 * Aggregate innerTransactions contain multiple innerTransactions that can be initiated by different accounts.
 */
export class AggregateTransaction extends Transaction {

    /**
     * @param networkType
     * @param type
     * @param version
     * @param deadline
     * @param fee
     * @param innerTransactions
     * @param cosignatures
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
                type: number,
                version: number,
                deadline: Deadline,
                fee: UInt64,
                /**
                 * The array of innerTransactions included in the aggregate transaction.
                 */
                public readonly innerTransactions: InnerTransaction[],
                /**
                 * The array of transaction cosigners signatures.
                 */
                public readonly cosignatures: AggregateTransactionCosignature[],
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {
        super(type, networkType, version, deadline, fee, signature, signer, transactionInfo);
    }

    /**
     * Create an aggregate complete transaction object
     * @param deadline - The deadline to include the transaction.
     * @param innerTransactions - The array of inner innerTransactions.
     * @param networkType - The network type.
     * @param cosignatures
     * @returns {AggregateTransaction}
     */
    public static createComplete(deadline: Deadline,
                                 innerTransactions: InnerTransaction[],
                                 networkType: NetworkType,
                                 cosignatures: AggregateTransactionCosignature[]): AggregateTransaction {
        return new AggregateTransaction(networkType,
            TransactionType.AGGREGATE_COMPLETE,
            2,
            deadline,
            new UInt64([0, 0]),
            innerTransactions,
            cosignatures,
        );
    }

    /**
     * Create an aggregate bonded transaction object
     * @param {Deadline} deadline
     * @param {InnerTransaction[]} innerTransactions
     * @param {NetworkType} networkType
     * @param {AggregateTransactionCosignature[]} cosignatures
     * @return {AggregateTransaction}
     */
    public static createBonded(deadline: Deadline,
                               innerTransactions: InnerTransaction[],
                               networkType: NetworkType,
                               cosignatures: AggregateTransactionCosignature[] = []): AggregateTransaction {
        return new AggregateTransaction(networkType,
            TransactionType.AGGREGATE_BONDED,
            2,
            deadline,
            new UInt64([0, 0]),
            innerTransactions,
            cosignatures,
        );
    }

    /**
     * @internal
     * @returns {AggregateTransaction}
     */
    public buildTransaction(): AggregateTransactionLibrary {
        return new AggregateTransactionLibrary.Builder()
            .addDeadline(this.deadline.toDTO())
            .addType(this.type)
            .addFee(this.fee.toDTO())
            .addVersion(this.versionToDTO())
            .addTransactions(this.innerTransactions.map((transaction) => {
                return transaction.aggregateTransaction();
            })).build();
    }

    /**
     * @internal
     * Sign transaction with cosignatories creating a new SignedTransaction
     * @param initiatorAccount - Initiator account
     * @param cosignatories - The array of accounts that will cosign the transaction
     * @returns {SignedTransaction}
     */
    public signTransactionWithCosignatories(initiatorAccount: Account, cosignatories: Account[]) {
        const aggregateTransaction = this.buildTransaction();
        const signedTransactionRaw = aggregateTransaction.signTransactionWithCosigners(initiatorAccount, cosignatories);
        return new SignedTransaction(signedTransactionRaw.payload, signedTransactionRaw.hash, initiatorAccount.publicKey, this.type, this.networkType);
    }

    /**
     * Check if account has signed transaction
     * @param publicAccount - Signer public account
     * @returns {boolean}
     */
    public signedByAccount(publicAccount: PublicAccount): boolean {
        return this.cosignatures.find((cosignature) => cosignature.signer.equals(publicAccount)) !== undefined
            || (this.signer !== undefined && this.signer.equals(publicAccount));
    }

}
