/*
 * Copyright 2023 ProximaX
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

import {PublicAccount} from '../account/PublicAccount';
import { DerivationScheme } from '../../core/crypto/DerivationScheme';
/**
 * Model representing cosignature of an aggregate transaction.
 */
export class AggregateV2TransactionCosignature {

    /**
     * @param dScheme
     * @param signature
     * @param signer
     */
    constructor(
                /**
                 * The derivation scheme of cosigner.
                 */
                public readonly dScheme: DerivationScheme,
                /**
                 * The signature of aggregate transaction done by the cosigner.
                 */
                public readonly signature: string,
                /**
                 * The cosigner public account.
                 */
                public readonly signer: PublicAccount) {

    }

    /**
     * Create DTO object
     */
    public toDTO() {
        return {
            derivationScheme: this.dScheme,
            signature: this.signature,
            signer: this.signer.toDTO(),
        };
    }
}
