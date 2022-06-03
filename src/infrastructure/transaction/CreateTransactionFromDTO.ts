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
import {Convert as convert} from '../../core/format';
import {RawUInt64 as UInt64Library} from '../../core/format';
import {Address} from '../../model/account/Address';
import {PublicAccount} from '../../model/account/PublicAccount';
import {NetworkType} from '../../model/blockchain/NetworkType';
import {Id} from '../../model/Id';
import {Mosaic} from '../../model/mosaic/Mosaic';
import {MosaicId} from '../../model/mosaic/MosaicId';
import {MosaicProperties} from '../../model/mosaic/MosaicProperties';
import { MosaicPropertyType } from '../../model/mosaic/MosaicPropertyType';
import {NamespaceId} from '../../model/namespace/NamespaceId';
import { AccountLinkTransaction } from '../../model/transaction/AccountLinkTransaction';
import {AccountRestrictionModification} from '../../model/transaction/AccountRestrictionModification';
import {AddressAliasTransaction} from '../../model/transaction/AddressAliasTransaction';
import {AggregateTransaction} from '../../model/transaction/AggregateTransaction';
import {AggregateTransactionCosignature} from '../../model/transaction/AggregateTransactionCosignature';
import {AggregateTransactionInfo} from '../../model/transaction/AggregateTransactionInfo';
import {ChainConfigTransaction} from '../../model/transaction/ChainConfigTransaction';
import {ChainUpgradeTransaction} from '../../model/transaction/ChainUpgradeTransaction';
import {Deadline} from '../../model/transaction/Deadline';
import { MessageType } from '../../model/transaction/MessageType';
import { EncryptedMessage } from '../../model/transaction/EncryptedMessage';
import { HexadecimalMessage } from '../../model/transaction/HexadecimalMessage';
import {LockFundsTransaction} from '../../model/transaction/LockFundsTransaction';
import {AccountAddressRestrictionModificationTransaction} from '../../model/transaction/AccountAddressRestrictionModificationTransaction';
import {AccountOperationRestrictionModificationTransaction} from '../../model/transaction/AccountOperationRestrictionModificationTransaction';
import {AccountMosaicRestrictionModificationTransaction} from '../../model/transaction/AccountMosaicRestrictionModificationTransaction';
import {ModifyMultisigAccountTransaction} from '../../model/transaction/ModifyMultisigAccountTransaction';
import {MosaicAliasTransaction} from '../../model/transaction/MosaicAliasTransaction';
import {MosaicDefinitionTransaction} from '../../model/transaction/MosaicDefinitionTransaction';
import {MosaicSupplyChangeTransaction} from '../../model/transaction/MosaicSupplyChangeTransaction';
import {MultisigCosignatoryModification} from '../../model/transaction/MultisigCosignatoryModification';
import {EmptyMessage, PlainMessage} from '../../model/transaction/PlainMessage';
import {RegisterNamespaceTransaction} from '../../model/transaction/RegisterNamespaceTransaction';
import {SecretLockTransaction} from '../../model/transaction/SecretLockTransaction';
import {SecretProofTransaction} from '../../model/transaction/SecretProofTransaction';
import {TransactionHash} from '../../model/transaction/TransactionHash';
import {Transaction} from '../../model/transaction/Transaction';
import {InnerTransaction} from '../../model/transaction/InnerTransaction';
import {TransactionInfo} from '../../model/transaction/TransactionInfo';
import {TransactionType} from '../../model/transaction/TransactionType';
import {TransferTransaction} from '../../model/transaction/TransferTransaction';
import {UInt64} from '../../model/UInt64';
import { ModifyMetadataTransaction, MetadataModification } from '../../model/transaction/ModifyMetadataTransaction';
import { MetadataType as oldMetadataType } from '../../model/metadata/oldMetadataType';
import { AddExchangeOfferTransaction } from '../../model/transaction/AddExchangeOfferTransaction';
import { AddExchangeOffer } from '../../model/transaction/AddExchangeOffer';
import { ExchangeOfferTransaction } from '../../model/transaction/ExchangeOfferTransaction';
import { ExchangeOffer } from '../../model/transaction/ExchangeOffer';
import { RemoveExchangeOfferTransaction } from '../../model/transaction/RemoveExchangeOfferTransaction';
import { RemoveExchangeOffer } from '../../model/transaction/RemoveExchangeOffer';
import { AccountMetadataTransaction } from '../../model/transaction/AccountMetadataTransaction';
import { MosaicMetadataTransaction } from '../../model/transaction/MosaicMetadataTransaction';
import { NamespaceMetadataTransaction } from '../../model/transaction/NamespaceMetadataTransaction';
import { MosaicModifyLevyTransaction } from '../../model/transaction/MosaicModifyLevyTransaction';
import { MosaicRemoveLevyTransaction } from '../../model/transaction/MosaicRemoveLevyTransaction';
import { MosaicNonce } from '../../model/mosaic/MosaicNonce';
import { MosaicLevy } from '../../model/mosaic/MosaicLevy';

