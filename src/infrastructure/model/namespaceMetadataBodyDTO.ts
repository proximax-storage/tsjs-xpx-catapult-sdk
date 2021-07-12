/**
 * Catapult REST API Reference
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.7.15
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { RequestFile } from '../api';
import { MetadataModificationDTO } from './metadataModificationDTO';
import { MetadataTypeEnum } from './metadataTypeEnum';

export class NamespaceMetadataBodyDTO {
    'metadataId': Array<number>;
    'metadataType': MetadataTypeEnum;
    /**
    * The array of metadata modifications.
    */
    'modifications': Array<MetadataModificationDTO>;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "metadataId",
            "baseName": "metadataId",
            "type": "Array<number>"
        },
        {
            "name": "metadataType",
            "baseName": "metadataType",
            "type": "MetadataTypeEnum"
        },
        {
            "name": "modifications",
            "baseName": "modifications",
            "type": "Array<MetadataModificationDTO>"
        }    ];

    static getAttributeTypeMap() {
        return NamespaceMetadataBodyDTO.attributeTypeMap;
    }
}
