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
import { SecretProofTransaction as SecretProofTransactionLibrary, VerifiableTransaction } from 'proximax-nem2-library';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { HashType, HashTypeLengthValidator } from './HashType';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';

export class SecretProofTransaction extends Transaction {

    /**
     * Create a secret proof transaction object.
     *
     * @param deadline - The deadline to include the transaction.
     * @param hashType - The hash algorithm secret is generated with.
     * @param secret - The seed proof hashed.
     * @param proof - The seed proof.
     * @param networkType - The network type.
     *
     * @return a SecretProofTransaction instance
     */
    public static create(deadline: Deadline,
                         hashType: HashType,
                         secret: string,
                         proof: string,
                         networkType: NetworkType): SecretProofTransaction {
        return new SecretProofTransaction(
            networkType,
            3,
            deadline,
            UInt64.fromUint(0),
            hashType,
            secret,
            proof,
        );
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param fee
     * @param hashType
     * @param secret
     * @param proof
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                fee: UInt64,
                public readonly hashType: HashType,
                public readonly secret: string,
                public readonly proof: string,
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {
        super(TransactionType.SECRET_PROOF, networkType, version, deadline, fee, signature, signer, transactionInfo);
        if (!HashTypeLengthValidator(hashType, this.secret)) {
            throw new Error('HashType and Secret have incompatible length or not hexadecimal string');
        }
    }

    /**
     * @internal
     * @returns {VerifiableTransaction}
     */
    protected buildTransaction(): VerifiableTransaction {
        return new SecretProofTransactionLibrary.Builder()
            .addDeadline(this.deadline.toDTO())
            .addType(this.type)
            .addFee(this.fee.toDTO())
            .addVersion(this.versionToDTO())
            .addHashAlgorithm(this.hashType)
            .addSecret(this.secret)
            .addProof(this.proof)
            .build();
    }

}
