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

import { Builder } from '../../../infrastructure/builders/AccountRestrictionsMosaicTransaction';
import {VerifiableTransaction} from '../../../infrastructure/builders/VerifiableTransaction';
import { PublicAccount } from '../../account/PublicAccount';
import { RestrictionType } from '../../account/RestrictionType';
import { NetworkType } from '../../blockchain/NetworkType';
import { UInt64 } from '../../UInt64';
import { AccountRestrictionModification } from '../AccountRestrictionModification';
import { Deadline } from '../Deadline';
import { Transaction, TransactionBuilder } from '../Transaction';
import { TransactionInfo } from '../TransactionInfo';
import { TransactionType } from '../TransactionType';
import { TransactionTypeVersion } from '../TransactionTypeVersion';
import { calculateFee } from '../FeeCalculationStrategy';

/**
 * @deprecated
*/
export class AccountMosaicRestrictionModificationTransaction extends Transaction {

    /**
     * Create a modify account mosaic restriction transaction object
     * @param deadline - The deadline to include the transaction.
     * @param restrictionType - The account restriction type.
     * @param modifications - The array of modifications.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {AccountAddressRestrictionModificationTransaction}
     */
    public static create(deadline: Deadline,
                         restrictionType: RestrictionType,
                         modifications: Array<AccountRestrictionModification<number[]>>,
                         networkType: NetworkType,
                         maxFee?: UInt64): AccountMosaicRestrictionModificationTransaction {
        return new AccountMosaicRestrictionModificationTransactionBuilder()
            .networkType(networkType)
            .deadline(deadline)
            .maxFee(maxFee)
            .restrictionType(restrictionType)
            .modifications(modifications)
            .build();
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param restrictionType
     * @param modifications
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                maxFee: UInt64,
                public readonly restrictionType: RestrictionType,
                public readonly modifications: Array<AccountRestrictionModification<number[]>>,
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {
        super(TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC,
              networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a AccountMosaicRestrictionModificationTransaction
     * @returns {number}
     * @memberof AccountMosaicRestrictionModificationTransaction
     */
    public get size(): number {
        return AccountMosaicRestrictionModificationTransaction.calculateSize(this.modifications.length);
    }

    public static calculateSize(modificationCount: number): number {
        const byteSize = Transaction.getHeaderSize();

        // set static byte size fields
        const byteRestrictionType = 1;
        const byteModificationCount = 1;

        // each modification contains :
        // - 1 byte for modificationType
        // - 8 bytes for the modification value (mosaicId)
        const byteModifications = 9 * modificationCount;

        return byteSize + byteRestrictionType + byteModificationCount + byteModifications;
    }

    /**
     * @override Transaction.toJSON()
     * @description Serialize a transaction object - add own fields to the result of Transaction.toJSON()
     * @return {Object}
     * @memberof AccountMosaicRestrictionModificationTransaction
     */
    public toJSON() {
        const parent = super.toJSON();
        return {
            ...parent,
            transaction: {
                ...parent.transaction,
                propertyType: this.restrictionType,
                modifications: this.modifications.map((modification) => {
                    return modification.toDTO();
                }),
            }
        }
    }

    /**
     * @internal
     * @returns {VerifiableTransaction}
     */
    protected buildTransaction(): VerifiableTransaction {
        return new Builder()
            .addSize(this.size)
            .addDeadline(this.deadline.toDTO())
            .addMaxFee(this.maxFee.toDTO())
            .addVersion(this.versionToDTO())
            .addRestrictionType(this.restrictionType)
            .addModifications(this.modifications.map((modification) => modification.toDTO()))
            .build();
    }

}

/**
 * @deprecated
*/
export class AccountMosaicRestrictionModificationTransactionBuilder extends TransactionBuilder {
    private _modifications: Array<AccountRestrictionModification<number[]>>;
    private _restrictionType: RestrictionType;

    public restrictionType(restrictionType: RestrictionType) {
        if (! (restrictionType === RestrictionType.AllowMosaic || restrictionType === RestrictionType.BlockMosaic)) {
            throw new Error('Restriction type is not allowed.');
        };
        this._restrictionType = restrictionType;
        return this;
    }

    public modifications(modifications: Array<AccountRestrictionModification<number[]>>) {
        this._modifications = modifications;
        return this;
    }

    public build(): AccountMosaicRestrictionModificationTransaction {
        return new AccountMosaicRestrictionModificationTransaction(
            this._networkType,
            this._version || TransactionTypeVersion.MODIFY_ACCOUNT_RESTRICTION_MOSAIC,
            this._deadline ? this._deadline : this._createNewDeadlineFn(),
            this._maxFee ? this._maxFee : calculateFee(AccountMosaicRestrictionModificationTransaction.calculateSize(this._modifications.length), this._feeCalculationStrategy),
            this._restrictionType,
            this._modifications,
            this._signature,
            this._signer,
            this._transactionInfo
        );
    }
}