/**
 * @internal
 * @param transactionDTO
 * @returns {Transaction}
 * @constructor
 */
export const CreateTransactionFromDTO = (transactionDTO): Transaction | InnerTransaction => {
    if (transactionDTO.transaction.type === TransactionType.AGGREGATE_COMPLETE ||
        transactionDTO.transaction.type === TransactionType.AGGREGATE_BONDED) {
        const innerTransactions = transactionDTO.transaction.transactions === undefined ? [] : transactionDTO.transaction.transactions.map((innerTransactionDTO) => {
            const aggregateTransactionInfo = innerTransactionDTO.meta ? new AggregateTransactionInfo(
                new UInt64(innerTransactionDTO.meta.height),
                innerTransactionDTO.meta.index,
                innerTransactionDTO.meta.id,
                innerTransactionDTO.meta.aggregateHash,
                innerTransactionDTO.meta.aggregateId,
                innerTransactionDTO.meta.uniqueAggregateHash
            ) : undefined;
            innerTransactionDTO.transaction.maxFee = transactionDTO.transaction.maxFee;
            innerTransactionDTO.transaction.deadline = transactionDTO.transaction.deadline;
            innerTransactionDTO.transaction.signature = transactionDTO.transaction.signature;
            return CreateStandaloneTransactionFromDTO(innerTransactionDTO.transaction, aggregateTransactionInfo);
        });
        return new AggregateTransaction(
            extractNetworkType(transactionDTO.transaction.version),
            transactionDTO.transaction.type,
            extractTransactionVersion(transactionDTO.transaction.version),
            Deadline.createFromDTO(transactionDTO.transaction.deadline),
            new UInt64(transactionDTO.transaction.maxFee || [0, 0]),
            innerTransactions,
            transactionDTO.transaction.cosignatures ? transactionDTO.transaction.cosignatures
                .map((aggregateCosignatureDTO) => {
                    return new AggregateTransactionCosignature(
                        aggregateCosignatureDTO.signature,
                        PublicAccount.createFromPublicKey(aggregateCosignatureDTO.signer,
                            extractNetworkType(transactionDTO.transaction.version)));
                }) : [],
            transactionDTO.transaction.signature,
            transactionDTO.transaction.signer ? PublicAccount.createFromPublicKey(transactionDTO.transaction.signer,
                            extractNetworkType(transactionDTO.transaction.version)) : undefined,
            transactionDTO.meta ? new TransactionInfo(
                new UInt64(transactionDTO.meta.height),
                transactionDTO.meta.index,
                transactionDTO.meta.id,
                transactionDTO.meta.hash,
                transactionDTO.meta.merkleComponentHash,
            ) : undefined,
        );
    } else if(transactionDTO.meta && transactionDTO.meta.aggregateHash){
        const aggregateTransactionInfo = new AggregateTransactionInfo(
            new UInt64(transactionDTO.meta.height),
            transactionDTO.meta.index,
            transactionDTO.meta.id,
            transactionDTO.meta.aggregateHash,
            transactionDTO.meta.aggregateId,
            transactionDTO.meta.uniqueAggregateHash
        );
        return CreateStandaloneTransactionFromDTO(transactionDTO.transaction, aggregateTransactionInfo, true);
    } else {
        const transactionInfo = transactionDTO.meta ? new TransactionInfo(
            new UInt64(transactionDTO.meta.height),
            transactionDTO.meta.index,
            transactionDTO.meta.id,
            transactionDTO.meta.hash,
            transactionDTO.meta.merkleComponentHash,
        ) : undefined;
        return CreateStandaloneTransactionFromDTO(transactionDTO.transaction, transactionInfo);
    }
};

/**
 * @internal
 * @param transactionDTO
 * @param transactionInfo
 * @returns {any}
 * @constructor
 */
