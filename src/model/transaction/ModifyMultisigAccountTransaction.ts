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

import { MultisigModificationTransaction as ModifyMultisigAccountTransactionLibrary, VerifiableTransaction } from 'proximax-nem2-library';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { MultisigCosignatoryModification } from './MultisigCosignatoryModification';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';

/**
 * Modify multisig account transactions are part of the NEM's multisig account system.
 * A modify multisig account transaction holds an array of multisig cosignatory modifications,
 * min number of signatures to approve a transaction and a min number of signatures to remove a cosignatory.
 * @since 1.0
 */
export class ModifyMultisigAccountTransaction extends Transaction {

    /**
     * Create a modify multisig account transaction object
     * @param deadline - The deadline to include the transaction.
     * @param minApprovalDelta - The min approval relative change.
     * @param minRemovalDelta - The min removal relative change.
     * @param modifications - The array of modifications.
     * @param networkType - The network type.
     * @returns {ModifyMultisigAccountTransaction}
     */
    public static create(deadline: Deadline,
                         minApprovalDelta: number,
                         minRemovalDelta: number,
                         modifications: MultisigCosignatoryModification[],
                         networkType: NetworkType): ModifyMultisigAccountTransaction {
        return new ModifyMultisigAccountTransaction(networkType,
            3,
            deadline,
            new UInt64([0, 0]),
            minApprovalDelta,
            minRemovalDelta,
            modifications);
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param fee
     * @param minApprovalDelta
     * @param minRemovalDelta
     * @param modifications
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                fee: UInt64,
                /**
                 * The number of signatures needed to approve a transaction.
                 * If we are modifying and existing multi-signature account this indicates the relative change of the minimum cosignatories.
                 */
                public readonly minApprovalDelta: number,
                /**
                 * The number of signatures needed to remove a cosignatory.
                 * If we are modifying and existing multi-signature account this indicates the relative change of the minimum cosignatories.
                 */
                public readonly minRemovalDelta: number,
                /**
                 * The array of cosigner accounts added or removed from the multi-signature account.
                 */
                public readonly modifications: MultisigCosignatoryModification[],
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {
        super(TransactionType.MODIFY_MULTISIG_ACCOUNT, networkType, version, deadline, fee, signature, signer, transactionInfo);
    }

    /**
     * @internal
     * @returns {VerifiableTransaction}
     */
    protected buildTransaction(): VerifiableTransaction {
        return new ModifyMultisigAccountTransactionLibrary.Builder()
            .addDeadline(this.deadline.toDTO())
            .addFee(this.fee.toDTO())
            .addVersion(this.versionToDTO())
            .addMinApprovalDelta(this.minApprovalDelta)
            .addMinRemovalDelta(this.minRemovalDelta)
            .addModifications(this.modifications.map((modification) => modification.toDTO()))
            .build();
    }

}
