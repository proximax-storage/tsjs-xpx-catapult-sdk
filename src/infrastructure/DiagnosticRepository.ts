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

import {Observable} from 'rxjs';
import {BlockchainStorageInfo} from '../model/blockchain/BlockchainStorageInfo';
import { ServerInfo } from '../model/diagnostic/ServerInfo';
import { RequestOptions } from './RequestOptions';

/**
 * Diagnostic interface repository.
 *
 * @since 1.0
 */
export interface DiagnosticRepository {

    /**
     * Gets blockchain storage info.
     * @returns Observable<BlockchainStorageInfo>
     */
    getDiagnosticStorage(requestOptions?: RequestOptions): Observable<BlockchainStorageInfo>;

    /**
     * Gets blockchain server info.
     * @returns Observable<ServerInfo>
     */
    getServerInfo(requestOptions?: RequestOptions): Observable<ServerInfo>;
}
