/* eslint-env mocha */
'use strict';

const assert = require('assert');
const sinon = require('sinon');

const async = require('./async');

function createAsyncJob(spy) {
    return () => new Promise(resolve => {
        setTimeout(() => {
            spy();
            resolve(1);
        }, 100);
    });
}
function createAsyncJob2(spy) {
    return () => new Promise(resolve => {
        setTimeout(() => {
            spy();
            resolve(2);
        }, 100);
    });
}

describe('runParallel tests', () => {
    it('Из 2 промисов параллельно исполняется только один с учетом порядка', () => {
        const firstSpy = sinon.spy();
        const secondSpy = sinon.spy();

        return async.runParallel([
            createAsyncJob(firstSpy),
            createAsyncJob2(secondSpy)
        ], 1, 103).then(() => {
            assert(firstSpy.calledOnce, 'Spy №1 вызван один раз');
            assert(secondSpy.calledOnce, 'Spy №2 вызван один раз');

            assert(firstSpy.calledBefore(secondSpy), 'Spy №1 вызван перед Spy №2');
        });
    });
});