const CreateStandaloneTransactionFromDTO = (transactionDTO, transactionInfo, isEmbedded: boolean = false): Transaction | InnerTransaction => {

    if (transactionDTO.type === TransactionType.TRANSFER) {

        let message: PlainMessage | EncryptedMessage | HexadecimalMessage;
        if (transactionDTO.message && transactionDTO.message.type === MessageType.PlainMessage) {
            message = PlainMessage.createFromPayload(transactionDTO.message.payload);
        } else if (transactionDTO.message && transactionDTO.message.type === MessageType.EncryptedMessage) {
            message = EncryptedMessage.createFromPayload(transactionDTO.message.payload);
        } else if (transactionDTO.message && transactionDTO.message.type === MessageType.HexadecimalMessage) {
            message = HexadecimalMessage.createFromPayload(transactionDTO.message.payload);
        } else {
            message = EmptyMessage;
        }

        const transferTxn = new TransferTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            isEmbedded ? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
            isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
            extractRecipient(transactionDTO.recipient),
            extractMosaics(transactionDTO.mosaics),
            message,
            isEmbedded ? undefined : transactionDTO.signature,
            transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                    extractNetworkType(transactionDTO.version)) : undefined,
            transactionInfo,
        );

        return isEmbedded ? transferTxn.toAggregate(transferTxn.signer!) : transferTxn;
    } else if (transactionDTO.type === TransactionType.REGISTER_NAMESPACE) {
        const registerNamespaceTxn = new RegisterNamespaceTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            isEmbedded ? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
            isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
            transactionDTO.namespaceType,
            transactionDTO.name,
            new NamespaceId(transactionDTO.namespaceId),
            transactionDTO.namespaceType === 0 ? new UInt64(transactionDTO.duration) : undefined,
            transactionDTO.namespaceType === 1 ? new NamespaceId(transactionDTO.parentId) : undefined,
            isEmbedded ? undefined : transactionDTO.signature,
            transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                            extractNetworkType(transactionDTO.version)) : undefined,
            transactionInfo,
        );
        return isEmbedded ? registerNamespaceTxn.toAggregate(registerNamespaceTxn.signer!) : registerNamespaceTxn;
    } else if (transactionDTO.type === TransactionType.MOSAIC_DEFINITION) {
        const mosaicDefinitionTxn = new MosaicDefinitionTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            isEmbedded ? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
            isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
            MosaicNonce.createFromNumber(transactionDTO.mosaicNonce),
            new MosaicId(transactionDTO.mosaicId),
            new MosaicProperties(
                new UInt64(transactionDTO.properties[MosaicPropertyType.MosaicFlags].value),
                (new UInt64(transactionDTO.properties[MosaicPropertyType.Divisibility].value)).compact(),
                transactionDTO.properties.length === 3 &&  transactionDTO.properties[MosaicPropertyType.Duration].value ?
                    new UInt64(transactionDTO.properties[MosaicPropertyType.Duration].value) : undefined,
            ),
            isEmbedded ? undefined : transactionDTO.signature,
            transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                            extractNetworkType(transactionDTO.version)) : undefined,
            transactionInfo,
        );
        return isEmbedded ? mosaicDefinitionTxn.toAggregate(mosaicDefinitionTxn.signer!) : mosaicDefinitionTxn;
    } else if (transactionDTO.type === TransactionType.MOSAIC_SUPPLY_CHANGE) {
        const mosaicSupplyChangeTxn = new MosaicSupplyChangeTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
            isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
            new MosaicId(transactionDTO.mosaicId),
            transactionDTO.direction,
            new UInt64(transactionDTO.delta),
            isEmbedded ? undefined : transactionDTO.signature,
            transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                            extractNetworkType(transactionDTO.version)) : undefined,
            transactionInfo,
        );
        return isEmbedded ? mosaicSupplyChangeTxn.toAggregate(mosaicSupplyChangeTxn.signer!) : mosaicSupplyChangeTxn;
    } else if (transactionDTO.type === TransactionType.MODIFY_MULTISIG_ACCOUNT) {
        const modifyMultisigTxn = new ModifyMultisigAccountTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
            isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
            transactionDTO.minApprovalDelta,
            transactionDTO.minRemovalDelta,
            transactionDTO.modifications ? transactionDTO.modifications.map((modificationDTO) => new MultisigCosignatoryModification(
                modificationDTO.type,
                PublicAccount.createFromPublicKey(modificationDTO.cosignatoryPublicKey, extractNetworkType(transactionDTO.version)),
            )) : [],
            isEmbedded ? undefined : transactionDTO.signature,
            transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                            extractNetworkType(transactionDTO.version)) : undefined,
            transactionInfo,
        );
        return isEmbedded ? modifyMultisigTxn.toAggregate(modifyMultisigTxn.signer!) : modifyMultisigTxn;
    } else if (transactionDTO.type === TransactionType.LOCK) {
        const networkType = extractNetworkType(transactionDTO.version);
        const lockHashTxn = new LockFundsTransaction(
            networkType,
            extractTransactionVersion(transactionDTO.version),
            isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
            isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
            new Mosaic(new MosaicId(transactionDTO.mosaicId), new UInt64(transactionDTO.amount)),
            new UInt64(transactionDTO.duration),
            new TransactionHash(transactionDTO.hash, TransactionType.AGGREGATE_BONDED),
            isEmbedded ? undefined : transactionDTO.signature,
            transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer, networkType) : undefined,
            transactionInfo,
        );
        return isEmbedded ? lockHashTxn.toAggregate(lockHashTxn.signer!) : lockHashTxn;
    } else if (transactionDTO.type === TransactionType.SECRET_LOCK) {
        const recipient = transactionDTO.recipient;
        const secretLockTxn = new SecretLockTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
            isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
            new Mosaic(new MosaicId(transactionDTO.mosaicId), new UInt64(transactionDTO.amount)),
            new UInt64(transactionDTO.duration),
            transactionDTO.hashAlgorithm,
            (transactionDTO.hashAlgorithm === 2 ? transactionDTO.secret.substring(0, 40) : transactionDTO.secret),
            typeof recipient === 'object' && recipient.hasOwnProperty('address') ?
                Address.createFromRawAddress(recipient.address) : Address.createFromEncoded(recipient),
            isEmbedded ? undefined : transactionDTO.signature,
            transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                            extractNetworkType(transactionDTO.version)) : undefined,
            transactionInfo,
        );
        return isEmbedded ? secretLockTxn.toAggregate(secretLockTxn.signer!) : secretLockTxn;
    } else if (transactionDTO.type === TransactionType.SECRET_PROOF) {
        const secretProofTxn = new SecretProofTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
            isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
            transactionDTO.hashAlgorithm,
            (transactionDTO.hashAlgorithm === 2 ? transactionDTO.secret.substring(0, 40) : transactionDTO.secret),
            Address.createFromEncoded(transactionDTO.recipient),
            transactionDTO.proof,
            isEmbedded ? undefined : transactionDTO.signature,
            transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                            extractNetworkType(transactionDTO.version)) : undefined,
            transactionInfo,
        );
        return isEmbedded ? secretProofTxn.toAggregate(secretProofTxn.signer!) : secretProofTxn;
    } else if (transactionDTO.type === TransactionType.MOSAIC_ALIAS) {
        const mosaicAliasTxn = new MosaicAliasTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
            isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
            transactionDTO.aliasAction,
            new NamespaceId(transactionDTO.namespaceId),
            new MosaicId(transactionDTO.mosaicId),
            isEmbedded ? undefined : transactionDTO.signature,
            transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                            extractNetworkType(transactionDTO.version)) : undefined,
            transactionInfo,
        );
        return isEmbedded ? mosaicAliasTxn.toAggregate(mosaicAliasTxn.signer!) : mosaicAliasTxn;
    } else if (transactionDTO.type === TransactionType.ADDRESS_ALIAS) {
        const addressAliasTxn = new AddressAliasTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
            isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
            transactionDTO.aliasAction,
            new NamespaceId(transactionDTO.namespaceId),
            extractRecipient(transactionDTO.address) as Address,
            isEmbedded ? undefined : transactionDTO.signature,
            transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                            extractNetworkType(transactionDTO.version)) : undefined,
            transactionInfo,
        );
        return isEmbedded ? addressAliasTxn.toAggregate(addressAliasTxn.signer!) : addressAliasTxn;
    } else if (transactionDTO.type === TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS) {
        const accountAddressRestrictionTxn = new AccountAddressRestrictionModificationTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
            isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
            transactionDTO.propertyType,
            transactionDTO.modifications ? transactionDTO.modifications.map((modificationDTO) => new AccountRestrictionModification<string>(
                modificationDTO.type,
                Address.createFromEncoded(modificationDTO.value).plain(),
            )) : [],
            isEmbedded ? undefined : transactionDTO.signature,
            transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                            extractNetworkType(transactionDTO.version)) : undefined,
            transactionInfo,
        );
        return isEmbedded ? accountAddressRestrictionTxn.toAggregate(accountAddressRestrictionTxn.signer!) : accountAddressRestrictionTxn;
    } else if (transactionDTO.type === TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION) {
        const accountOperationRestrictionTxn = new AccountOperationRestrictionModificationTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
            isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
            transactionDTO.propertyType,
            transactionDTO.modifications ? transactionDTO.modifications.map((modificationDTO) => new AccountRestrictionModification<number[]>(
                modificationDTO.type,
                modificationDTO.value,
            )) : [],
            isEmbedded ? undefined : transactionDTO.signature,
            transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                            extractNetworkType(transactionDTO.version)) : undefined,
            transactionInfo,
        );
        return isEmbedded ? accountOperationRestrictionTxn.toAggregate(accountOperationRestrictionTxn.signer!) : accountOperationRestrictionTxn;
    } else if (transactionDTO.type === TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC) {
        const accountMosaicRestrictionTxn = new AccountMosaicRestrictionModificationTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
            isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
            transactionDTO.propertyType,
            transactionDTO.modifications ? transactionDTO.modifications.map((modificationDTO) => new AccountRestrictionModification<TransactionType>(
                modificationDTO.type,
                modificationDTO.value,
            )) : [],
            isEmbedded ? undefined : transactionDTO.signature,
            transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                            extractNetworkType(transactionDTO.version)) : undefined,
            transactionInfo,
        );
        return isEmbedded ? accountMosaicRestrictionTxn.toAggregate(accountMosaicRestrictionTxn.signer!) : accountMosaicRestrictionTxn;
    } else if (transactionDTO.type === TransactionType.LINK_ACCOUNT) {
        const accountLinkTxn = new AccountLinkTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
            isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
            transactionDTO.remoteAccountKey,
            transactionDTO.action,
            isEmbedded ? undefined : transactionDTO.signature,
            transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                    extractNetworkType(transactionDTO.version)) : undefined,
            transactionInfo,
        );
        return isEmbedded ? accountLinkTxn.toAggregate(accountLinkTxn.signer!) : accountLinkTxn;
    } else if (transactionDTO.type === TransactionType.MODIFY_ACCOUNT_METADATA ||
                transactionDTO.type === TransactionType.MODIFY_MOSAIC_METADATA ||
                transactionDTO.type === TransactionType.MODIFY_NAMESPACE_METADATA) {
        const networkType = extractNetworkType(transactionDTO.version);
        const transactionVersion = extractTransactionVersion(transactionDTO.version);
        const deadline = isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline);
        const maxFee = isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]);
        const signature = isEmbedded ? undefined : transactionDTO.signature;
        // const metadataType = transactionDTO.metadataType;
        const metadataId = transactionDTO.metadataId;
        const modifications =
            transactionDTO.modifications ?
            transactionDTO.modifications.map(m => new MetadataModification(m.key, m.value)) :
            undefined
        switch(transactionDTO.type) {
            case TransactionType.MODIFY_ACCOUNT_METADATA: {
                let modifyMetadataTxn = new ModifyMetadataTransaction(
                    TransactionType.MODIFY_ACCOUNT_METADATA,
                    networkType,
                    transactionVersion,
                    deadline,
                    maxFee,
                    oldMetadataType.ADDRESS,
                    Address.createFromEncoded(metadataId).plain(),
                    modifications,
                    signature,
                    transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                            extractNetworkType(transactionDTO.version)) : undefined,
                    transactionInfo,
                    )
                return isEmbedded ? modifyMetadataTxn.toAggregate(modifyMetadataTxn.signer!) : modifyMetadataTxn;
                // break;
            }
            case TransactionType.MODIFY_MOSAIC_METADATA: {
                let modifyMetadataTxn = new ModifyMetadataTransaction(
                    TransactionType.MODIFY_MOSAIC_METADATA,
                    networkType,
                    transactionVersion,
                    deadline,
                    maxFee,
                    oldMetadataType.MOSAIC,
                    new MosaicId(metadataId).toHex(),
                    modifications,
                    signature,
                    transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                            extractNetworkType(transactionDTO.version)) : undefined,
                    transactionInfo,
                    )
                return isEmbedded ? modifyMetadataTxn.toAggregate(modifyMetadataTxn.signer!) : modifyMetadataTxn;
                // break;
            }
            case TransactionType.MODIFY_NAMESPACE_METADATA: {
                let modifyMetadataTxn = new ModifyMetadataTransaction(
                    TransactionType.MODIFY_NAMESPACE_METADATA,
                    networkType,
                    transactionVersion,
                    deadline,
                    maxFee,
                    oldMetadataType.NAMESPACE,
                    new NamespaceId(metadataId).toHex(),
                    modifications,
                    signature,
                    transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                            extractNetworkType(transactionDTO.version)) : undefined,
                    transactionInfo,
                    )
                return isEmbedded ? modifyMetadataTxn.toAggregate(modifyMetadataTxn.signer!) : modifyMetadataTxn;
                // break;
            }
            // default: {
            //     throw new Error('Unimplemented modify metadata transaction with type ' + metadataType);
            // }
        }
    } else if (transactionDTO.type === TransactionType.CHAIN_UPGRADE) {
        const chainUpgradeTxn = new ChainUpgradeTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
            isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
            new UInt64(transactionDTO.upgradePeriod),
            new UInt64(transactionDTO.newBlockchainVersion),
            isEmbedded ? undefined : transactionDTO.signature,
            transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                            extractNetworkType(transactionDTO.version)) : undefined,
            transactionInfo,
        );
        return isEmbedded ? chainUpgradeTxn.toAggregate(chainUpgradeTxn.signer!) : chainUpgradeTxn;
    } else if (transactionDTO.type === TransactionType.CHAIN_CONFIGURE) {
        const chainConfigTxn = new ChainConfigTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
            isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
            new UInt64(transactionDTO.applyHeightDelta || [0, 0]),
            transactionDTO.networkConfig,
            transactionDTO.supportedEntityVersions,
            isEmbedded ? undefined : transactionDTO.signature,
            transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                            extractNetworkType(transactionDTO.version)) : undefined,
            transactionInfo,
        );
        return isEmbedded ? chainConfigTxn.toAggregate(chainConfigTxn.signer!) : chainConfigTxn;
    } else if (transactionDTO.type === TransactionType.ADD_EXCHANGE_OFFER) {
        const addExchangeOfferTxn = new AddExchangeOfferTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
            transactionDTO.offers.map(o => new AddExchangeOffer(
                new MosaicId(o.mosaicId),
                new UInt64(o.mosaicAmount),
                new UInt64(o.cost),
                o.type,
                new UInt64(o.duration)
            )),
            isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
            isEmbedded ? undefined : transactionDTO.signature,
            transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                            extractNetworkType(transactionDTO.version)) : undefined,
            transactionInfo,
        );
        return isEmbedded ? addExchangeOfferTxn.toAggregate(addExchangeOfferTxn.signer!) : addExchangeOfferTxn;
    } else if (transactionDTO.type === TransactionType.EXCHANGE_OFFER) {
        const exchangeOfferTxn = new ExchangeOfferTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
            transactionDTO.offers.map(o => new ExchangeOffer(
                new MosaicId(o.mosaicId),
                new UInt64(o.mosaicAmount),
                new UInt64(o.cost),
                o.type,
                PublicAccount.createFromPublicKey(o.owner, extractNetworkType(transactionDTO.version))
            )),
            isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
            isEmbedded ? undefined : transactionDTO.signature,
            transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                            extractNetworkType(transactionDTO.version)) : undefined,
            transactionInfo,
        );
        return isEmbedded ? exchangeOfferTxn.toAggregate(exchangeOfferTxn.signer!) : exchangeOfferTxn;
    } else if (transactionDTO.type === TransactionType.REMOVE_EXCHANGE_OFFER) {
        const removeExchangeOfferTxn = new RemoveExchangeOfferTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
            transactionDTO.offers.map(o => new RemoveExchangeOffer(
                new MosaicId(o.mosaicId),
                o.offerType // or type?
            )),
            isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
            isEmbedded ? undefined : transactionDTO.signature,
            transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                            extractNetworkType(transactionDTO.version)) : undefined,
            transactionInfo,
        );
        return isEmbedded ? removeExchangeOfferTxn.toAggregate(removeExchangeOfferTxn.signer!) : removeExchangeOfferTxn;
    } else if (transactionDTO.type === TransactionType.ACCOUNT_METADATA_V2) {
        const networkType = extractNetworkType(transactionDTO.version);
        const accountMetadataTxn = new AccountMetadataTransaction(
            networkType,
            extractTransactionVersion(transactionDTO.version),
            isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
            isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
            new UInt64(transactionDTO.scopedMetadataKey),
            PublicAccount.createFromPublicKey(transactionDTO.targetKey, networkType),
            transactionDTO.valueSizeDelta,
            "",
            "",
            transactionDTO.valueSize,
            convert.hexToUint8(transactionDTO.value),
            isEmbedded ? undefined : transactionDTO.signature,
            transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                            extractNetworkType(transactionDTO.version)) : undefined,
            transactionInfo,
        );
        return isEmbedded ? accountMetadataTxn.toAggregate(accountMetadataTxn.signer!) : accountMetadataTxn;
    } else if (transactionDTO.type === TransactionType.MOSAIC_METADATA_V2) {
        const networkType = extractNetworkType(transactionDTO.version);
        const mosaicMetadataTxn = new MosaicMetadataTransaction(
            networkType,
            extractTransactionVersion(transactionDTO.version),
            isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
            isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
            new UInt64(transactionDTO.scopedMetadataKey),
            PublicAccount.createFromPublicKey(transactionDTO.targetKey, networkType),
            new MosaicId(transactionDTO.targetMosaicId),
            transactionDTO.valueSizeDelta,
            "",
            "",
            transactionDTO.valueSize,
            convert.hexToUint8(transactionDTO.value),
            isEmbedded ? undefined : transactionDTO.signature,
            transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                            extractNetworkType(transactionDTO.version)) : undefined,
            transactionInfo,
        );
        return isEmbedded ? mosaicMetadataTxn.toAggregate(mosaicMetadataTxn.signer!) : mosaicMetadataTxn;
    } else if (transactionDTO.type === TransactionType.NAMESPACE_METADATA_V2) {
        const networkType = extractNetworkType(transactionDTO.version);
        const namespaceMetadataTxn = new NamespaceMetadataTransaction(
            networkType,
            extractTransactionVersion(transactionDTO.version),
            isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
            isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
            new UInt64(transactionDTO.scopedMetadataKey),
            PublicAccount.createFromPublicKey(transactionDTO.targetKey, networkType),
            new NamespaceId(transactionDTO.targetNamespaceId),
            transactionDTO.valueSizeDelta,
            "",
            "",
            transactionDTO.valueSize,
            convert.hexToUint8(transactionDTO.value),
            isEmbedded ? undefined : transactionDTO.signature,
            transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                            extractNetworkType(transactionDTO.version)) : undefined,
            transactionInfo,
        );
        return isEmbedded ? namespaceMetadataTxn.toAggregate(namespaceMetadataTxn.signer!) : namespaceMetadataTxn;
    } else if (transactionDTO.type === TransactionType.MODIFY_MOSAIC_LEVY) {
        const mosaicModifyLevyTxn = new MosaicModifyLevyTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
            isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
            new MosaicId(transactionDTO.mosaicId),
            new MosaicLevy(
                transactionDTO.levy.type, 
                Address.createFromEncoded(transactionDTO.levy.recipient), 
                new MosaicId(transactionDTO.levy.mosaicId), 
                new UInt64(transactionDTO.levy.fee)
            ),
            isEmbedded ? undefined : transactionDTO.signature,
            transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                            extractNetworkType(transactionDTO.version)) : undefined,
            transactionInfo,
        );
        return isEmbedded ? mosaicModifyLevyTxn.toAggregate(mosaicModifyLevyTxn.signer!) : mosaicModifyLevyTxn;
    } else if (transactionDTO.type === TransactionType.REMOVE_MOSAIC_LEVY) {
        const mosaicRemoveLevyTxn = new MosaicRemoveLevyTransaction(
            extractNetworkType(transactionDTO.version),
            extractTransactionVersion(transactionDTO.version),
            isEmbedded? Deadline.createEmpty() : Deadline.createFromDTO(transactionDTO.deadline),
            isEmbedded ? new UInt64([0,0]) : new UInt64(transactionDTO.maxFee || [0, 0]),
            new MosaicId(transactionDTO.mosaicId),
            isEmbedded ? undefined : transactionDTO.signature,
            transactionDTO.signer ? PublicAccount.createFromPublicKey(transactionDTO.signer,
                            extractNetworkType(transactionDTO.version)) : undefined,
            transactionInfo,
        );
        return isEmbedded ? mosaicRemoveLevyTxn.toAggregate(mosaicRemoveLevyTxn.signer!) : mosaicRemoveLevyTxn;
    }
    

    throw new Error('Unimplemented transaction with type ' + transactionDTO.type);
};

