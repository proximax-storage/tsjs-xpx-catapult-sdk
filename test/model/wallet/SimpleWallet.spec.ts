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

import {expect} from 'chai';
import {Account} from '../../../src/model/account/Account';
import {NetworkType} from '../../../src/model/blockchain/NetworkType';
import {Password} from '../../../src/model/wallet/Password';
import {SimpleWallet} from '../../../src/model/wallet/SimpleWallet';

describe('SimpleWallet', () => {
    it('should createComplete a new simple wallet', () => {
        const simpleWallet = SimpleWallet.create('wallet-name', new Password('password'), NetworkType.MIJIN_TEST);
        expect(simpleWallet.name).to.be.equal('wallet-name');
        expect(simpleWallet.network).to.be.equal(NetworkType.MIJIN_TEST);
        expect(simpleWallet.schema).to.be.equal('sirius_dual');
    });

    it('should createComplete a new wallet with privateKey', () => {
        const privateKey = '5149a02ca2b2610138376717daaff8477f1639796aa108b7eee83e99e585b250';
        const account = Account.createFromPrivateKey(privateKey, NetworkType.MIJIN_TEST, 1);
        const simpleWallet = SimpleWallet.createFromPrivateKey('wallet-name', new Password('password'), privateKey, NetworkType.MIJIN_TEST);
        expect(simpleWallet.name).to.be.equal('wallet-name');
        expect(simpleWallet.network).to.be.equal(NetworkType.MIJIN_TEST);
        expect(simpleWallet.publicAccount.address.plain()).to.be.equal(account.address.plain());
    });

    it('should open a new simple wallet', () => {
        const simpleWallet = SimpleWallet.create('wallet-name', new Password('password'), NetworkType.MIJIN_TEST);
        const account = simpleWallet.open(new Password('password'));
        expect(account.address.plain()).to.be.equal(simpleWallet.publicAccount.address.plain());
    });

    it('should open a new simple wallet created from private key', () => {
        const privateKey = '5149a02ca2b2610138376717daaff8477f1639796aa108b7eee83e99e585b250';
        const simpleWallet = SimpleWallet.createFromPrivateKey('wallet-name', new Password('password'), privateKey, NetworkType.MIJIN_TEST);
        const account = simpleWallet.open(new Password('password'));
        expect(simpleWallet.publicAccount.address.plain()).to.be.equal(account.address.plain());
    });
});
