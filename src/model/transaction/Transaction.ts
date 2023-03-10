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

import { SignSchema } from '../../core/crypto';
import { VerifiableTransaction } from '../../infrastructure/builders/VerifiableTransaction';
import { Account } from '../account/Account';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { UInt64 } from '../UInt64';
import { AggregateTransactionInfo } from './AggregateTransactionInfo';
import { Deadline, DefaultCreateNewDeadline } from './Deadline';
import { InnerTransaction } from './InnerTransaction';
import { SignedTransaction } from './SignedTransaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { FeeCalculationStrategy, DefaultFeeCalculationStrategy } from './FeeCalculationStrategy';

/**
 * An abstract transaction class that serves as the base class of all NEM transactions.
 */
export abstract class Transaction {

    public readonly transactionName: string;

    /**
     * @description get the byte size of the common transaction header
     * @returns {number}
     * @memberof Transaction
     */
    public static getHeaderSize(): number {
        const byteSize = 4 // size
                        + 64 // signature
                        + 32 // signer
                        + 4 // version
                        + 2 // type
                        + 8 // maxFee
                        + 8; // deadline

        return byteSize;
    }

    /**
     * @constructor
     * @param type
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(/**
                 * The transaction type.
                 */
                public readonly type: number,
                /**
                 * The network type.
                 */
                public readonly networkType: NetworkType,
                /**
                 * The transaction version number.
                 */
                public readonly version: number,
                /**
                 * The deadline to include the transaction.
                 */
                public readonly deadline: Deadline,
                /**
                 * A sender of a transaction must specify during the transaction definition a max_fee,
                 * meaning the maximum fee the account allows to spend for this transaction.
                 */
                public readonly maxFee: UInt64,
                /**
                 * The transaction signature (missing if part of an aggregate transaction).
                 */
                public readonly signature?: string,
                /**
                 * The account of the transaction creator.
                 */
                public readonly signer?: PublicAccount,
                /**
                 * Transactions meta data object contains additional information about the transaction.
                 */
                public readonly transactionInfo?: TransactionInfo | AggregateTransactionInfo) {
        this.transactionName = Transaction.extractTransactionName(type);
    }

    /**
     * Serialize and sign transaction creating a new SignedTransaction
     * @param account - The account to sign the transaction
     * @param generationHash - Network generation hash hex
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @returns {SignedTransaction}
     */
    public signWith(account: Account, generationHash: string, signSchema: SignSchema = SignSchema.SHA3): SignedTransaction {
        const transaction = this.buildTransaction();
        const signedTransactionRaw = transaction.signTransaction(account, generationHash, signSchema);
        return new SignedTransaction(
            signedTransactionRaw.payload,
            signedTransactionRaw.hash,
            account.publicKey,
            this.type,
            this.networkType);
    }

    /**
     * @internal
     */
    protected abstract buildTransaction(): VerifiableTransaction;

    /**
     * @internal
     * @returns {Array<number>}
     */
    public aggregateTransaction(): number[] {
        return this.buildTransaction().toAggregateTransaction(this.signer!.publicKey);
    }

    /**
     * Convert an aggregate transaction to an inner transaction including transaction signer.
     * @param signer - Transaction signer.
     * @returns InnerTransaction
     */
    public toAggregate(signer: PublicAccount): InnerTransaction {
        if (this.type === TransactionType.AGGREGATE_BONDED || this.type === TransactionType.AGGREGATE_COMPLETE) {
            throw new Error('Inner transaction cannot be an aggregated transaction.');
        }
        return Object.assign({__proto__: Object.getPrototypeOf(this)}, this, {signer});
    }

    /**
     * Transaction pending to be included in a block
     * @returns {boolean}
     */
    public isUnconfirmed(): boolean {
        return this.transactionInfo != null && this.transactionInfo.height.compact() === 0
            && this.transactionInfo.hash === this.transactionInfo.merkleComponentHash;
    }

    /**
     * Transaction included in a block
     * @returns {boolean}
     */
    public isConfirmed(): boolean {
        return this.transactionInfo != null && this.transactionInfo.height.compact() > 0;
    }

    /**
     * Returns if a transaction has missing signatures.
     * @returns {boolean}
     */
    public hasMissingSignatures(): boolean {
        return this.transactionInfo != null && this.transactionInfo.height.compact() === 0 &&
            this.transactionInfo.hash !== this.transactionInfo.merkleComponentHash;
    }

    /**
     * Transaction is not known by the network
     * @return {boolean}
     */
    public isUnannounced(): boolean {
        return this.transactionInfo == null;
    }

    public isEmbedded(): boolean {
        return this.transactionInfo instanceof AggregateTransactionInfo;
    }

    /**
     * @internal
     */
    public versionToDTO(): number {
        return (this.networkType << 24) + this.version;
    }

    /**
     * @internal
     */
    public versionToHex(): string {
        return '0x' + (this.versionToDTO() >>> 0).toString(16); // ">>> 0" hack makes it effectively an Uint32
    }

    /**
     * @description reapply a given value to the transaction in an immutable way
     * @param {Deadline} deadline
     * @returns {Transaction}
     * @memberof Transaction
     */
    public reapplyGiven(deadline: Deadline = Deadline.create()): Transaction {
        if (this.isUnannounced()) {
            return Object.assign({__proto__: Object.getPrototypeOf(this)}, this, {deadline});
        }
        throw new Error('an Announced transaction can\'t be modified');
    }

    /**
     * @description get the byte size of a transaction
     * @returns {number}
     * @memberof Transaction
     */
    public abstract get size(): number;

    /**
     * @description Serialize a transaction object
     * @returns {string}
     * @memberof Transaction
     */
    public serialize() {
        const transaction = this.buildTransaction();
        return transaction.serializeUnsignedTransaction();
    }

    /**
     * @description Create JSON object
     * @returns {Object}
     * @memberof Transaction
     */
    public toJSON() {
        const commonTransactionObject = {
            type: this.type,
            networkType: this.networkType,
            version: this.versionToDTO(),
            maxFee: this.maxFee.toDTO(),
            deadline: this.deadline.toDTO(),
            signature: this.signature ? this.signature : '',
        };

        if (this.signer) {
            Object.assign(commonTransactionObject, {signer: this.signer.publicKey});
        }
        return { transaction: commonTransactionObject };
    }

    protected static extractTransactionName = (type: number): string =>{

        let transactionTypeValues = Object.values(TransactionType);
        let transactionTypeKeys = Object.keys(TransactionType);

        if (transactionTypeValues.includes(type)) {
    
            return transactionTypeKeys[transactionTypeValues.indexOf(type)];
        }
        else{
            return "UNKNOWN";
        }
    }
}

