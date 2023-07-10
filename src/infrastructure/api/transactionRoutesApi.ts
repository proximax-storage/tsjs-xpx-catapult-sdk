/**
 * Sirius REST API Reference
 * No description provided (https://bcdocs.xpxsirius.io/endpoints/v0.9.0/#tag/Transaction-routes) * 
 */

import axios from 'axios';
import {AxiosRequestConfig, AxiosResponse, AxiosError} from 'axios';

/* tslint:disable:no-unused-locals */
import { AnnounceTransactionInfoDTO } from '../model/announceTransactionInfoDTO';
import { Cosignature } from '../model/cosignature';
import { TransactionHashes } from '../model/transactionHashes';
import { TransactionIds } from '../model/transactionIds';
import { TransactionTypes } from '../model/transactionTypes';
import { TransactionInfoDTO } from '../model/transactionInfoDTO';
import { TransactionCountDTO } from '../model/transactionCountDTO';
import { TransactionPayload } from '../model/transactionPayload';
import { TransactionStatusDTO } from '../model/transactionStatusDTO';
import { RequestOptions } from '../RequestOptions';

import { ObjectSerializer} from '../model/models';

import { HttpError, RequestFile } from './apis';
import { TransactionSearchDTO } from '../model/transactionSearchDTO';
import { TransactionQueryParams } from '../TransactionQueryParams';

let defaultBasePath = 'http://localhost:3000';

export interface TransactionInfoResponse{
    response: AxiosResponse;
    body: TransactionInfoDTO;
}

export interface TransactionsInfoResponse{
    response: AxiosResponse;
    body: TransactionInfoDTO[];
}

export interface TransactionSearchResponse{
    response: AxiosResponse;
    body: TransactionSearchDTO;
}

export interface AnnounceTransactionResponse{
    response: AxiosResponse;
    body: AnnounceTransactionInfoDTO;
} 

export interface TransactionStatusResponse{
    response: AxiosResponse;
    body: TransactionStatusDTO;
}

export interface TransactionsStatusResponse{
    response: AxiosResponse;
    body: TransactionStatusDTO[];
}

export interface TransactionsCountResponse{
    response: AxiosResponse;
    body: TransactionCountDTO[];
}

export enum TransactionRoutesApiApiKeys {
}

export class TransactionRoutesApi {
    protected _basePath = defaultBasePath;
    protected _defaultHeaders : { [name: string]: string; } = { 
        'Content-Type': 'application/json', 
        'Accept': 'application/json'
    };
    protected _useQuerystring : boolean = false;

    constructor(basePath?: string);
    constructor(basePathOrUsername: string, password?: string, basePath?: string) {
        if (password) {
            if (basePath) {
                this.basePath = basePath;
            }
        } else {
            if (basePathOrUsername) {
                this.basePath = basePathOrUsername
            }
        }
    }

    set useQuerystring(value: boolean) {
        this._useQuerystring = value;
    }

    set basePath(basePath: string) {
        this._basePath = basePath;
    }

    set defaultHeaders(defaultHeaders: any) {
        this._defaultHeaders = defaultHeaders;
    }

    get defaultHeaders() {
        return this._defaultHeaders;
    }

    get basePath() {
        return this._basePath;
    }

    combineHeaders(reqOptions?:RequestOptions){
        return reqOptions ? {...this._defaultHeaders, ...reqOptions.headers} : this._defaultHeaders;
    }

    /**
     * Announces a [cosignature transaction](https://nemtech.github.io/concepts/aggregate-transaction.html#cosignature-transaction) to the network.
     * @summary Announce a cosignature transaction
     * @param cosignature 
     */
    public async announceCosignatureTransaction (cosignature: Cosignature, reqOptions?:RequestOptions) : Promise<AnnounceTransactionResponse> {
        const localVarPath = '/transactions/cosignature';

        // verify required parameter 'cosignature' is not null or undefined
        if (cosignature === null || cosignature === undefined) {
            throw new Error('Required parameter cosignature was null or undefined when calling announceCosignatureTransaction.');
        }

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'PUT',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json',
            data: ObjectSerializer.serialize(cosignature, "Cosignature")
        };

