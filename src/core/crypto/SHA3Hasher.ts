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

import { sha3_256, sha3_512, Keccak } from '@noble/hashes/sha3';
import { bytesToHex, Hash } from '@noble/hashes/utils';
import { Convert as convert, RawArray as array } from '../format';

export class SHA3Hasher {
    /**
     * Calculates the hash of data.
     * @param {Uint8Array} dest The computed hash destination.
     * @param {Uint8Array} data The data to hash.
     * @param {numeric} length The hash length in bytes.
     */
    public static func = (dest, data: Uint8Array, length) => {
        const hasher = SHA3Hasher.getHasher(length);
        if(hasher === undefined)
            throw new Error("invalid hasher, hasher not found");
        const hash = hasher.update(data).digest();
        array.copy(dest, array.uint8View(hash));
    }

    /**
     * Creates a hasher object.
     * @param {numeric} length The hash length in bytes.
     * @returns {object} The hasher.
     */
    public static createHasher = (length = 64) => {
        let hash: Hash<Keccak>;
        return {
            reset: () => {
                hash = SHA3Hasher.getHasher(length)!;
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
                array.copy(result, array.uint8View(hash.digest()));
            },
        };
    }

    /**
     * Get a hasher instance.
     * @param {numeric} length The hash length in bytes.
     * @returns {object} The hasher.
     */
    public static getHasher = (length = 64) => {
        return {
            32: sha3_256.create(),
            64: sha3_512.create()
        } [length];
    }
}
