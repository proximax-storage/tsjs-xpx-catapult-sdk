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
import { TransactionType } from '../../model/transaction/TransactionType';
import MosaicSupplyChangeTransactionBufferPackage from '../buffers/MosaicSupplyChangeTransactionBuffer';
import MosaicSupplyChangeTransactionSchema from '../schemas/MosaicSupplyChangeTransactionSchema';
import { VerifiableTransaction } from './VerifiableTransaction';

const {
    MosaicSupplyChangeTransactionBuffer,
} = MosaicSupplyChangeTransactionBufferPackage.Buffers;

import * as flatbuffers from 'flatbuffers';

/**
 * @module transactions/MosaicSupplyChangeTransaction
 */
export default class MosaicSupplyChangeTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, MosaicSupplyChangeTransactionSchema);
    }
}
// tslint:disable-next-line:max-classes-per-file
export class Builder {
    size: any;
    maxFee: any;
    version: any;
    type: any;
    deadline: any;
    mosaicId: any;
    direction: any;
    delta: any;
    constructor() {
        this.maxFee = [0, 0];
        this.type = TransactionType.MOSAIC_SUPPLY_CHANGE;
    }

    addSize(size) {
        this.size = size;
        return this;
    }

    addMaxFee(maxFee) {
        this.maxFee = maxFee;
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

    addMosaicId(mosaicId) {
        this.mosaicId = mosaicId;
        return this;
    }

    addDirection(direction) {
        this.direction = direction;
        return this;
    }

    addDelta(delta) {
        this.delta = delta;
        return this;
    }

    build() {
        const builder = new flatbuffers.Builder(1);

        // Create vectors
        const signatureVector = MosaicSupplyChangeTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = MosaicSupplyChangeTransactionBuffer
            .createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = MosaicSupplyChangeTransactionBuffer
            .createDeadlineVector(builder, this.deadline);
        const feeVector = MosaicSupplyChangeTransactionBuffer
            .createMaxFeeVector(builder, this.maxFee);
        const mosaicIdVector = MosaicSupplyChangeTransactionBuffer
            .createMaxFeeVector(builder, this.mosaicId);
        const deltaVector = MosaicSupplyChangeTransactionBuffer
            .createMaxFeeVector(builder, this.delta);

        MosaicSupplyChangeTransactionBuffer.startMosaicSupplyChangeTransactionBuffer(builder);
        MosaicSupplyChangeTransactionBuffer.addSize(builder, this.size);
        MosaicSupplyChangeTransactionBuffer.addSignature(builder, signatureVector);
        MosaicSupplyChangeTransactionBuffer.addSigner(builder, signerVector);
        MosaicSupplyChangeTransactionBuffer.addVersion(builder, this.version);
        MosaicSupplyChangeTransactionBuffer.addType(builder, this.type);
        MosaicSupplyChangeTransactionBuffer.addMaxFee(builder, feeVector);
        MosaicSupplyChangeTransactionBuffer.addDeadline(builder, deadlineVector);
        MosaicSupplyChangeTransactionBuffer.addMosaicId(builder, mosaicIdVector);
        MosaicSupplyChangeTransactionBuffer.addDirection(builder, this.direction);
        MosaicSupplyChangeTransactionBuffer.addDelta(builder, deltaVector);

        // Calculate size
        const codedMosaicChangeSupply = MosaicSupplyChangeTransactionBuffer.endMosaicSupplyChangeTransactionBuffer(builder);
        builder.finish(codedMosaicChangeSupply);

        const bytes = builder.asUint8Array();
        return new MosaicSupplyChangeTransaction(bytes);
    }
}
