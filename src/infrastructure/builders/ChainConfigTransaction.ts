// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

/**
 * @module transactions/ChainConfigTransaction
 */
import { TransactionType } from '../../model/transaction/TransactionType';
import ChainConfigTransactionBufferPackage from '../buffers/ChainConfigTransactionBuffer';
import ChainConfigTransactionSchema from '../schemas/ChainConfigTransactionSchema';
import { VerifiableTransaction } from './VerifiableTransaction';

const {
    CatapultConfigTransactionBuffer,
} = ChainConfigTransactionBufferPackage.Buffers;

import * as flatbuffers from 'flatbuffers';
import { Convert } from '../../core/format';

export default class ChainConfigTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, ChainConfigTransactionSchema);
    }
}

export class Builder {
    size: any;
    maxFee: any;
    version: any;
    type: any;
    deadline: any;
    applyHeightDelta: any;
    networkConfig: any;
    supportedEntityVersions: any;

    constructor() {
        this.maxFee = [0, 0];
        this.type = TransactionType.CHAIN_CONFIGURE;
    }

    addSize(size) {
        this.size = size;
        return this;
    }

    addMaxFee(maxFee) {
        this.maxFee = maxFee;
        return this;
    }

    addApplyHeightDelta(applyHeightDelta) {
        this.applyHeightDelta = applyHeightDelta;
        return this;
    }

    addNetworkConfig(networkConfig) {
        this.networkConfig = networkConfig.split('').map(n=>n.charCodeAt(0));
        return this;
    }

    addSupportedEntityVersions(supportedEntityVersions) {
        this.supportedEntityVersions = supportedEntityVersions.split('').map(n=>n.charCodeAt(0));
        return this;
    }

    addVersion(version) {
        this.version = version;
        return this;
    }

    addType(type) {
        this.type = type;
        return this;
    }

    addDeadline(deadline) {
        this.deadline = deadline;
        return this;
    }

    build() {
        const builder = new flatbuffers.Builder(1);

        const signatureVector = CatapultConfigTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = CatapultConfigTransactionBuffer
            .createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = CatapultConfigTransactionBuffer
            .createDeadlineVector(builder, this.deadline);
        const feeVector = CatapultConfigTransactionBuffer
            .createMaxFeeVector(builder, this.maxFee);
        const applyHeightDeltaVector = CatapultConfigTransactionBuffer
            .createApplyHeightDeltaVector(builder, this.applyHeightDelta);
        const networkConfigVector = CatapultConfigTransactionBuffer
            .createBlockChainConfigVector(builder, this.networkConfig);
        const supportedEntityVersionsVector = CatapultConfigTransactionBuffer
            .createSupportedEntityVersionsVector(builder, this.supportedEntityVersions);

        CatapultConfigTransactionBuffer.startCatapultConfigTransactionBuffer(builder);
        CatapultConfigTransactionBuffer.addSize(builder, this.size);
        CatapultConfigTransactionBuffer.addSignature(builder, signatureVector);
        CatapultConfigTransactionBuffer.addSigner(builder, signerVector);
        CatapultConfigTransactionBuffer.addVersion(builder, this.version);
        CatapultConfigTransactionBuffer.addType(builder, this.type);
        CatapultConfigTransactionBuffer.addMaxFee(builder, feeVector);
        CatapultConfigTransactionBuffer.addDeadline(builder, deadlineVector);
        CatapultConfigTransactionBuffer.addApplyHeightDelta(builder, applyHeightDeltaVector);
        CatapultConfigTransactionBuffer.addBlockChainConfigSize(builder, this.networkConfig.length);
        CatapultConfigTransactionBuffer.addSupportedEntityVersionsSize(builder, this.supportedEntityVersions.length);
        CatapultConfigTransactionBuffer.addBlockChainConfig(builder, networkConfigVector);
        CatapultConfigTransactionBuffer.addSupportedEntityVersions(builder, supportedEntityVersionsVector);

        // Calculate size
        const codedChainConfig = CatapultConfigTransactionBuffer.endCatapultConfigTransactionBuffer(builder);
        builder.finish(codedChainConfig);

        const bytes = builder.asUint8Array();
        return new ChainConfigTransaction(bytes);
    }
}
