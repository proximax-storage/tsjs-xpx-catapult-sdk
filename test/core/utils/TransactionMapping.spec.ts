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

import {deepStrictEqual, deepEqual} from 'assert';
import { expect } from 'chai';
import { sha3_256 } from 'js-sha3';
import {Convert as convert} from '../../../src/core/format';
import { TransactionMapping } from '../../../src/core/utils/TransactionMapping';
import { Account } from '../../../src/model/account/Account';
import { Address } from '../../../src/model/account/Address';
import { PublicAccount } from '../../../src/model/account/PublicAccount';
import { RestrictionModificationType } from '../../../src/model/account/RestrictionModificationType';
import { RestrictionType } from '../../../src/model/account/RestrictionType';
import { NetworkType } from '../../../src/model/blockchain/NetworkType';
import { EncryptedMessage, MosaicMetadataTransaction, AccountMetadataTransaction, NamespaceMetadataTransaction, 
    ChainConfigTransaction, ChainUpgradeTransaction, MosaicModifyLevyTransaction, MosaicRemoveLevyTransaction } from '../../../src/model/model';
import { KeyGenerator } from '../../../src/core/format/KeyGenerator';
import { MosaicId } from '../../../src/model/mosaic/MosaicId';
import { MosaicLevy } from '../../../src/model/mosaic/MosaicLevy';
import { MosaicLevyType } from '../../../src/model/mosaic/MosaicLevyType';
import { MosaicNonce } from '../../../src/model/mosaic/MosaicNonce';
import { MosaicProperties } from '../../../src/model/mosaic/MosaicProperties';
import { MosaicSupplyType } from '../../../src/model/mosaic/MosaicSupplyType';
import { NetworkCurrencyMosaic } from '../../../src/model/mosaic/NetworkCurrencyMosaic';
import { AliasActionType } from '../../../src/model/namespace/AliasActionType';
import { NamespaceId } from '../../../src/model/namespace/NamespaceId';
import { NamespaceType } from '../../../src/model/namespace/NamespaceType';
import { AccountAddressRestrictionModificationTransaction } from '../../../src/model/transaction/AccountAddressRestrictionModificationTransaction';
import { AccountLinkTransaction } from '../../../src/model/transaction/AccountLinkTransaction';
import { AccountMosaicRestrictionModificationTransaction } from '../../../src/model/transaction/AccountMosaicRestrictionModificationTransaction';
import { AccountRestrictionModification } from '../../../src/model/transaction/AccountRestrictionModification';
import { AccountRestrictionTransaction } from '../../../src/model/transaction/AccountRestrictionTransaction';
import { AddressAliasTransaction } from '../../../src/model/transaction/AddressAliasTransaction';
import { AggregateTransaction } from '../../../src/model/transaction/AggregateTransaction';
import { Deadline } from '../../../src/model/transaction/Deadline';
import { HashType } from '../../../src/model/transaction/HashType';
import { LinkAction } from '../../../src/model/transaction/LinkAction';
import { LockFundsTransaction } from '../../../src/model/transaction/LockFundsTransaction';
import { MessageType } from '../../../src/model/transaction/MessageType';
import { ModifyMultisigAccountTransaction } from '../../../src/model/transaction/ModifyMultisigAccountTransaction';
import { MosaicAliasTransaction } from '../../../src/model/transaction/MosaicAliasTransaction';
import { MosaicDefinitionTransaction } from '../../../src/model/transaction/MosaicDefinitionTransaction';
import { MosaicSupplyChangeTransaction } from '../../../src/model/transaction/MosaicSupplyChangeTransaction';
import { MultisigCosignatoryModification } from '../../../src/model/transaction/MultisigCosignatoryModification';
import { MultisigCosignatoryModificationType } from '../../../src/model/transaction/MultisigCosignatoryModificationType';
import { PlainMessage } from '../../../src/model/transaction/PlainMessage';
import { RegisterNamespaceTransaction } from '../../../src/model/transaction/RegisterNamespaceTransaction';
import { SecretLockTransaction } from '../../../src/model/transaction/SecretLockTransaction';
import { SecretProofTransaction } from '../../../src/model/transaction/SecretProofTransaction';
import { TransactionType } from '../../../src/model/transaction/TransactionType' ;
import { TransferTransaction } from '../../../src/model/transaction/TransferTransaction';
import { UInt64 } from '../../../src/model/UInt64';
import { TestingAccount } from '../../conf/conf.spec';
import { XpxMosaicProperties } from '../../../src/model/mosaic/NetworkMosaic';
import { AddExchangeOfferTransaction } from '../../../src/model/transaction/AddExchangeOfferTransaction';
import { AddExchangeOffer } from '../../../src/model/transaction/AddExchangeOffer';
import { ExchangeOffer } from '../../../src/model/transaction/ExchangeOffer';
import { ExchangeOfferType } from '../../../src/model/transaction/ExchangeOfferType';
import { ExchangeOfferTransaction } from '../../../src/model/transaction/ExchangeOfferTransaction';
import { RemoveExchangeOfferTransaction } from '../../../src/model/transaction/RemoveExchangeOfferTransaction';
import { RemoveExchangeOffer } from '../../../src/model/transaction/RemoveExchangeOffer';
import { Base32 } from '../../../src/core/format/Base32';