export const extractNetworkType = (version: number): NetworkType => {
    const networkType = parseInt((version >>> 0).toString(16).substring(0, 2), 16); // ">>> 0" hack makes it effectively an Uint32
    if (networkType === NetworkType.MAIN_NET) {
        return NetworkType.MAIN_NET;
    } else if (networkType === NetworkType.TEST_NET) {
        return NetworkType.TEST_NET;
    } else if (networkType === NetworkType.PRIVATE) {
        return NetworkType.PRIVATE;
    } else if (networkType === NetworkType.PRIVATE_TEST) {
        return NetworkType.PRIVATE_TEST;
    } else if (networkType === NetworkType.MIJIN) {
        return NetworkType.MIJIN;
    } else if (networkType === NetworkType.MIJIN_TEST) {
        return NetworkType.MIJIN_TEST;
    }
    throw new Error('Unimplemented network type');
};

export const extractTransactionVersion = (version: number): number => {
    return parseInt((version >>> 0).toString(16).substring(2), 16); // ">>> 0" hack makes it effectively an Uint32
};

/**
 * Extract recipient value from encoded hexadecimal notation.
 *
 * If bit 0 of byte 0 is not set (e.g. 0x90), then it is a regular address.
 * Else (e.g. 0x91) it represents a namespace id which starts at byte 1.
 *
 * @param recipient {string} Encoded hexadecimal recipient notation
 * @return {Address | NamespaceId}
 */
