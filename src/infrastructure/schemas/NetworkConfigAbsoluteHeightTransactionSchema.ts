// Copyright 2019 ProximaX Limited. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file

import {
    array,
    Schema,
    table,
    tableArray,
    TypeSize,
    ubyte,
    uint,
    ushort
} from './Schema';

/**
 * @module schema/NetworkConfigAbsoluteHeightTransactionSchema
 */

/**
 * Chain config absolute height transaction schema
 * @const {module:schema/Schema}
 */
const schema = new Schema([
    uint('size'),
    array('signature'),
    array('signer'),
    uint('version'),
    ushort('type'),
    array('fee', TypeSize.INT),
    array('deadline', TypeSize.INT),
    array('applyHeight', TypeSize.INT),
    ushort('networkConfigSize'),
    ushort('supportedEntityVersionsSize'),
    array('networkConfig'),
    array('supportedEntityVersions'),
]);

export default schema;
