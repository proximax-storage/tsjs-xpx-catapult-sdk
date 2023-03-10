/*
 * Copyright 2023 ProximaX
 * Copyright 2018 NEM
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
import {ChronoUnit, Instant, LocalDateTime, ZoneId} from '@js-joda/core';
import {Deadline} from '../../../src/model/transaction/Deadline';

describe('Deadline', () => {
    it('should createComplete timestamp today', () => {
        const deadline = Deadline.create();

        // avoid SYSTEM and UTC differences
        const networkTimeStamp = (new Date()).getTime();
        const timestampLocal = LocalDateTime.ofInstant(Instant.ofEpochMilli(networkTimeStamp), ZoneId.SYSTEM);
        const reproducedDate = timestampLocal.plus(2, ChronoUnit.HOURS);

        expect(deadline.value!.dayOfMonth()).to.be.equal(reproducedDate.dayOfMonth());
        expect(deadline.value!.monthValue()).to.be.equal(reproducedDate.monthValue());
        expect(deadline.value!.year()).to.be.equal(reproducedDate.year());
    });

    it('should throw error deadline smaller than timeStamp', () => {
        expect(() => {
            Deadline.create(-3);
        }).to.throw(Error);
    });

    it('should throw error deadline greater than 24h', () => {
        expect(() => {
            Deadline.create(2, ChronoUnit.DAYS);
        }).to.throw(Error);
    });

    it('should create deadline greater than 24h, for aggregate bonded transaction', () => {
        expect(() => {
            Deadline.createForBonded(2, ChronoUnit.DAYS);
        }).to.not.throw(Error);
    });

    it('should createComplete date with Deadline array', () => {
        const deadline = Deadline.createFromDTO([3866227606, 11]);

        expect(deadline.toDTO()[0]).to.be.equal(3866227606);
        expect(deadline.toDTO()[1]).to.be.equal(11);
    });

});