export const extractRecipient = (recipient: any): Address | NamespaceId => {
    if (typeof recipient === 'string') {
        // If bit 0 of byte 0 is not set (like in 0x90), then it is a regular address.
        // Else (e.g. 0x91) it represents a namespace id which starts at byte 1.
        const bit0 = convert.hexToUint8(recipient.substring(1, 3))[0];
        if ((bit0 & 16) === 16) {
            // namespaceId encoded hexadecimal notation provided
            // only 8 bytes are relevant to resolve the NamespaceId
            const relevantPart = recipient.substring(2, 18);
            return NamespaceId.createFromEncoded(relevantPart);
        }

        // read address from encoded hexadecimal notation
        return Address.createFromEncoded(recipient);
    } else if (typeof recipient === 'object') { // Is JSON object
        if (recipient.hasOwnProperty('address')) {
            return Address.createFromRawAddress(recipient.address);
        } else if (recipient.hasOwnProperty('id')) {
            return new NamespaceId(recipient.id);
        }
    }
    throw new Error(`Recipient: ${recipient} type is not recognised`);
};

/**
 * Extract mosaics from encoded UInt64 notation.
 *
 * If most significant bit of byte 0 is set, then it is a namespaceId.
 * If most significant bit of byte 0 is not set, then it is a mosaicId.
 *
 * @param mosaics {Array | undefined} The DTO array of mosaics (with UInt64 Id notation)
 * @return {Mosaic[]}
 */
