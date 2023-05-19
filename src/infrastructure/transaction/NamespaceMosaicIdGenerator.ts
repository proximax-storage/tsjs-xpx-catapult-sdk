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

import {Crypto} from '../../core/crypto';
import { IdGenerator } from '../../core/format';

export class NamespaceMosaicIdGenerator {
    /**
     * @returns mosaic Id
     */
    public static mosaicId = (nonce: Uint8Array, ownerPublicId: Uint8Array) => {
        return IdGenerator.generateMosaicId(nonce, ownerPublicId);
    }

    /**
     * @returns random mosaic nonce
     */
    public static generateRandomMosaicNonce = () => {
        return Crypto.randomBytes(4);
    }

    /**
     * @param {string} namespaceName - The namespace name
     * @returns sub namespace id
     */
    public static namespaceId = (namespaceName: string) => {
        const path = IdGenerator.generateNamespacePath(namespaceName);
        return path.length ? IdGenerator.generateNamespacePath(namespaceName)[path.length - 1] : [];
    }

    /**
     * @param {number[]} parentNamespaceId - The parent namespace id
     * @param {string} namespaceName - The namespace name
     * @returns sub namespace id
     */
     public static subNamespaceIdWithParentId = (parentNamespaceId: number[], namespaceName: string) => {
        return IdGenerator.generateNamespaceIdWithParentId(parentNamespaceId, namespaceName);
    }
    
    /**
     * @param {string} parentNamespaceName - The parent namespace name
     * @param {string} namespaceName - The namespace name
     * @returns sub namespace parent id
     */
    public static subnamespaceParentId = (parentNamespaceName: string, namespaceName: string) => {
        const path = IdGenerator.generateNamespacePath(`${parentNamespaceName}.${namespaceName}`);
        return IdGenerator.generateNamespacePath(parentNamespaceName)[path.length - 2];
    }

    /**
     * @param {string} parentNamespaceName - The parent namespace name
     * @param {string} namespaceName - The namespace name
     * @returns sub namespace id
     */
    public static subnamespaceNamespaceId = (parentNamespaceName: string, namespaceName: string) => {
        const path = IdGenerator.generateNamespacePath(`${parentNamespaceName}.${namespaceName}`);
        return path[path.length - 1];
    }
}
