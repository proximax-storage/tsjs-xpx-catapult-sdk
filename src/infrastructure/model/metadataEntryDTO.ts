/*
 * Copyright 2021 ProximaX
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

export class MetaDataEntryDTO {
    'version': number;
    /**
    * The compositeHash for account/mosaic/namespace metadata. 
    */
    'compositeHash': string;
    'sourceAddress': string;
    'targetKey': string;
    'scopedMetadataKey': Array<number>;
    'targetId': Array<number>;
    'metadataType': number;
    'valueSize': number;
    'value': string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "version",
            "baseName": "version",
            "type": "number"
        },
        {
            "name": "compositeHash",
            "baseName": "compositeHash",
            "type": "string"
        },
        {
            "name": "sourceAddress",
            "baseName": "sourceAddress",
            "type": "string"
        },
        {
            "name": "targetKey",
            "baseName": "targetKey",
            "type": "string"
        },
        {
            "name": "scopedMetadataKey",
            "baseName": "scopedMetadataKey",
            "type": "Array<number>"
        },
        {
            "name": "targetId",
            "baseName": "targetId",
            "type": "Array<number>"
        },
        {
            "name": "metadataType",
            "baseName": "metadataType",
            "type": "number"
        },
        {
            "name": "valueSize",
            "baseName": "valueSize",
            "type": "number"
        },
        {
            "name": "value",
            "baseName": "value",
            "type": "string"
        }
    ];

    static getAttributeTypeMap() {
        return MetaDataEntryDTO.attributeTypeMap;
    }
}

