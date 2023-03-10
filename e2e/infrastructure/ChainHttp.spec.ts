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
import {ChainHttp} from '../../src/infrastructure/ChainHttp';
import { APIUrl } from '../conf/conf.spec';
describe('ChainHttp', () => {
    let chainHttp = new ChainHttp(APIUrl);

    describe('getBlockchainHeight', () => {
        it('should return blockchain height', (done) => {
            chainHttp.getBlockchainHeight()
                .subscribe((height) => {
                    expect(height.lower).to.be.greaterThan(0);
                    done();
                });
        });
    });

    describe('getBlockchainScore', () => {
        it('should return blockchain score', (done) => {
            chainHttp.getBlockchainScore()
                .subscribe((blockchainScore) => {
                    expect(blockchainScore.scoreLow).to.not.be.equal(undefined);
                    expect(blockchainScore.scoreHigh).to.not.be.equal(undefined);
                    expect(blockchainScore.scoreHigh.lower).to.not.be.equal(0);
                    expect(blockchainScore.scoreHigh.higher).to.be.equal(0);
                    done();
                });
        });
    });
});
