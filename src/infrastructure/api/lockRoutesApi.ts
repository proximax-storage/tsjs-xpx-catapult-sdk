/**
 * Sirius REST API Reference
 * No description provided (https://bcdocs.xpxsirius.io/endpoints/v0.9.0/#tag/Lock-routes) * 
 */

import axios from 'axios';
import {AxiosRequestConfig, AxiosResponse, AxiosError} from 'axios';

/* tslint:disable:no-unused-locals */
import { HashLockWithMeta } from '../model/hashLockWithMeta';
import { SecretLockWithMeta } from '../model/secretLockWithMeta';

import { ObjectSerializer } from '../model/models';
import { RequestOptions } from '../RequestOptions';

import { HttpError, RequestFile } from './apis';

export interface HashLockResponse{ 
    response: AxiosResponse; 
    body: HashLockWithMeta;  
}

export interface HashLocksResponse{ 
    response: AxiosResponse; 
    body: HashLockWithMeta[];  
}

export interface SecretLockResponse{ 
    response: AxiosResponse; 
    body: SecretLockWithMeta;  
}

export interface SecretLocksResponse{ 
    response: AxiosResponse; 
    body: SecretLockWithMeta[];  
}

let defaultBasePath = 'http://localhost:3000';

export enum LockRoutesApiApiKeys {
}

export class LockRoutesApi {
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
     * Get account lock hash.
     * @summary Get account lock hash
     * @param accountId The public key or address of the account.
     */
    public async getAccountLockHash (accountId: string, reqOptions?:RequestOptions) : Promise<HashLocksResponse> {
        const localVarPath = '/account/{accountId}/lock/hash'
            .replace('{' + 'accountId' + '}', encodeURIComponent(String(accountId)));

        // verify required parameter 'accountId' is not null or undefined
        if (accountId === null || accountId === undefined) {
            throw new Error('Required parameter accountId was null or undefined when calling getAccountLockHash.');
        }

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'GET',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json'
        };

        return new Promise<HashLocksResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "Array<HashLockWithMeta>");
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
     * Get account lock secret.
     * @summary Get account lock secret
     * @param accountId The public key or address of the account.
     */
    public async getAccountLocksecret (accountId: string, reqOptions?:RequestOptions) : Promise<SecretLocksResponse> {
        const localVarPath = '/account/{accountId}/lock/secret'
            .replace('{' + 'accountId' + '}', encodeURIComponent(String(accountId)));

        // verify required parameter 'accountId' is not null or undefined
        if (accountId === null || accountId === undefined) {
            throw new Error('Required parameter accountId was null or undefined when calling getAccountLocksecret.');
        }

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'GET',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json'
        };

        return new Promise<SecretLocksResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "Array<SecretLockWithMeta>");
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
     * Get composite hash.
     * @summary Get composite hash
     * @param compositeHash The composite hash of account addres and secret.
     */
    public async getCompositeHash (compositeHash: string, reqOptions?:RequestOptions) : Promise<SecretLockResponse> {
        const localVarPath = '/lock/compositeHash/{compositeHash}'
            .replace('{' + 'compositeHash' + '}', encodeURIComponent(String(compositeHash)));

        // verify required parameter 'compositeHash' is not null or undefined
        if (compositeHash === null || compositeHash === undefined) {
            throw new Error('Required parameter compositeHash was null or undefined when calling getCompositeHash.');
        }

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'GET',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json'
        };

        return new Promise<SecretLockResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "SecretLockWithMeta");
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
     * Get lock hash.
     * @summary Get lock hash
     * @param hash The hash.
     */
    public async getLockHash (hash: string, reqOptions?:RequestOptions) : Promise<HashLockResponse> {
        const localVarPath = '/lock/hash/{hash}'
            .replace('{' + 'hash' + '}', encodeURIComponent(String(hash)));

        // verify required parameter 'hash' is not null or undefined
        if (hash === null || hash === undefined) {
            throw new Error('Required parameter hash was null or undefined when calling getLockHash.');
        }

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'GET',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json'
        };

        return new Promise<HashLockResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "HashLockWithMeta");
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
     * Get secret hash.
     * @summary Get secret hash
     * @param secret The proof hashed.
     */
    public async getSecretHash (secret: string, reqOptions?:RequestOptions) : Promise<{ response: AxiosResponse; body: SecretLockWithMeta;  }> {
        const localVarPath = '/lock/secret/{secret}'
            .replace('{' + 'secret' + '}', encodeURIComponent(String(secret)));

        // verify required parameter 'secret' is not null or undefined
        if (secret === null || secret === undefined) {
            throw new Error('Required parameter secret was null or undefined when calling getSecretHash.');
        }

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'GET',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json'
        };

        return new Promise<{ response: AxiosResponse; body: SecretLockWithMeta;  }>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "SecretLockWithMeta");
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
