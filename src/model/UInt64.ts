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

import { RawUInt64 as uint64 } from '../core/format';

/**
 * UInt64 data model
 */
export class UInt64 {

    /**
     * uint64 lower part
     */
    public readonly lower: number;

    /**
     * uint64 higher part
     */
    public readonly higher: number;

    /**
     * Create from uint value
     * @param value
     * @returns {UInt64}
     */
    public static fromUint(value: number): UInt64 {
        if (value < 0) {
            throw new Error('Unsigned integer cannot be negative');
        }
        return new UInt64(uint64.fromUint(value));
    }

    /**
     * Parses a hex string into a UInt64.
     * @param {string} input A hex encoded string.
     * @returns {module:coders/uint64~uint64} The uint64 representation of the input.
     */
    public static fromHex(input: string): UInt64 {
        const dto = uint64.fromHex(input);
        return new UInt64(dto);
    }

    /**
     * Constructor
     * @param uintArray
     */
    constructor(uintArray: number[]) {
        // TODO: temporary hack to get around maxFee as string ("0") in i.e. /block/1/transactions
        if (typeof uintArray === 'string' || uintArray instanceof String) {
            const i = UInt64.fromUint(Number.parseInt((uintArray as any)));
            this.lower = i.lower;
            this.higher = i.higher;
            return;
        }
        if (!uintArray || uintArray.length !== 2 || uintArray[0] < 0 || uintArray[1] < 0) {
            throw new Error('uintArray must be be an array of two uint numbers');
        }
        this.lower = uintArray[0];
        this.higher = uintArray[1];
    }

    /**
     * Get DTO representation with format: `[lower, higher]`
     *
     * @internal
     * @returns {[number,number]}
     */
    public toDTO(): number[] {
        return [this.lower, this.higher];
    }

    /**
     * Get hexadecimal representation
     *
     * @return {string}
     */
    public toHex(): string {
        return uint64.toHex(this.toDTO());
    }

    public toBigInt(): BigInt{
        return BigInt("0x" + this.toHex());
    }

    /**
     * Compact higher and lower uint parts into a uint
     * @returns {number}
     */
    public compact(): number {
        return uint64.compact(this.toDTO());
    }

    /**
     * Compares for equality
     * @param other
     * @returns {boolean}
     */
    public equals(other: UInt64): boolean {
        return this.lower === other.lower && this.higher === other.higher;
    }
}
