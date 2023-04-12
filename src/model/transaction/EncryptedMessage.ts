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

import {Crypto, SignSchema} from '../../core/crypto';
import {PublicAccount} from '../account/PublicAccount';
import {Message} from './Message';
import {MessageType} from './MessageType';
import {PlainMessage} from './PlainMessage';

/**
 * Encrypted Message model
 */
export class EncryptedMessage extends Message {

    constructor(payload: string) {
        super(MessageType.EncryptedMessage, payload);
    }


    /**
     *
     * @param message - Plain message to be encrypted
     * @param recipientPublicAccount - Recipient public account
     * @param privateKey - Sender private key
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @return {EncryptedMessage}
     */
    public static create(message: string, recipientPublicAccount: PublicAccount, privateKey, signSchema: SignSchema = SignSchema.SHA3) {
        return new EncryptedMessage(
            Crypto.encode(privateKey, recipientPublicAccount.publicKey, message, signSchema).toUpperCase()
        );
    }

    /**
     *
     * @param payload
     */
    public static createFromPayload(payload: string): EncryptedMessage {
        return new EncryptedMessage(payload);
    }

    /**
     *
     * @param encryptMessage - Encrypted message to be decrypted
     * @param privateKey - Recipient private key
     * @param recipientPublicAccount - Sender public account
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @return {PlainMessage}
     */
    public static decrypt(encryptMessage: EncryptedMessage,
                          privateKey,
                          recipientPublicAccount: PublicAccount,
                          signSchema: SignSchema = SignSchema.SHA3): PlainMessage {
        return new PlainMessage(Crypto.decode(privateKey, recipientPublicAccount.publicKey, encryptMessage.payload, signSchema));
    }
}
