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

/**
 * Co-signature signed transaction.
 */
export class CosignatureSignedTransaction {
    /**
     * @param parentHash
     * @param signature
     * @param signer
     */
    constructor(
                /**
                 * The hash of parent aggregate transaction that has been signed by a cosignatory of the transaction
                 */
                public readonly parentHash: string,
                /**
                 * The signatures generated by signing the parent aggregate transaction hash.
                 */
                public readonly signature: string,
                /**
                 * The signer of the transaction.
                 */
                public readonly signer: string) {}
}