/**
 * Sirius Transaction type number
 */

import { RequestFile } from '../api';

/**
* The entity type: 
* 0x4158 (16728 decimal) - Blockchain Upgrade Transaction. 
* 0x4159 (16729 decimal) - Network Config Transaction. 
* 0x413D (16701 decimal) - Address Metadata Transaction. 
* 0x423D (16957 decimal) - Mosaic Metadata Transaction. 
* 0x433D (17213 decimal) - Namespace Metadata Transaction. 
* 0x414D (16717 decimal) - Mosaic Definition Transaction. 
* 0x424D (16973 decimal) - Mosaic Supply Change Transaction. 
* 0x414E (16718 decimal) - Register Namespace Transaction. 
* 0x424E (16974 decimal) - Address Alias Transaction. 
* 0x434E (17230 decimal) - Mosaic Alias Transaction. 
* 0x4154 (16724 decimal) - Transfer Transaction. 
* 0x4155 (16725 decimal) - Modify Multisig Account Transaction. 
* 0x4141 (16705 decimal) - Aggregate Complete Transaction. 
* 0x4241 (16961 decimal) - Aggregate Bonded Transaction. 
* 0x4148 (16712 decimal) - Hash Lock Transaction. 
* 0x4150 (16720 decimal) - Account Properties Address Transaction. 
* 0x4250 (16976 decimal) - Account Properties Mosaic Transaction. 
* 0x4350 (17232 decimal) - Account Properties Entity Type Transaction. 
* 0x4152 (16722 decimal) - Secret Lock Transaction. 
* 0x4252 (16978 decimal) - Secret Proof Transaction. 
* 0x414C (16716 decimal) - Account Link Transaction. 
* 0x8043 (32835 decimal) - Nemesis block. 
* 0x8143 (33091 decimal) - Regular block. 
* 0x415D (16733 decimal) - Add Exchange Offer Transaction. 
* 0x425D (16989 decimal) - Exchange Offer Transaction. 
* 0x435D (17245 decimal) - Remove Exchange Offer Transaction. 
* 0x4157 (16727 decimal) - Modify Contract Transaction. 
* 0x415A (16730 decimal) - Prepare Drive Transaction. 
* 0x425A (16986 decimal) - Join To Drive Transaction. 
* 0x435A (17242 decimal) - Drive File System Transaction. 
* 0x445A (17498 decimal) - Files Deposit Transaction. 
* 0x455A (17754 decimal) - End Drive Transaction. 
* 0x465A (18010 decimal) - Drive Files Reward Transaction. 
* 0x475A (18266 decimal) - Start Drive Verification Transaction. 
* 0x485A (18522 decimal) - End Drive Verification Transaction. 
* 0x413F (16703 decimal) - Account Metadata_V2 Transaction
* 0x423F (16959 decimal) - Mosaic Metadata_V2 Transaction
* 0x433F (17215 decimal) - Namespace Metadata_V2 Transaction
* 0x434D (17229 decimal) - Mosaic Modify Levy Transaction
* 0x444D (17485 decimal) - Mosaic Remove Levy Transaction
* 0x416A (16746 decimal) - Place Sda Exchange Offer Transaction
* 0x426A (17002 decimal) - Remove Sda Exchange Offer Transaction
* 0x4161 (16737 decimal) - Add Harvester Transaction
* 0x4261 (16993 decimal) - Remove Harvester Transaction
*/
export enum EntityTypeEnum {
    NUMBER_16728 = <any> 16728,
    NUMBER_16729 = <any> 16729,
    NUMBER_16701 = <any> 16701,
    NUMBER_16957 = <any> 16957,
    NUMBER_17213 = <any> 17213,
    NUMBER_16717 = <any> 16717,
    NUMBER_16973 = <any> 16973,
    NUMBER_16718 = <any> 16718,
    NUMBER_16974 = <any> 16974,
    NUMBER_17230 = <any> 17230,
    NUMBER_16724 = <any> 16724,
    NUMBER_16725 = <any> 16725,
    NUMBER_16705 = <any> 16705,
    NUMBER_16961 = <any> 16961,
    NUMBER_16712 = <any> 16712,
    NUMBER_16720 = <any> 16720,
    NUMBER_16976 = <any> 16976,
    NUMBER_17232 = <any> 17232,
    NUMBER_16722 = <any> 16722,
    NUMBER_16978 = <any> 16978,
    NUMBER_16716 = <any> 16716,
    NUMBER_32835 = <any> 32835,
    NUMBER_16703 = <any> 16703,
    NUMBER_16959 = <any> 16959,
    NUMBER_17215 = <any> 17215,
    NUMBER_17229 = <any> 17229,
    NUMBER_17485 = <any> 17485,
    NUMBER_16746 = <any> 16746,
    NUMBER_17002 = <any> 17002,
    NUMBER_16737 = <any> 16737,
    NUMBER_16993 = <any> 16993,
}
