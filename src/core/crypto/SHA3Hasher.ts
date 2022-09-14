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

import { keccak256, keccak512, sha3_256, sha3_512 } from 'js-sha3';
import { Convert as convert, RawArray as array } from '../format';
import { SignSchema } from './SignSchema';

export class SHA3Hasher {
    /**
     * Calculates the hash of data.
     * @param {Uint8Array} dest The computed hash destination.
     * @param {Uint8Array} data The data to hash.
     * @param {numeric} length The hash length in bytes.
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     */
    public static func = (dest, data, length, signSchema = SignSchema.SHA3) => {
        const hasher = SHA3Hasher.getHasher(length, signSchema);
        if(hasher === undefined)
            throw new Error("invalid hasher, hasher not found");
        const hash = hasher.arrayBuffer(data);
        array.copy(dest, array.uint8View(hash));
    }

    /**
     * Creates a hasher object.
     * @param {numeric} length The hash length in bytes.
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @returns {object} The hasher.
     */
    public static createHasher = (length = 64, signSchema = SignSchema.SHA3) => {
        let hash;
        return {
            reset: () => {
                hash = SHA3Hasher.getHasher(length, signSchema)!.create();
            },
            update: (data: any) => {
                if (data instanceof Uint8Array) {
                    hash.update(data);
                } else if ('string' === typeof data) {
                    hash.update(convert.hexToUint8(data));
                } else {
                    throw Error('unsupported data type');
                }
            },
            finalize: (result: any) => {
                array.copy(result, array.uint8View(hash.arrayBuffer()));
            },
        };
    }

    /**
     * Get a hasher instance.
     * @param {numeric} length The hash length in bytes.
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @returns {object} The hasher.
     */
    public static getHasher = (length = 64, signSchema = SignSchema.SHA3) => {
        return {
            32: signSchema === SignSchema.SHA3 ? sha3_256 : keccak256,
            64: signSchema === SignSchema.SHA3 ? sha3_512 : keccak512 ,
        } [length];
    }
}