export abstract class TransactionBuilder {
    protected _networkType: NetworkType;
    protected _version: number;
    protected _deadline: Deadline;
    protected _generationHash: string;
    protected _feeCalculationStrategy: FeeCalculationStrategy = DefaultFeeCalculationStrategy;
    protected _maxFee: UInt64 | undefined;
    protected _signature: string;
    protected _signer: PublicAccount;
    protected _transactionInfo: TransactionInfo;
    protected _createNewDeadlineFn: () => Deadline = DefaultCreateNewDeadline;

    public networkType(networkType: NetworkType) {
        this._networkType = networkType;
        return this;
    }

    public version(version: number) {
        this._version = version;
        return this;
    }

    public deadline(deadline: Deadline) {
        this._deadline = deadline;
        return this;
    }

    public generationHash(generationHash: string) {
        this._generationHash = generationHash;
        return this;
    }

    public feeCalculationStrategy(feeCalculationStrategy: FeeCalculationStrategy) {
        this._feeCalculationStrategy = feeCalculationStrategy;
        return this;
    }

    public createNewDeadlineFn(createNewDeadlineFn: () => Deadline) {
        this._createNewDeadlineFn = createNewDeadlineFn;
        return this;
    }

    public maxFee(maxFee: UInt64 | undefined) {
        this._maxFee = maxFee;
        return this;
    }

    public signature(signature: string) {
        this._signature = signature;
        return this;
    }

    public signer(signer: PublicAccount) {
        this._signer = signer;
        return this;
    }

    public transactionInfo(transactionInfo: TransactionInfo) {
        this._transactionInfo = transactionInfo;
        return this;
    }
}