        return new Promise<AnnounceTransactionResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "AnnounceTransactionInfoDTO");
                    if (response.status && response.status >= 200 && response.status <= 299) {
                        resolve({ response: response, body: body });
                    } else {
                        reject(response);
                    }
                },
                (error: AxiosError ) => {
                    reject(error);
                }
            );
        });
    }
    /**
     * Announces an [aggregate bonded transaction](https://nemtech.github.io/concepts/aggregate-transaction.html#aggregate-bonded) to the network.
     * @summary Announce an aggregate bonded transaction
     * @param transactionPayload 
     */
    public async announcePartialTransaction (transactionPayload: TransactionPayload, reqOptions?:RequestOptions) : Promise<AnnounceTransactionResponse> {
        const localVarPath = '/transactions/partial';

        // verify required parameter 'transactionPayload' is not null or undefined
        if (transactionPayload === null || transactionPayload === undefined) {
            throw new Error('Required parameter transactionPayload was null or undefined when calling announcePartialTransaction.');
        }

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'PUT',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json',
            data: ObjectSerializer.serialize(transactionPayload, "TransactionPayload")
        };

        return new Promise<AnnounceTransactionResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "AnnounceTransactionInfoDTO");
                    if (response.status && response.status >= 200 && response.status <= 299) {
                        resolve({ response: response, body: body });
                    } else {
                            reject(response);
                    }
                },
                (error: AxiosError ) => {
                    reject(error);
                }
            );
        });
    }
    /**
     * Announces a transaction to the network. It is recommended to use the NEM2-SDK to announce transactions as they should be [serialized](https://nemtech.github.io/concepts/transaction.html#defining-a-transaction).
     * @summary Announce a new transaction
     * @param transactionPayload 
     */
    public async announceTransaction (transactionPayload: TransactionPayload, reqOptions?:RequestOptions) : Promise<AnnounceTransactionResponse> {
        const localVarPath = '/transactions';

        // verify required parameter 'transactionPayload' is not null or undefined
        if (transactionPayload === null || transactionPayload === undefined) {
            throw new Error('Required parameter transactionPayload was null or undefined when calling announceTransaction.');
        }

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'PUT',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json',
            data: ObjectSerializer.serialize(transactionPayload, "TransactionPayload")
        };

        return new Promise<AnnounceTransactionResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "AnnounceTransactionInfoDTO");
                    if (response.status && response.status >= 200 && response.status <= 299) {
                        resolve({ response: response, body: body });
                    } else {
                            reject(response);
                    }
                },
                (error: AxiosError ) => {
                    reject(error);
                }
            );
        });
    }
    /**
     * Returns transaction information given a transactionId or hash.
     * @summary Get transaction information
     * @param transactionId The transaction id or hash.
     */
    public async getTransaction (transactionId: string, reqOptions?:RequestOptions) : Promise<TransactionInfoResponse> {
        const localVarPath = '/transactions/confirmed/{transactionId}'
            .replace('{' + 'transactionId' + '}', encodeURIComponent(String(transactionId)));
        let localVarQueryParameters: any = {};

        // verify required parameter 'transactionId' is not null or undefined
        if (transactionId === null || transactionId === undefined) {
            throw new Error('Required parameter transactionId was null or undefined when calling getTransaction.');
        }

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'GET',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json',
            params: localVarQueryParameters
        };

        return new Promise<TransactionInfoResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "TransactionInfoDTO");
                    if (response.status && response.status >= 200 && response.status <= 299) {
                        resolve({ response: response, body: body });
                    } else {
                            reject(response);
                    }
                },
                (error: AxiosError ) => {
                    reject(error);
                }
            );
        });
    }
    /**
     * Returns the transaction status for a given hash.
     * @summary Get transaction status
     * @param hash The transaction hash.
     */
    public async getTransactionStatus (hash: string, reqOptions?:RequestOptions) : Promise<TransactionStatusResponse> {
        const localVarPath = '/transactionStatus/{hash}'
            .replace('{' + 'hash' + '}', encodeURIComponent(String(hash)));

        // verify required parameter 'hash' is not null or undefined
        if (hash === null || hash === undefined) {
            throw new Error('Required parameter hash was null or undefined when calling getTransactionStatus.');
        }

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'GET',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json'
        };

        return new Promise<TransactionStatusResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "TransactionStatusDTO");
                    if (response.status && response.status >= 200 && response.status <= 299) {
                        resolve({ response: response, body: body });
                    } else {
                            reject(response);
                    }
                },
                (error: AxiosError ) => {
                    reject(error);
                }
            );
        });
    }
    /**
     * Returns transactions information for a given array of transactionIds.
     * @summary Get transactions information
     * @param transactionIds 
     */
    public async getTransactions (transactionIds: TransactionIds, groupType: string, reqOptions?:RequestOptions) : Promise<TransactionsInfoResponse> {
        const localVarPath = '/transactions/{group}'
            .replace('{' + 'group' + '}', encodeURIComponent(String(groupType)));

        // verify required parameter 'transactionIds' is not null or undefined
        if (transactionIds === null || transactionIds === undefined) {
            throw new Error('Required parameter transactionIds was null or undefined when calling getTransactions.');
        }

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'POST',
            headers:requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json',
            data: ObjectSerializer.serialize(transactionIds, "transactionIds")
        };

        return new Promise<TransactionsInfoResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "Array<TransactionInfoDTO>");
                    if (response.status && response.status >= 200 && response.status <= 299) {
                        resolve({ response: response, body: body });
                    } else {
                            reject(response);
                    }
                },
                (error: AxiosError ) => {
                    reject(error);
                }
            );
        });
    }

    /**
     * Returns transactions count separate by type for a given array of transactionTypes.
     * @summary Get transactionTypes count
     * @param transactionTypes 
     */
     public async getTransactionsCount (transactionTypes: TransactionTypes, groupType: string, reqOptions?:RequestOptions) : Promise<{ response: AxiosResponse; body: Array<TransactionCountDTO>;  }> {
        const localVarPath = '/transactions/count';

        // verify required parameter 'transactionIds' is not null or undefined
        if (transactionTypes === null || transactionTypes === undefined) {
            throw new Error('Required parameter transactionTypes was null or undefined when calling getTransactionsCount.');
        }

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'POST',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json',
            data: ObjectSerializer.serialize(transactionTypes, "transactionTypes")
        };

        return new Promise<{ response: AxiosResponse; body: Array<TransactionCountDTO>;  }>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "Array<TransactionCountDTO>");
                    if (response.status && response.status >= 200 && response.status <= 299) {
                        resolve({ response: response, body: body });
                    } else {
                        reject(response);
                    }
                },
                (error: AxiosError ) => {
                    reject(error);
                }
            );
        });
    }
    /**
     * Returns an array of transaction statuses for a given array of transaction hashes.
     * @summary Get transactions status.
     * @param transactionHashes 
     */
    public async getTransactionsStatuses (transactionHashes: TransactionHashes, reqOptions?:RequestOptions) : Promise<TransactionsStatusResponse> {
        const localVarPath = '/transactionStatus';

        // verify required parameter 'transactionHashes' is not null or undefined
        if (transactionHashes === null || transactionHashes === undefined) {
            throw new Error('Required parameter transactionHashes was null or undefined when calling getTransactionsStatuses.');
        }

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'POST',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json',
            data: ObjectSerializer.serialize(transactionHashes, "hashes")
        };

        return new Promise<TransactionsStatusResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "Array<TransactionStatusDTO>");
                    if (response.status && response.status >= 200 && response.status <= 299) {
                        resolve({ response: response, body: body });
                    } else {
                            reject(response);
                    }
                },
                (error: AxiosError ) => {
                    reject(error);
                }
            );
        });
    }

    /**
     * Returns transactions information for a given array of transactionIds.
     * @summary Get transactions information
     * @param transactionId
     */
     public async searchTransaction(searchType: string, txnHash: string, reqOptions?:RequestOptions) : Promise<TransactionInfoResponse> {
        const localVarPath = '/transactions/{searchType}/{txnHash}'
                .replace('{' + 'searchType' + '}', encodeURIComponent(String(searchType)))
                .replace('{' + 'txnHash' + '}', encodeURIComponent(String(txnHash)))
        let localVarQueryParameters: any = {};

        // verify required parameter 'transactionIds' is not null or undefined
        if (searchType === null || searchType === undefined) {
            throw new Error('Required parameter searchType was null or undefined when calling searchTransaction.');
        }
        
        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'GET',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json',
            params: localVarQueryParameters
        };

        return new Promise<TransactionInfoResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "TransactionInfoDTO");
                    if (response.status && response.status >= 200 && response.status <= 299) {
                        resolve({ response: response, body: body });
                    } else {
                            reject(response);
                    }
                },
                (error: AxiosError ) => {
                    reject(error);
                }
            );
        });
    }

    /**
     * Returns transactions information for a given group and query params.
     * @summary Get transactions information
     * @param searchType - transaction gtoup type
     * @param queryParams - transaction query params 
     */
     public async searchTransactions (searchType: string, queryParams?: TransactionQueryParams, reqOptions?:RequestOptions) : Promise<TransactionSearchResponse> {
        const localVarPath = '/transactions/{searchType}'
                .replace('{' + 'searchType' + '}', encodeURIComponent(String(searchType)));
        
        // verify required parameter 'transactionIds' is not null or undefined
        if (searchType === null || searchType === undefined) {
            throw new Error('Required parameter searchType was null or undefined when calling searchTransactions.');
        }

        let localVarQueryParameters: any = {};

        if(queryParams){
            localVarQueryParameters = queryParams.buildQueryParams();
        }

        let requestHeaders = this.combineHeaders(reqOptions);
        
        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'GET',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json',
            params: localVarQueryParameters
        };

        return new Promise<TransactionSearchResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "TransactionSearchDTO");
                    if (response.status && response.status >= 200 && response.status <= 299) {
                        resolve({ response: response, body: body });
                    } else {
                            reject(response);
                    }
                },
                (error: AxiosError ) => {
                    reject(error);
                }
            );
        });
    }
}
