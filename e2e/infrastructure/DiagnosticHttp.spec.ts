/*
 * Copyright 2023 ProximaX
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

import {expect} from 'chai';
import {DiagnosticHttp} from '../../src/infrastructure/DiagnosticHttp';
import { APIUrl } from '../conf/conf.spec';
describe('DiagnosticHttp', () => {
    let diagnosticHttp = new DiagnosticHttp(APIUrl);

    describe('getDiagnosticStorage', () => {
        it('should return diagnostic storage', (done) => {
            diagnosticHttp.getDiagnosticStorage()
                .subscribe((blockchainStorageInfo) => {
                    expect(blockchainStorageInfo.numBlocks).to.be.greaterThan(0);
                    expect(blockchainStorageInfo.numTransactions).to.be.greaterThan(0);
                    expect(blockchainStorageInfo.numAccounts).to.be.greaterThan(0);
                    done();
                });
        });
    });

    describe('getServerInfo', () => {
        it('should return diagnostic storage', (done) => {
            diagnosticHttp.getServerInfo()
                .subscribe((serverInfo) => {
                    expect(serverInfo.restVersion).not.to.be.null;
                    expect(serverInfo.sdkVersion).not.to.be.null;
                    done();
                });
        });
    });
});