describe('TransactionMapping - createFromPayload', () => {
    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = TestingAccount;
    });

    it('should create AccountRestrictionAddressTransaction', () => {
        const address = Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressRestrictionFilter = AccountRestrictionModification.createForAddress(
            RestrictionModificationType.Add,
            address,
        );
        const addressRestrictionTransaction = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
            Deadline.create(),
            RestrictionType.AllowAddress,
            [addressRestrictionFilter],
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = addressRestrictionTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as AccountAddressRestrictionModificationTransaction;

        expect(transaction.restrictionType).to.be.equal(RestrictionType.AllowAddress);
        expect(transaction.modifications[0].modificationType).to.be.equal(RestrictionModificationType.Add);
        expect(transaction.modifications[0].value).to.be.equal('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
    });

    it('should create AccountRestrictionMosaicTransaction', () => {
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicRestrictionFilter = AccountRestrictionModification.createForMosaic(
            RestrictionModificationType.Add,
            mosaicId,
        );
        const mosaicRestrictionTransaction = AccountRestrictionTransaction.createMosaicRestrictionModificationTransaction(
            Deadline.create(),
            RestrictionType.AllowMosaic,
            [mosaicRestrictionFilter],
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = mosaicRestrictionTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as AccountAddressRestrictionModificationTransaction;
        expect(transaction.restrictionType).to.be.equal(RestrictionType.AllowMosaic);
        expect(transaction.modifications[0].value[0]).to.be.equal(2262289484);
        expect(transaction.modifications[0].value[1]).to.be.equal(3405110546);
        expect(transaction.modifications[0].modificationType).to.be.equal(RestrictionModificationType.Add);
    });

    it('should create AccountRestrictionOperationTransaction', () => {
        const operation = TransactionType.ADDRESS_ALIAS;
        const operationRestrictionFilter = AccountRestrictionModification.createForOperation(
            RestrictionModificationType.Add,
            operation,
        );
        const operationRestrictionTransaction = AccountRestrictionTransaction.createOperationRestrictionModificationTransaction(
            Deadline.create(),
            RestrictionType.AllowTransaction,
            [operationRestrictionFilter],
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = operationRestrictionTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as AccountAddressRestrictionModificationTransaction;
        expect(transaction.restrictionType).to.be.equal(RestrictionType.AllowTransaction);
        expect(transaction.modifications[0].value).to.be.equal(operation);
        expect(transaction.modifications[0].modificationType).to.be.equal(RestrictionModificationType.Add);
    });

    it('should create AddressAliasTransaction', () => {
        const namespaceId = new NamespaceId([33347626, 3779697293]);
        const address = Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressAliasTransaction = AddressAliasTransaction.create(
            Deadline.create(),
            AliasActionType.Link,
            namespaceId,
            address,
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = addressAliasTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as AddressAliasTransaction;

        expect(transaction.actionType).to.be.equal(AliasActionType.Link);
        expect(transaction.namespaceId.id.lower).to.be.equal(33347626);
        expect(transaction.namespaceId.id.higher).to.be.equal(3779697293);
        expect(transaction.address.plain()).to.be.equal('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
    });

    it('should create MosaicAliasTransaction', () => {
        const namespaceId = new NamespaceId([33347626, 3779697293]);
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicAliasTransaction = MosaicAliasTransaction.create(
            Deadline.create(),
            AliasActionType.Link,
            namespaceId,
            mosaicId,
            NetworkType.MIJIN_TEST,
        );
        const signedTransaction = mosaicAliasTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as MosaicAliasTransaction;

        expect(mosaicAliasTransaction.actionType).to.be.equal(AliasActionType.Link);
        expect(mosaicAliasTransaction.namespaceId.id.lower).to.be.equal(33347626);
        expect(mosaicAliasTransaction.namespaceId.id.higher).to.be.equal(3779697293);
        expect(mosaicAliasTransaction.mosaicId.id.lower).to.be.equal(2262289484);
        expect(mosaicAliasTransaction.mosaicId.id.higher).to.be.equal(3405110546);

    });

    it('should create MosaicDefinitionTransaction', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
            Deadline.create(),
            new MosaicNonce(new Uint8Array([0xE6, 0xDE, 0x84, 0xB8])), // nonce
            new MosaicId(UInt64.fromUint(1).toDTO()), // ID
            MosaicProperties.create({
                supplyMutable: false,
                transferable: false,
                divisibility: 3,
                duration: UInt64.fromUint(1000),
            }),
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = mosaicDefinitionTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as MosaicDefinitionTransaction;

        expect(transaction.mosaicProperties.duration!.lower).to.be.equal(1000);
        expect(transaction.mosaicProperties.duration!.higher).to.be.equal(0);
        expect(transaction.mosaicProperties.divisibility).to.be.equal(3);
        expect(transaction.mosaicProperties.supplyMutable).to.be.equal(false);
        expect(transaction.mosaicProperties.transferable).to.be.equal(false);

    });

    it('should create MosaicDefinitionTransaction - without duration', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
            Deadline.create(),
            new MosaicNonce(new Uint8Array([0xE6, 0xDE, 0x84, 0xB8])), // nonce
            new MosaicId(UInt64.fromUint(1).toDTO()), // ID
            MosaicProperties.create({
                supplyMutable: false,
                transferable: false,
                divisibility: 3,
            }),
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = mosaicDefinitionTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as MosaicDefinitionTransaction;

        expect(transaction.mosaicProperties.divisibility).to.be.equal(3);
        expect(transaction.mosaicProperties.supplyMutable).to.be.equal(false);
        expect(transaction.mosaicProperties.transferable).to.be.equal(false);

    });

    it('should create MosaicDefinitionTransaction - without duration', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
            Deadline.create(),
            new MosaicNonce(new Uint8Array([0xE6, 0xDE, 0x84, 0xB8])), // nonce
            new MosaicId(UInt64.fromUint(1).toDTO()), // ID
            MosaicProperties.create({
                supplyMutable: false,
                transferable: false,
                divisibility: 3,
            }),
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = mosaicDefinitionTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as MosaicDefinitionTransaction;

        expect(transaction.mosaicProperties.divisibility).to.be.equal(3);
        expect(transaction.mosaicProperties.supplyMutable).to.be.equal(false);
        expect(transaction.mosaicProperties.transferable).to.be.equal(false);

    });

    it('should create MosaicDefinitionTransaction - without duration', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
            Deadline.create(),
            new MosaicNonce(new Uint8Array([0xE6, 0xDE, 0x84, 0xB8])), // nonce
            new MosaicId(UInt64.fromUint(1).toDTO()), // ID
            MosaicProperties.create({
                supplyMutable: false,
                transferable: false,
                divisibility: 3,
            }),
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = mosaicDefinitionTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as MosaicDefinitionTransaction;

        expect(transaction.mosaicProperties.divisibility).to.be.equal(3);
        expect(transaction.mosaicProperties.supplyMutable).to.be.equal(false);
        expect(transaction.mosaicProperties.transferable).to.be.equal(false);

    });

    it('should create MosaicDefinitionTransaction - without duration', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
            Deadline.create(),
            new MosaicNonce(new Uint8Array([0xE6, 0xDE, 0x84, 0xB8])), // nonce
            new MosaicId(UInt64.fromUint(1).toDTO()), // ID
            MosaicProperties.create({
                supplyMutable: false,
                transferable: false,
                divisibility: 3,
            }),
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = mosaicDefinitionTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as MosaicDefinitionTransaction;

        expect(transaction.mosaicProperties.divisibility).to.be.equal(3);
        expect(transaction.mosaicProperties.supplyMutable).to.be.equal(false);
        expect(transaction.mosaicProperties.transferable).to.be.equal(false);

    });

    it('should create MosaicSupplyChangeTransaction', () => {
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
            Deadline.create(),
            mosaicId,
            MosaicSupplyType.Increase,
            UInt64.fromUint(10),
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = mosaicSupplyChangeTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as MosaicSupplyChangeTransaction;

        expect(transaction.direction).to.be.equal(MosaicSupplyType.Increase);
        expect(transaction.delta.lower).to.be.equal(10);
        expect(transaction.delta.higher).to.be.equal(0);
        expect(transaction.mosaicId.id.lower).to.be.equal(2262289484);
        expect(transaction.mosaicId.id.higher).to.be.equal(3405110546);

    });

    it('should create modifyMosaicLevyTransaction - absolute fee type', () => {
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicLevy = MosaicLevy.createWithAbsoluteFee(account.address, mosaicId, 50);
        const mosaicModifyLevyTransaction = MosaicModifyLevyTransaction.create(
            Deadline.create(),
            mosaicId,
            mosaicLevy,
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = mosaicModifyLevyTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as MosaicModifyLevyTransaction;

        expect(transaction.mosaicLevy.fee.compact()).to.be.equal(50);
        expect(transaction.mosaicLevy.recipient.plain()).to.be.equal(account.address.plain());
        expect(transaction.mosaicLevy.type).to.be.equal(MosaicLevyType.LevyAbsoluteFee);
    })

    it('should create modifyMosaicLevyTransaction - percentage fee type', () => {
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicLevy = MosaicLevy.createWithPercentageFee(account.address, mosaicId, 1.5);
        const mosaicModifyLevyTransaction = MosaicModifyLevyTransaction.create(
            Deadline.create(),
            mosaicId,
            mosaicLevy,
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = mosaicModifyLevyTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as MosaicModifyLevyTransaction;

        expect(transaction.mosaicLevy.fee.compact()).to.be.equal(150000);
        expect(transaction.mosaicLevy.recipient.plain()).to.be.equal(account.address.plain());
        expect(transaction.mosaicLevy.type).to.be.equal(MosaicLevyType.LevyPercentileFee);
    })

    it('should create TransferTransaction', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            [
                NetworkCurrencyMosaic.createRelative(100),
            ],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = transferTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as TransferTransaction;

        expect(transaction.message.payload).to.be.equal('test-message');
        expect(transaction.mosaics.length).to.be.equal(1);
        expect(transaction.recipientToString()).to.be.equal('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');

    });

    it('should create SecretLockTransaction', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const recipient = Address.createFromRawAddress('SDBDG4IT43MPCW2W4CBBCSJJT42AYALQN7A4VVWL');
        const secretLockTransaction = SecretLockTransaction.create(
            Deadline.create(),
            NetworkCurrencyMosaic.createAbsolute(10),
            UInt64.fromUint(100),
            HashType.Op_Sha3_256,
            sha3_256.create().update(convert.hexToUint8(proof)).hex(),
            recipient,
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = secretLockTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as SecretLockTransaction;

        expect(transaction.mosaic.amount.equals(UInt64.fromUint(10))).to.be.equal(true);
        expect(transaction.duration.equals(UInt64.fromUint(100))).to.be.equal(true);
        expect(transaction.hashType).to.be.equal(0);
        expect(transaction.secret).to.be.equal('9B3155B37159DA50AA52D5967C509B410F5A36A3B1E31ECB5AC76675D79B4A5E');
        expect(transaction.recipient.plain()).to.be.equal(recipient.plain());

    });

    it('should create SecretProofTransaction', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const secretProofTransaction = SecretProofTransaction.create(
            Deadline.create(),
            HashType.Op_Sha3_256,
            sha3_256.create().update(convert.hexToUint8(proof)).hex(),
            account.address,
            proof,
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = secretProofTransaction.signWith(account, generationHash);
        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as SecretProofTransaction;

        expect(secretProofTransaction.hashType).to.be.equal(0);
        expect(secretProofTransaction.secret).to.be.equal('9b3155b37159da50aa52d5967c509b410f5a36a3b1e31ecb5ac76675d79b4a5e' );
        expect(secretProofTransaction.proof).to.be.equal(proof);
        expect(secretProofTransaction.recipient.plain()).to.be.equal(account.address.plain());

    });

    it('should create ModifyMultiSigTransaction', () => {
        const modifyMultisigAccountTransaction = ModifyMultisigAccountTransaction.create(
            Deadline.create(),
            2,
            1,
            [new MultisigCosignatoryModification(
                MultisigCosignatoryModificationType.Add,
                PublicAccount.createFromPublicKey('B0F93CBEE49EEB9953C6F3985B15A4F238E205584D8F924C621CBE4D7AC6EC24',
                    NetworkType.MIJIN_TEST),
            )],
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = modifyMultisigAccountTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as ModifyMultisigAccountTransaction;

        expect(transaction.minApprovalDelta)
            .to.be.equal(2);
        expect(transaction.minRemovalDelta)
            .to.be.equal(1);
        expect(transaction.modifications[0].type)
            .to.be.equal(MultisigCosignatoryModificationType.Add);
        expect(transaction.modifications[0].cosignatoryPublicAccount.publicKey)
            .to.be.equal('B0F93CBEE49EEB9953C6F3985B15A4F238E205584D8F924C621CBE4D7AC6EC24');
    });

    it('should create AggregatedTransaction - Complete', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            [],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [transferTransaction.toAggregate(account.publicAccount)],
            NetworkType.MIJIN_TEST,
            []);

        const signedTransaction = aggregateTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as AggregateTransaction;

        expect(transaction.innerTransactions[0].type).to.be.equal(TransactionType.TRANSFER);
    });

    it('should create AggregatedTransaction - Bonded', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            [],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        const aggregateTransaction = AggregateTransaction.createBonded(
            Deadline.create(),
            [transferTransaction.toAggregate(account.publicAccount)],
            NetworkType.MIJIN_TEST,
            []);

        const signedTransaction = aggregateTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as AggregateTransaction;

        expect(transaction.innerTransactions[0].type).to.be.equal(TransactionType.TRANSFER);
    });

    it('should create LockFundTransaction', () => {
        const aggregateTransaction = AggregateTransaction.createBonded(
            Deadline.create(),
            [],
            NetworkType.MIJIN_TEST,
            [],
        );
        const signedTransaction = account.sign(aggregateTransaction, generationHash);
        const lockTransaction = LockFundsTransaction.create(Deadline.create(),
            NetworkCurrencyMosaic.createRelative(10),
            UInt64.fromUint(10),
            signedTransaction,
            NetworkType.MIJIN_TEST);

        const signedLockFundTransaction = lockTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedLockFundTransaction.payload) as LockFundsTransaction;

        deepStrictEqual(transaction.mosaic.id.id, XpxMosaicProperties.ID.id);
        expect(transaction.mosaic.amount.compact()).to.be.equal(10000000);
        expect(transaction.hash).to.be.equal(signedTransaction.hash);
    });

    it('should create an AccountLinkTransaction object with link action', () => {
        const accountLinkTransaction = AccountLinkTransaction.create(
            Deadline.create(),
            account.publicKey,
            LinkAction.Link,
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = accountLinkTransaction.signWith(account, generationHash);
        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as AccountLinkTransaction;

        expect(transaction.linkAction).to.be.equal(0);
        expect(transaction.remoteAccountKey).to.be.equal(account.publicKey);
    });

    it('should create RegisterNamespaceTransaction - Root', () => {
        const registerNamespaceTransaction = RegisterNamespaceTransaction.createRootNamespace(
            Deadline.create(),
            'root-test-namespace',
            UInt64.fromUint(1000),
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = registerNamespaceTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as RegisterNamespaceTransaction;

        expect(transaction.namespaceType).to.be.equal(NamespaceType.RootNamespace);
        expect(transaction.namespaceName).to.be.equal('root-test-namespace');

    });

    it('should create RegisterNamespaceTransaction - Sub', () => {
        const registerNamespaceTransaction = RegisterNamespaceTransaction.createSubNamespace(
            Deadline.create(),
            'root-test-namespace',
            'parent-test-namespace',
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = registerNamespaceTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as RegisterNamespaceTransaction;

        expect(transaction.namespaceType).to.be.equal(NamespaceType.SubNamespace);
        expect(transaction.namespaceName).to.be.equal('root-test-namespace');
    });

    it('should create AccountMetadataTransaction', () => {
        const accountMetadataTransaction = AccountMetadataTransaction.create(
            Deadline.create(),
            account.publicAccount,
            "name",
            "hello",
            "hello1",
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = accountMetadataTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as AccountMetadataTransaction;

        expect(transaction.targetPublicKey.publicKey).to.be.equal(account.publicAccount.publicKey);
        deepStrictEqual(transaction.scopedMetadataKey, KeyGenerator.generateUInt64Key("name"));
        expect(accountMetadataTransaction.value).to.be.equal("hello");
        expect(accountMetadataTransaction.oldValue).to.be.equal("hello1");
        expect(transaction.valueSize).to.be.equal(6);
        expect(transaction.valueSizeDelta).to.be.equal(-1);
        deepStrictEqual(transaction.valueDifferences, new Uint8Array([0, 0, 0, 0, 0, 49]));
    })
    it('should create MosaicMetadataTransaction', () => {
        const mosaicId = MosaicId.createFromNonce(MosaicNonce.createFromNumber(1), account.publicAccount);
        const mosaicMetadataTransaction = MosaicMetadataTransaction.create(
            Deadline.create(),
            account.publicAccount,
            mosaicId,
            "name",
            "hello1",
            "hello",
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = mosaicMetadataTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as MosaicMetadataTransaction;

        expect(transaction.targetPublicKey.publicKey).to.be.equal(account.publicAccount.publicKey);
        deepStrictEqual(transaction.scopedMetadataKey, KeyGenerator.generateUInt64Key("name"));
        expect(transaction.targetMosaicId.toHex()).to.be.equal(mosaicId.toHex());
        expect(mosaicMetadataTransaction.value).to.be.equal("hello1");
        expect(mosaicMetadataTransaction.oldValue).to.be.equal("hello");
        expect(transaction.valueSize).to.be.equal(6);
        expect(transaction.valueSizeDelta).to.be.equal(1);
        deepStrictEqual(transaction.valueDifferences, new Uint8Array([0, 0, 0, 0, 0, 49]));
    })
    it('should create NamespaceMetadataTransaction', () => {
        const namespaceId = new NamespaceId("testing");
        const namespaceMetadataTransaction = NamespaceMetadataTransaction.create(
            Deadline.create(),
            account.publicAccount,
            namespaceId,
            "name",
            "hello1",
            "hello",
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = namespaceMetadataTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as NamespaceMetadataTransaction;

        expect(transaction.targetPublicKey.publicKey).to.be.equal(account.publicAccount.publicKey);
        deepStrictEqual(transaction.scopedMetadataKey, KeyGenerator.generateUInt64Key("name"));
        expect(transaction.targetNamespaceId.toHex()).to.be.equal(namespaceId.toHex());
        expect(namespaceMetadataTransaction.value).to.be.equal("hello1");
        expect(namespaceMetadataTransaction.oldValue).to.be.equal("hello");
        expect(transaction.valueSize).to.be.equal(6);
        expect(transaction.valueSizeDelta).to.be.equal(1);
        deepStrictEqual(transaction.valueDifferences, new Uint8Array([0, 0, 0, 0, 0, 49]));
    })
    
    it('should create ChainConfigTransaction transaction', () => {
        const chainConfigureTransaction = ChainConfigTransaction.create(
            Deadline.create(),
            UInt64.fromHex('0123456789ABCDEF'),
            "some network config",
            "some supported entity versions",
            NetworkType.MIJIN_TEST
        );

        const signedTransaction = chainConfigureTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as ChainConfigTransaction;

        expect(transaction.applyHeightDelta.toHex()).to.be.equal('0123456789ABCDEF');
        expect(transaction.networkConfig).to.be.equal("some network config");
        expect(transaction.supportedEntityVersions).to.be.equal("some supported entity versions");
    })
    it('should create ChainUpgradeTransaction', () => {
        const chainUpgradeTransaction = ChainUpgradeTransaction.create(
            Deadline.create(),
            UInt64.fromHex('0123456789ABCDEF'),
            UInt64.fromHex('FEDCBA9876543210'),
            NetworkType.MIJIN_TEST
        );

        const signedTransaction = chainUpgradeTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as ChainUpgradeTransaction;

        expect(transaction.upgradePeriod.toHex()).to.be.equal('0123456789ABCDEF');
        expect(transaction.newBlockchainVersion.toHex()).to.be.equal('FEDCBA9876543210');
    })

    it('should create AddExchangeOfferTransaction', () => {
        const addExchangeOfferTransaction = AddExchangeOfferTransaction.create(
            Deadline.create(),
            [
                new AddExchangeOffer(
                    new MosaicId('1234567890ABCDEF'),
                    UInt64.fromUint(12345678),
                    UInt64.fromUint(23456789),
                    ExchangeOfferType.SELL_OFFER,
                    UInt64.fromUint(34567890)
                ),
                new AddExchangeOffer(
                    new MosaicId('1234567890ABCDFF'),
                    UInt64.fromUint(12345678),
                    UInt64.fromUint(23456789),
                    ExchangeOfferType.SELL_OFFER,
                    UInt64.fromUint(34567890)
                )
            ],
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = addExchangeOfferTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as AddExchangeOfferTransaction;

        expect(transaction.type).to.be.equal(TransactionType.ADD_EXCHANGE_OFFER);
        expect(transaction.offers.length).to.be.equal(2);
        expect(transaction.offers[0].mosaicId.toHex().toUpperCase()).to.be.equal('1234567890ABCDEF');
        expect(transaction.offers[0].mosaicAmount.compact()).to.be.equal(12345678);
        expect(transaction.offers[0].cost.compact()).to.be.equal(23456789);
        expect(transaction.offers[0].type).to.be.equal(ExchangeOfferType.SELL_OFFER);
        expect(transaction.offers[0].duration.compact()).to.be.equal(34567890);
        expect(transaction.offers[1].mosaicId.toHex().toUpperCase()).to.be.equal('1234567890ABCDFF');
        expect(transaction.offers[1].mosaicAmount.compact()).to.be.equal(12345678);
        expect(transaction.offers[1].cost.compact()).to.be.equal(23456789);
        expect(transaction.offers[1].type).to.be.equal(ExchangeOfferType.SELL_OFFER);
        expect(transaction.offers[1].duration.compact()).to.be.equal(34567890);
    })

    it('should create ExchangeOfferTransaction', () => {
        const exchangeOfferTransaction = ExchangeOfferTransaction.create(
            Deadline.create(),
            [
                new ExchangeOffer(
                    new MosaicId('1234567890ABCDEF'),
                    UInt64.fromUint(12345678),
                    UInt64.fromUint(23456789),
                    ExchangeOfferType.SELL_OFFER,
                    PublicAccount.createFromPublicKey('6'.repeat(64), NetworkType.MIJIN_TEST)
                ),
                new ExchangeOffer(
                    new MosaicId('1234567890ABCDFF'),
                    UInt64.fromUint(12345678),
                    UInt64.fromUint(23456789),
                    ExchangeOfferType.SELL_OFFER,
                    PublicAccount.createFromPublicKey('9'.repeat(64), NetworkType.MIJIN_TEST)
                )
            ],
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = exchangeOfferTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as ExchangeOfferTransaction;

        expect(transaction.type).to.be.equal(TransactionType.EXCHANGE_OFFER);
        expect(transaction.offers.length).to.be.equal(2);
        expect(transaction.offers[0].mosaicId.toHex().toUpperCase()).to.be.equal('1234567890ABCDEF');
        expect(transaction.offers[0].mosaicAmount.compact()).to.be.equal(12345678);
        expect(transaction.offers[0].cost.compact()).to.be.equal(23456789);
        expect(transaction.offers[0].type).to.be.equal(ExchangeOfferType.SELL_OFFER);
        expect(transaction.offers[0].owner.publicKey).to.be.equal('6'.repeat(64));
        expect(transaction.offers[1].mosaicId.toHex().toUpperCase()).to.be.equal('1234567890ABCDFF');
        expect(transaction.offers[1].mosaicAmount.compact()).to.be.equal(12345678);
        expect(transaction.offers[1].cost.compact()).to.be.equal(23456789);
        expect(transaction.offers[1].type).to.be.equal(ExchangeOfferType.SELL_OFFER);
        expect(transaction.offers[1].owner.publicKey).to.be.equal('9'.repeat(64));
    });

    it('should create RemoveExchangeOfferTransaction', () => {
        const removeExchangeOfferTransaction = RemoveExchangeOfferTransaction.create(
            Deadline.create(),
            [
                new RemoveExchangeOffer(
                    new MosaicId('1234567890ABCDEF'),
                    ExchangeOfferType.SELL_OFFER,
                ),
                new RemoveExchangeOffer(
                    new MosaicId('1234567890ABCDFF'),
                    ExchangeOfferType.SELL_OFFER,
                )
            ],
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = removeExchangeOfferTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as RemoveExchangeOfferTransaction;

        expect(transaction.type).to.be.equal(TransactionType.REMOVE_EXCHANGE_OFFER);
        expect(transaction.offers.length).to.be.equal(2);
        expect(transaction.offers[0].mosaicId.toHex().toUpperCase()).to.be.equal('1234567890ABCDEF');
        expect(transaction.offers[0].offerType).to.be.equal(ExchangeOfferType.SELL_OFFER);
        expect(transaction.offers[1].mosaicId.toHex().toUpperCase()).to.be.equal('1234567890ABCDFF');
        expect(transaction.offers[1].offerType).to.be.equal(ExchangeOfferType.SELL_OFFER);
    })
});

describe('TransactionMapping - createFromDTO (Transaction.toJSON() feed)', () => {
    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = TestingAccount;
    });

    it('should create TransferTransaction - Address', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            [
                NetworkCurrencyMosaic.createRelative(100),
            ],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        const transaction = TransactionMapping.createFromDTO(transferTransaction.toJSON()) as TransferTransaction;

        expect((transaction.recipient as Address).plain()).to.be.equal('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        expect(transaction.message.payload).to.be.equal('test-message');
    });

    it('should create TransferTransaction - NamespaceId', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            new NamespaceId([33347626, 3779697293]),
            [
                NetworkCurrencyMosaic.createRelative(100),
            ],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        const transaction = TransactionMapping.createFromDTO(transferTransaction.toJSON()) as TransferTransaction;
        expect((transaction.recipient as NamespaceId).id.toHex().toUpperCase()).to.be.equal(new UInt64([33347626, 3779697293]).toHex());
        expect(transaction.message.payload).to.be.equal('test-message');
    });

    it('should create TransferTransaction - Encrypted Message', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            [
                NetworkCurrencyMosaic.createRelative(100),
            ],
            new EncryptedMessage('12324556'),
            NetworkType.MIJIN_TEST,
        );

        const transaction = TransactionMapping.createFromDTO(transferTransaction.toJSON()) as TransferTransaction;

        expect((transaction.recipient as Address).plain()).to.be.equal('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        expect(transaction.message.type).to.be.equal(MessageType.EncryptedMessage);
    });

    it('should create AccountLinkTransaction', () => {
        const accountLinkTransaction = AccountLinkTransaction.create(
            Deadline.create(),
            account.publicKey,
            LinkAction.Link,
            NetworkType.MIJIN_TEST,
        );

        const transaction = TransactionMapping.createFromDTO(accountLinkTransaction.toJSON()) as AccountLinkTransaction;

        expect(transaction.remoteAccountKey).to.be.equal(account.publicKey);
        expect(transaction.linkAction).to.be.equal(LinkAction.Link);
    });

    it('should create AccountRestrictionAddressTransaction', () => {
        const address = Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressRestrictionFilter = AccountRestrictionModification.createForAddress(
            RestrictionModificationType.Add,
            address,
        );
        const addressRestrictionTransaction = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
            Deadline.create(),
            RestrictionType.AllowAddress,
            [addressRestrictionFilter],
            NetworkType.MIJIN_TEST,
        );

        let data = addressRestrictionTransaction.toJSON();

        for(let i =0; i < data.transaction.modifications.length; ++i){
            let value = data.transaction.modifications[i].value;
            data.transaction.modifications[i].value = convert.uint8ToHex(Base32.Base32Decode(value));
        }

        const transaction =
            TransactionMapping.createFromDTO(data) as AccountAddressRestrictionModificationTransaction;

        expect(transaction.modifications[0].value).to.be.equal('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        expect(transaction.restrictionType).to.be.equal(RestrictionType.AllowAddress);
        expect(transaction.modifications[0].modificationType).to.be.equal(RestrictionModificationType.Add);
    });

    it('should create AccountRestrictionMosaicTransaction', () => {
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicRestrictionFilter = AccountRestrictionModification.createForMosaic(
            RestrictionModificationType.Add,
            mosaicId,
        );
        const mosaicRestrictionTransaction = AccountRestrictionTransaction.createMosaicRestrictionModificationTransaction(
            Deadline.create(),
            RestrictionType.AllowMosaic,
            [mosaicRestrictionFilter],
            NetworkType.MIJIN_TEST,
        );

        const transaction =
            TransactionMapping.createFromDTO(mosaicRestrictionTransaction.toJSON()) as AccountMosaicRestrictionModificationTransaction;

        expect(transaction.type).to.be.equal(TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC);
        expect(transaction.restrictionType).to.be.equal(RestrictionType.AllowMosaic);
        expect(transaction.modifications.length).to.be.equal(1);
    });

    it('should create AccountRestrictionMosaicTransaction', () => {
        const operation = TransactionType.ADDRESS_ALIAS;
        const operationRestrictionFilter = AccountRestrictionModification.createForOperation(
            RestrictionModificationType.Add,
            operation,
        );
        const operationRestrictionTransaction = AccountRestrictionTransaction.createOperationRestrictionModificationTransaction(
            Deadline.create(),
            RestrictionType.AllowTransaction,
            [operationRestrictionFilter],
            NetworkType.MIJIN_TEST,
        );

        const transaction =
            TransactionMapping.createFromDTO(operationRestrictionTransaction.toJSON()) as AccountMosaicRestrictionModificationTransaction;

        expect(transaction.type).to.be.equal(TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION);
        expect(transaction.restrictionType).to.be.equal(RestrictionType.AllowTransaction);
        expect(transaction.modifications.length).to.be.equal(1);
    });

    it('should create AddressAliasTransaction', () => {
        const namespaceId = new NamespaceId([33347626, 3779697293]);
        const address = Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressAliasTransaction = AddressAliasTransaction.create(
            Deadline.create(),
            AliasActionType.Link,
            namespaceId,
            address,
            NetworkType.MIJIN_TEST,
        );

        const transaction =
            TransactionMapping.createFromDTO(addressAliasTransaction.toJSON()) as AddressAliasTransaction;

        expect(transaction.type).to.be.equal(TransactionType.ADDRESS_ALIAS);
        expect(transaction.actionType).to.be.equal(AliasActionType.Link);
    });

    it('should create MosaicAliasTransaction', () => {
        const namespaceId = new NamespaceId([33347626, 3779697293]);
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicAliasTransaction = MosaicAliasTransaction.create(
            Deadline.create(),
            AliasActionType.Link,
            namespaceId,
            mosaicId,
            NetworkType.MIJIN_TEST,
        );
        const transaction =
            TransactionMapping.createFromDTO(mosaicAliasTransaction.toJSON()) as MosaicAliasTransaction;

        expect(transaction.type).to.be.equal(TransactionType.MOSAIC_ALIAS);
        expect(transaction.actionType).to.be.equal(AliasActionType.Link);

    });

    it('should create MosaicDefinitionTransaction', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
            Deadline.create(),
            new MosaicNonce(new Uint8Array([0xE6, 0xDE, 0x84, 0xB8])), // nonce
            new MosaicId(UInt64.fromUint(1).toDTO()), // ID
            MosaicProperties.create({
                supplyMutable: false,
                transferable: false,
                divisibility: 3,
                duration: UInt64.fromUint(1000),
            }),
            NetworkType.MIJIN_TEST,
        );

        const transaction =
            TransactionMapping.createFromDTO(mosaicDefinitionTransaction.toJSON()) as MosaicDefinitionTransaction;

        expect(transaction.type).to.be.equal(TransactionType.MOSAIC_DEFINITION);
        expect(transaction.mosaicProperties.supplyMutable).to.be.equal(false);
        expect(transaction.mosaicProperties.transferable).to.be.equal(false);
        expect(transaction.mosaicProperties.divisibility).to.be.equal(3);

    });

    it('should create MosaicSupplyChangeTransaction', () => {
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
            Deadline.create(),
            mosaicId,
            MosaicSupplyType.Increase,
            UInt64.fromUint(10),
            NetworkType.MIJIN_TEST,
        );

        const transaction =
            TransactionMapping.createFromDTO(mosaicSupplyChangeTransaction.toJSON()) as MosaicSupplyChangeTransaction;

        expect(transaction.type).to.be.equal(TransactionType.MOSAIC_SUPPLY_CHANGE);
        expect(transaction.direction).to.be.equal(MosaicSupplyType.Increase);

    });

    it('should create SecretLockTransaction', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const recipient = Address.createFromRawAddress('SDBDG4IT43MPCW2W4CBBCSJJT42AYALQN7A4VVWL');
        const secretLockTransaction = SecretLockTransaction.create(
            Deadline.create(),
            NetworkCurrencyMosaic.createAbsolute(10),
            UInt64.fromUint(100),
            HashType.Op_Sha3_256,
            sha3_256.create().update(convert.hexToUint8(proof)).hex(),
            recipient,
            NetworkType.MIJIN_TEST,
        );

        const transaction =
            TransactionMapping.createFromDTO(secretLockTransaction.toJSON()) as SecretLockTransaction;

        expect(transaction.type).to.be.equal(TransactionType.SECRET_LOCK);
        expect(transaction.hashType).to.be.equal(HashType.Op_Sha3_256);

    });

    it('should create SecretProofTransaction', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const secretProofTransaction = SecretProofTransaction.create(
            Deadline.create(),
            HashType.Op_Sha3_256,
            sha3_256.create().update(convert.hexToUint8(proof)).hex(),
            account.address,
            proof,
            NetworkType.MIJIN_TEST,
        );

        let data = secretProofTransaction.toDTO();

        const transaction =
            TransactionMapping.createFromDTO(data) as SecretProofTransaction;

        expect(transaction.type).to.be.equal(TransactionType.SECRET_PROOF);
        expect(transaction.hashType).to.be.equal(HashType.Op_Sha3_256);
        expect(transaction.secret).to.be.equal(sha3_256.create().update(convert.hexToUint8(proof)).hex());
        deepEqual(transaction.recipient, account.address);
        expect(transaction.proof).to.be.equal(proof);

    });

    it('should create ModifyMultiSigTransaction', () => {
        const modifyMultisigAccountTransaction = ModifyMultisigAccountTransaction.create(
            Deadline.create(),
            2,
            1,
            [new MultisigCosignatoryModification(
                MultisigCosignatoryModificationType.Add,
                PublicAccount.createFromPublicKey('B0F93CBEE49EEB9953C6F3985B15A4F238E205584D8F924C621CBE4D7AC6EC24',
                    NetworkType.MIJIN_TEST),
            )],
            NetworkType.MIJIN_TEST,
        );

        const transaction =
            TransactionMapping.createFromDTO(modifyMultisigAccountTransaction.toJSON()) as ModifyMultisigAccountTransaction;

        expect(transaction.type).to.be.equal(TransactionType.MODIFY_MULTISIG_ACCOUNT);
        expect(transaction.minApprovalDelta).to.be.equal(2);
        expect(transaction.minRemovalDelta).to.be.equal(1);
    });

    it('should create AggregatedTransaction - Complete', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            [],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [transferTransaction.toAggregate(account.publicAccount)],
            NetworkType.MIJIN_TEST,
            []);

        const transaction =
            TransactionMapping.createFromDTO(aggregateTransaction.toJSON()) as AggregateTransaction;

        expect(transaction.type).to.be.equal(TransactionType.AGGREGATE_COMPLETE);
        expect(transaction.innerTransactions.length).to.be.equal(1);
    });

    it('should create AggregatedTransaction - Bonded', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            [],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        const aggregateTransaction = AggregateTransaction.createBonded(
            Deadline.create(),
            [transferTransaction.toAggregate(account.publicAccount)],
            NetworkType.MIJIN_TEST,
            []);

        const transaction =
            TransactionMapping.createFromDTO(aggregateTransaction.toJSON()) as AggregateTransaction;

        expect(transaction.type).to.be.equal(TransactionType.AGGREGATE_BONDED);
        expect(transaction.innerTransactions.length).to.be.equal(1);
    });

    it('should create LockFundTransaction', () => {
        const aggregateTransaction = AggregateTransaction.createBonded(
            Deadline.create(),
            [],
            NetworkType.MIJIN_TEST,
            [],
        );
        const signedTransaction = account.sign(aggregateTransaction, generationHash);
        const lockTransaction = LockFundsTransaction.create(Deadline.create(),
            NetworkCurrencyMosaic.createRelative(10),
            UInt64.fromUint(10),
            signedTransaction,
            NetworkType.MIJIN_TEST);

        const transaction =
            TransactionMapping.createFromDTO(lockTransaction.toJSON()) as LockFundsTransaction;

        expect(transaction.type).to.be.equal(TransactionType.LOCK);
        expect(transaction.hash).to.be.equal(signedTransaction.hash);
    });

    it('should create RegisterNamespaceTransaction - Root', () => {
        const registerNamespaceTransaction = RegisterNamespaceTransaction.createRootNamespace(
            Deadline.create(),
            'root-test-namespace',
            UInt64.fromUint(1000),
            NetworkType.MIJIN_TEST,
        );

        const transaction =
            TransactionMapping.createFromDTO(registerNamespaceTransaction.toJSON()) as RegisterNamespaceTransaction;

        expect(transaction.type).to.be.equal(TransactionType.REGISTER_NAMESPACE);

    });

    it('should create RegisterNamespaceTransaction - Sub', () => {
        const registerNamespaceTransaction = RegisterNamespaceTransaction.createSubNamespace(
            Deadline.create(),
            'root-test-namespace',
            'parent-test-namespace',
            NetworkType.MIJIN_TEST,
        );

        const transaction =
            TransactionMapping.createFromDTO(registerNamespaceTransaction.toJSON()) as RegisterNamespaceTransaction;

        expect(transaction.type).to.be.equal(TransactionType.REGISTER_NAMESPACE);
    });

    it('should create AddExchangeOfferTransaction', () => {
        const addExchangeOfferTransaction = AddExchangeOfferTransaction.create(
            Deadline.create(),
            [
                new AddExchangeOffer(
                    new MosaicId('1234567890ABCDEF'),
                    UInt64.fromUint(12345678),
                    UInt64.fromUint(23456789),
                    ExchangeOfferType.SELL_OFFER,
                    UInt64.fromUint(34567890)
                ),
                new AddExchangeOffer(
                    new MosaicId('1234567890ABCDFF'),
                    UInt64.fromUint(12345678),
                    UInt64.fromUint(23456789),
                    ExchangeOfferType.SELL_OFFER,
                    UInt64.fromUint(34567890)
                )
            ],
            NetworkType.MIJIN_TEST,
        );

        const transaction =
            TransactionMapping.createFromDTO(addExchangeOfferTransaction.toJSON()) as AddExchangeOfferTransaction;

        expect(transaction.type).to.be.equal(TransactionType.ADD_EXCHANGE_OFFER);
        expect(transaction.offers.length).to.be.equal(2);
        expect(transaction.offers[0].mosaicId.toHex().toUpperCase()).to.be.equal('1234567890ABCDEF');
        expect(transaction.offers[0].mosaicAmount.compact()).to.be.equal(12345678);
        expect(transaction.offers[0].cost.compact()).to.be.equal(23456789);
        expect(transaction.offers[0].type).to.be.equal(ExchangeOfferType.SELL_OFFER);
        expect(transaction.offers[0].duration.compact()).to.be.equal(34567890);
        expect(transaction.offers[1].mosaicId.toHex().toUpperCase()).to.be.equal('1234567890ABCDFF');
        expect(transaction.offers[1].mosaicAmount.compact()).to.be.equal(12345678);
        expect(transaction.offers[1].cost.compact()).to.be.equal(23456789);
        expect(transaction.offers[1].type).to.be.equal(ExchangeOfferType.SELL_OFFER);
        expect(transaction.offers[1].duration.compact()).to.be.equal(34567890);
    });

    it('should create ExchangeOfferTransaction', () => {
        const exchangeOfferTransaction = ExchangeOfferTransaction.create(
            Deadline.create(),
            [
                new ExchangeOffer(
                    new MosaicId('1234567890ABCDEF'),
                    UInt64.fromUint(12345678),
                    UInt64.fromUint(23456789),
                    ExchangeOfferType.SELL_OFFER,
                    PublicAccount.createFromPublicKey('6'.repeat(64), NetworkType.MIJIN_TEST)
                ),
                new ExchangeOffer(
                    new MosaicId('1234567890ABCDFF'),
                    UInt64.fromUint(12345678),
                    UInt64.fromUint(23456789),
                    ExchangeOfferType.SELL_OFFER,
                    PublicAccount.createFromPublicKey('9'.repeat(64), NetworkType.MIJIN_TEST)
                )
            ],
            NetworkType.MIJIN_TEST,
        );

        const transaction =
            TransactionMapping.createFromDTO(exchangeOfferTransaction.toJSON()) as ExchangeOfferTransaction;

        expect(transaction.type).to.be.equal(TransactionType.EXCHANGE_OFFER);
        expect(transaction.offers.length).to.be.equal(2);
        expect(transaction.offers[0].mosaicId.toHex().toUpperCase()).to.be.equal('1234567890ABCDEF');
        expect(transaction.offers[0].mosaicAmount.compact()).to.be.equal(12345678);
        expect(transaction.offers[0].cost.compact()).to.be.equal(23456789);
        expect(transaction.offers[0].type).to.be.equal(ExchangeOfferType.SELL_OFFER);
        expect(transaction.offers[0].owner.publicKey).to.be.equal('6'.repeat(64));
        expect(transaction.offers[1].mosaicId.toHex().toUpperCase()).to.be.equal('1234567890ABCDFF');
        expect(transaction.offers[1].mosaicAmount.compact()).to.be.equal(12345678);
        expect(transaction.offers[1].cost.compact()).to.be.equal(23456789);
        expect(transaction.offers[1].type).to.be.equal(ExchangeOfferType.SELL_OFFER);
        expect(transaction.offers[1].owner.publicKey).to.be.equal('9'.repeat(64));
    });

    it('should create RemoveExchangeOfferTransaction', () => {
        const removeExchangeOfferTransaction = RemoveExchangeOfferTransaction.create(
            Deadline.create(),
            [
                new RemoveExchangeOffer(
                    new MosaicId('1234567890ABCDEF'),
                    ExchangeOfferType.SELL_OFFER,
                ),
                new RemoveExchangeOffer(
                    new MosaicId('1234567890ABCDFF'),
                    ExchangeOfferType.SELL_OFFER,
                )
            ],
            NetworkType.MIJIN_TEST,
        );

        const transaction =
            TransactionMapping.createFromDTO(removeExchangeOfferTransaction.toJSON()) as RemoveExchangeOfferTransaction;

        expect(transaction.type).to.be.equal(TransactionType.REMOVE_EXCHANGE_OFFER);
        expect(transaction.offers.length).to.be.equal(2);
        expect(transaction.offers[0].mosaicId.toHex().toUpperCase()).to.be.equal('1234567890ABCDEF');
        expect(transaction.offers[0].offerType).to.be.equal(ExchangeOfferType.SELL_OFFER);
        expect(transaction.offers[1].mosaicId.toHex().toUpperCase()).to.be.equal('1234567890ABCDFF');
        expect(transaction.offers[1].offerType).to.be.equal(ExchangeOfferType.SELL_OFFER);
    });

});