export const extractMosaics = (mosaics: any): Mosaic[] => {

    if (mosaics === undefined) {
        return [];
    }

    return mosaics.map((mosaicDTO) => {

        // convert ID to UInt8 bytes array and get first byte (most significant byte)
        const uint64 = new Id(mosaicDTO.id);
        const bytes = convert.hexToUint8(UInt64Library.toHex(uint64.toDTO()));
        const byte0 = bytes[0];

        // if most significant bit of byte 0 is set, then we have a namespaceId
        if ((byte0 & 128) === 128) {
            return new Mosaic(new NamespaceId(mosaicDTO.id), new UInt64(mosaicDTO.amount));
        }

        // most significant bit of byte 0 is not set => mosaicId
        return new Mosaic(new MosaicId(mosaicDTO.id), new UInt64(mosaicDTO.amount));
    });
};

/**
 * Extract beneficiary public key from DTO.
 *
 * @todo Upgrade of catapult-rest WITH catapult-service-bootstrap versioning.
 *
 * With `cow` upgrade (nemtech/catapult-server@0.3.0.2), `catapult-rest` block DTO
 * was updated and latest catapult-service-bootstrap uses the wrong block DTO.
 * This will be fixed with next catapult-server upgrade to `dragon`.
 *
 * :warning It is currently not possible to read the block's beneficiary public key
 * except when working with a local instance of `catapult-rest`.
 *
 * @param beneficiary {string | undefined} The beneficiary public key if set
 * @return {Mosaic[]}
 */
export const extractBeneficiary = (
    blockDTO: any,
    networkType: NetworkType,
): PublicAccount | undefined => {

    let dtoPublicAccount: PublicAccount | undefined;
    let dtoFieldValue: string | undefined;
    if (blockDTO.block.beneficiaryPublicKey) {
        dtoFieldValue = blockDTO.block.beneficiaryPublicKey;
    } else if (blockDTO.block.beneficiary) {
        dtoFieldValue = blockDTO.block.beneficiary;
    }

    if (! dtoFieldValue) {
        return undefined;
    }

    try {
        // @FIX with latest catapult-service-bootstrap version, catapult-rest still returns
        //      a `string` formatted copy of the public *when it is set at all*.
        dtoPublicAccount = PublicAccount.createFromPublicKey(dtoFieldValue, networkType);
    } catch (e) { dtoPublicAccount =  undefined; }

    return dtoPublicAccount;
};
