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
 * Hash type. Supported types are:
 * 0: SHA3_512.
 */
import {convert} from 'proximax-nem2-library';

export enum HashType {
    SHA3_512 = 0,
}

export function HashTypeLengthValidator(hashType: HashType, input: string): boolean {
    if (hashType === HashType.SHA3_512 && convert.isHexString(input)) {
        return input.length === 128;
    }
    return false;
}
