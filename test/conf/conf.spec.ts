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

import {Account} from '../../src/model/account/Account';
import {NetworkType} from '../../src/model/blockchain/NetworkType';

// TODO: configuration switch from command-line/npm "target"

export const TestingAccount = Account.createFromPrivateKey(
    '26b64cb10f005e5988a36744ca19e20d835ccc7c105aaa5f3b212da593180930',
    NetworkType.MIJIN_TEST, 1);

export const MultisigAccount = Account.createFromPrivateKey(
    '5edebfdbeb32e9146d05ffd232c8af2cf9f396caf9954289daa0362d097fff3b',
    NetworkType.MIJIN_TEST, 1);

export const CosignatoryAccount = Account.createFromPrivateKey(
    '2a2b1f5d366a5dd5dc56c3c757cf4fe6c66e2787087692cf329d7a49a594658b',
    NetworkType.MIJIN_TEST, 1);

export const Cosignatory2Account = Account.createFromPrivateKey(
    'b8afae6f4ad13a1b8aad047b488e0738a437c7389d4ff30c359ac068910c1d59',
    NetworkType.MIJIN_TEST, 1);

export const Cosignatory3Account = Account.createFromPrivateKey(
    '111602be4d36f92dd60ca6a3c68478988578f26f6a02f8c72089839515ab603e',
    NetworkType.MIJIN_TEST, 1);

export const Customer1Account = Account.createFromPrivateKey(
    'c2b069398cc135645fa0959708ad2504f3dcfdb12a8b95c015ecbd16e29aeb77',
    NetworkType.TEST_NET, 1
)

export const Executor1Account = Account.createFromPrivateKey(
    '0e02cce89fb87546f21b0b594461dcbea8b0a33743095870c3a1cd914e38be62',
    NetworkType.TEST_NET, 1
)

export const Verifier1Account = Account.createFromPrivateKey(
    'c8a449299d45b26e4679b5fdd8e39a73fccd74f77444a8bf68d2893a93d29770',
    NetworkType.TEST_NET, 1
)

export const TestingAccountV2 = Account.createFromPrivateKey(
    '26b64cb10f005e5988a36744ca19e20d835ccc7c105aaa5f3b212da593180930',
    NetworkType.MIJIN_TEST, 2);

export const MultisigAccountV2 = Account.createFromPrivateKey(
    '5edebfdbeb32e9146d05ffd232c8af2cf9f396caf9954289daa0362d097fff3b',
    NetworkType.MIJIN_TEST, 2);

export const CosignatoryAccountV2 = Account.createFromPrivateKey(
    '2a2b1f5d366a5dd5dc56c3c757cf4fe6c66e2787087692cf329d7a49a594658b',
    NetworkType.MIJIN_TEST, 2);

export const Cosignatory2AccountV2 = Account.createFromPrivateKey(
    'b8afae6f4ad13a1b8aad047b488e0738a437c7389d4ff30c359ac068910c1d59',
    NetworkType.MIJIN_TEST, 2);

export const Cosignatory3AccountV2 = Account.createFromPrivateKey(
    '111602be4d36f92dd60ca6a3c68478988578f26f6a02f8c72089839515ab603e',
    NetworkType.MIJIN_TEST, 2);

export const Customer1AccountV2 = Account.createFromPrivateKey(
    'c2b069398cc135645fa0959708ad2504f3dcfdb12a8b95c015ecbd16e29aeb77',
    NetworkType.TEST_NET, 2);

export const Executor1AccountV2 = Account.createFromPrivateKey(
    '0e02cce89fb87546f21b0b594461dcbea8b0a33743095870c3a1cd914e38be62',
    NetworkType.TEST_NET, 2);

export const Verifier1AccountV2 = Account.createFromPrivateKey(
    'c8a449299d45b26e4679b5fdd8e39a73fccd74f77444a8bf68d2893a93d29770',
    NetworkType.TEST_NET, 2);