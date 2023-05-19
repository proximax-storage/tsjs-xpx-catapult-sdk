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

import { Convert as convert } from '../format';
import { DerivationScheme } from './DerivationScheme';
import * as Utility from './Utilities';

interface IKeyPair{
    privateKey: Uint8Array;
    publicKey: Uint8Array;
}

export class KeyPair {
    /**
     * Creates a key pair from a private key string.
     * @param {string} privateKeyString A hex encoded private key string.
     * @param {DerivationScheme} dScheme The derivation scheme
     * @returns {module:crypto/keyPair~KeyPair} The key pair.
     */
    public static createKeyPairFromPrivateKeyString(privateKeyString: string, dScheme = DerivationScheme.Ed25519Sha3): IKeyPair {
        const privateKey = convert.hexToUint8(privateKeyString);

        const secretKey = privateKey;
        if (Utility.Key_Size !== privateKey.length) {
            throw Error(`private key has unexpected size: ${privateKey.length}`);
        }

        const publicKey = Utility.catapult_crypto.extractPublicKey(
            secretKey, 
            Utility.getHasherFuncFromDerivationScheme(dScheme)
        );
        return {
            privateKey,
            publicKey,
        };
    }

    /**
     * Signs a data buffer with a key pair.
     * @param {module:crypto/keyPair~KeyPair} keyPair The key pair to use for signing.
     * @param {Uint8Array} data The data to sign.
     * @param {DerivationScheme} dScheme The derivation scheme
     * @returns {Uint8Array} The signature.
     */
    public static sign = (keyPair: IKeyPair, data: Uint8Array, dScheme = DerivationScheme.Ed25519Sha3) => {
        let secretKey = keyPair.privateKey;

        return Utility.catapult_crypto.sign(data, keyPair.publicKey, secretKey, Utility.getHasherFromDerivationScheme(dScheme));
    }

    /**
     * Verifies a signature.
     * @param {Uint8Array} publicKey The public key to use for verification.
     * @param {Uint8Array} data The data to verify.
     * @param {Uint8Array} signature The signature to verify.
     * @param {DerivationScheme} dScheme The derivation scheme
     * @returns {boolean} true if the signature is verifiable, false otherwise.
     */
    public static verify = (publicKey: Uint8Array, data: Uint8Array, signature: Uint8Array, dScheme = DerivationScheme.Ed25519Sha3) => {
        return Utility.catapult_crypto.verify(publicKey, data, signature, Utility.getHasherFromDerivationScheme(dScheme));
    }

    /**
     * Creates a shared key given a key pair and an arbitrary public key.
     * The shared key can be used for encrypted message passing between the two.
     * @param {Uint8Array} secretKey The key pair for which to create the shared key.
     * @param {Uint8Array} publicKey The public key for which to create the shared key.
     * @param {Uint8Array} salt A salt that should be applied to the shared key.
     * @returns {Uint8Array} The shared key.
     */
    public static deriveSharedKey(secretKey: Uint8Array, publicKey: Uint8Array, salt: Uint8Array, version: number): Uint8Array {
        if (Utility.Key_Size !== salt.length) {
            throw Error(`salt has unexpected size: ${salt.length}`);
        }
        if (Utility.Key_Size !== publicKey.length) {
            throw Error(`public key has unexpected size: ${salt.length}`);
        }
        // let secretKey = keyPair.privateKey;

        return Utility.catapult_crypto.deriveSharedKey(salt, secretKey, publicKey, Utility.getHasherFuncFromAccountVersion(version));
    }
}
