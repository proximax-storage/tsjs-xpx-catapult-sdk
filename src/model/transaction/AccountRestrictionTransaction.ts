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

import { RestrictionType } from '../account/RestrictionType';
import { NetworkType } from '../blockchain/NetworkType';
import { UInt64 } from '../UInt64';
import { AccountAddressRestrictionModificationTransaction } from './AccountMosaicRestrictionTransaction';
import { AccountMosaicRestrictionModificationTransaction } from './deprecated/AccountMosaicRestrictionModificationTransaction';
import { AccountOperationRestrictionModificationTransaction } from './deprecated/AccountOperationRestrictionModificationTransaction';
import { AccountRestrictionModification } from './AccountRestrictionModification';
import { Deadline } from './Deadline';
import { TransactionType } from './TransactionType';

export class AccountRestrictionTransaction {
    /**
     * Create an account address restriction transaction object
     * @param deadline - The deadline to include the transaction.
     * @param restrictionType - Type of account restriction transaction
     * @param modification - array of address modifications
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {AccountAddressRestrictionModificationTransaction}
     */
    public static createAddressRestrictionModificationTransaction(
        deadline: Deadline,
        restrictionType: RestrictionType,
        modifications: Array<AccountRestrictionModification<string>>,
        networkType: NetworkType,
        maxFee?: UInt64): AccountAddressRestrictionModificationTransaction {
        if (![RestrictionType.AllowAddress, RestrictionType.BlockAddress].includes(restrictionType)) {
            throw new Error ('Restriction type is not allowed.');
        }
        return AccountAddressRestrictionModificationTransaction.create(
            deadline,
            restrictionType,
            modifications,
            networkType,
            maxFee,
        );
    }

    /**
     * Create an account mosaic restriction transaction object
     * @param deadline - The deadline to include the transaction.
     * @param restrictionType - Type of account restriction transaction
     * @param modification - array of mosaic modifications
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {AccountMosaicRestrictionModificationTransaction}
     */
    public static createMosaicRestrictionModificationTransaction(
        deadline: Deadline,
        restrictionType: RestrictionType,
        modifications: Array<AccountRestrictionModification<number[]>>,
        networkType: NetworkType,
        maxFee?: UInt64): AccountMosaicRestrictionModificationTransaction {
        if (![RestrictionType.AllowMosaic, RestrictionType.BlockMosaic].includes(restrictionType)) {
            throw new Error ('Restriction type is not allowed.');
        }
        return AccountMosaicRestrictionModificationTransaction.create(
            deadline,
            restrictionType,
            modifications,
            networkType,
            maxFee,
        );
    }

    /**
     * Create an account operation restriction transaction object
     * @param deadline - The deadline to include the transaction.
     * @param restrictionType - Type of account restriction transaction
     * @param modification - array of operation modifications
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {createOperationRestrictionModificationTransaction}
     */
    public static createOperationRestrictionModificationTransaction(
        deadline: Deadline,
        restrictionType: RestrictionType,
        modifications: Array<AccountRestrictionModification<TransactionType>>,
        networkType: NetworkType,
        maxFee?: UInt64): AccountOperationRestrictionModificationTransaction {
        if (![RestrictionType.AllowTransaction, RestrictionType.BlockTransaction].includes(restrictionType)) {
            throw new Error ('Restriction type is not allowed.');
        }
        return AccountOperationRestrictionModificationTransaction.create(
            deadline,
            restrictionType,
            modifications,
            networkType,
            maxFee,
        );
    }
}
