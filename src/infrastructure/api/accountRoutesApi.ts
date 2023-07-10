/**
 * Sirius REST API Reference
 * No description provided (https://bcdocs.xpxsirius.io/endpoints/v0.9.0/#tag/Storage-routes) * 
 */

import axios from 'axios';
import {AxiosRequestConfig, AxiosResponse, AxiosError} from 'axios';

/* tslint:disable:no-unused-locals */
import { AccountIds } from '../model/accountIds';
import { AccountInfoDTO } from '../model/accountInfoDTO';
import { AccountNamesDTO } from '../model/accountNamesDTO';
import { AccountPropertiesInfoDTO } from '../model/accountPropertiesInfoDTO';
import { MultisigAccountGraphInfoDTO } from '../model/multisigAccountGraphInfoDTO';
import { MultisigAccountInfoDTO } from '../model/multisigAccountInfoDTO';
import { TransactionSearchDTO } from '../model/transactionSearchDTO';

import { ObjectSerializer} from '../model/models';
import {TransactionQueryParams} from '../TransactionQueryParams';
import { RequestOptions } from '../RequestOptions';
import { HttpError, RequestFile, TransactionSearchResponse } from './apis';

export interface AccountInfoResponse{
    response: AxiosResponse;
    body: AccountInfoDTO;
}

export interface AccountsInfoResponse{
    response: AxiosResponse;
    body: AccountInfoDTO[];
}

export interface MultisigAccountInfoResponse{
    response: AxiosResponse;
    body: MultisigAccountInfoDTO;
}

export interface MultisigAccountGraphInfoResponse{
    response: AxiosResponse;
    body: MultisigAccountGraphInfoDTO[];
}

export interface AccountPropertiesInfoResponse{
    response: AxiosResponse;
    body: AccountPropertiesInfoDTO;
}

export interface AccountsPropertiesInfoResponse{
    response: AxiosResponse;
    body: AccountPropertiesInfoDTO[];
}

export interface AccountsNamesResponse{
    response: AxiosResponse;
    body: AccountNamesDTO[];
}

let defaultBasePath = 'http://localhost:3000';

export enum AccountRoutesApiApiKeys {
}

export class AccountRoutesApi {
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
     * Returns the account information.
     * @summary Get account information
     * @param accountId The public key or address of the account.
     */
    public async getAccountInfo (accountId: string, reqOptions?:RequestOptions) : Promise<AccountInfoResponse> {
        const localVarPath = '/account/{accountId}'
            .replace('{' + 'accountId' + '}', encodeURIComponent(String(accountId)));

        // verify required parameter 'accountId' is not null or undefined
        if (accountId === null || accountId === undefined) {
            throw new Error('Required parameter accountId was null or undefined when calling getAccountInfo.');
        }

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'GET',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json'
        };

        return new Promise<AccountInfoResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "AccountInfoDTO");
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
     * Returns the [multisig account](https://nemtech.github.io/concepts/multisig-account.html) information.
     * @summary Get multisig account information
     * @param accountId The public key or address of the account.
     */
    public async getAccountMultisig (accountId: string, reqOptions?:RequestOptions) : Promise<MultisigAccountInfoResponse> {
        const localVarPath = '/account/{accountId}/multisig'
            .replace('{' + 'accountId' + '}', encodeURIComponent(String(accountId)));

        // verify required parameter 'accountId' is not null or undefined
        if (accountId === null || accountId === undefined) {
            throw new Error('Required parameter accountId was null or undefined when calling getAccountMultisig.');
        }

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'GET',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json'
        };

        return new Promise<MultisigAccountInfoResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "MultisigAccountInfoDTO");
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
     * Returns the [multisig account](https://nemtech.github.io/concepts/multisig-account.html) graph.
     * @summary Get multisig account graph information
     * @param accountId The public key or address of the account.
     */
    public async getAccountMultisigGraph (accountId: string, reqOptions?:RequestOptions) : Promise<MultisigAccountGraphInfoResponse> {
        const localVarPath = '/account/{accountId}/multisig/graph'
            .replace('{' + 'accountId' + '}', encodeURIComponent(String(accountId)));

        // verify required parameter 'accountId' is not null or undefined
        if (accountId === null || accountId === undefined) {
            throw new Error('Required parameter accountId was null or undefined when calling getAccountMultisigGraph.');
        }

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'GET',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json'
        };

        return new Promise<MultisigAccountGraphInfoResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "Array<MultisigAccountGraphInfoDTO>");
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
     * Returns the [configurable properties](https://nemtech.github.io/concepts/account-filter.html) for a given account. 
     * @summary Get account configurable properties information
     * @param accountId The public key or address of the account.
     */
    public async getAccountProperties (accountId: string, reqOptions?:RequestOptions) : Promise<AccountPropertiesInfoResponse> {
        const localVarPath = '/account/{accountId}/properties'
            .replace('{' + 'accountId' + '}', encodeURIComponent(String(accountId)));

        // verify required parameter 'accountId' is not null or undefined
        if (accountId === null || accountId === undefined) {
            throw new Error('Required parameter accountId was null or undefined when calling getAccountProperties.');
        }

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'GET',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json'
        };

        return new Promise<AccountPropertiesInfoResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "AccountPropertiesInfoDTO");
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
     * Returns the [configurable properties](https://nemtech.github.io/concepts/account-filter.html) for a given array of addresses. 
     * @summary Get account properties for given array of addresses
     * @param accountIds 
     */
    public async getAccountPropertiesFromAccounts (accountIds: AccountIds, reqOptions?:RequestOptions) : Promise<AccountsPropertiesInfoResponse> {
        const localVarPath = '/account/properties';

        // verify required parameter 'accountIds' is not null or undefined
        if (accountIds === null || accountIds === undefined) {
            throw new Error('Required parameter accountIds was null or undefined when calling getAccountPropertiesFromAccounts.');
        }

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'POST',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json',
            data: ObjectSerializer.serialize(accountIds, "AccountIds")
        };

        return new Promise<AccountsPropertiesInfoResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "Array<AccountPropertiesInfoDTO>");
                    if (response.status && response.status >= 200 && response.status <= 299) {
                        resolve({ response: response, body: body });
                    } else {
                         reject(response);
                         // reject(new HttpError(response, body, response.statusCode)); // keep as backup
                    }
                },
                (error: AxiosError ) => {
                    reject(error);
                }
            );
        });
    }
    /**
     * Returns the account information for an array of accounts.
     * @summary Get accounts information
     * @param accountIds 
     */
    public async getAccountsInfo (accountIds: AccountIds, reqOptions?:RequestOptions) : Promise<AccountsInfoResponse> {
        const localVarPath = '/account';

        // verify required parameter 'accountIds' is not null or undefined
        if (accountIds === null || accountIds === undefined) {
            throw new Error('Required parameter accountIds was null or undefined when calling getAccountsInfo.');
        }

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'POST',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json',
            data: ObjectSerializer.serialize(accountIds, "AccountIds")
        };

        return new Promise<AccountsInfoResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "Array<AccountInfoDTO>");
                    if (response.status && response.status >= 200 && response.status <= 299) {
                        resolve({ response: response, body: body });
                    } else {
                         reject(response);
                         // reject(new HttpError(response, body, response.statusCode)); // keep as backup
                    }
                },
                (error: AxiosError ) => {
                    reject(error);
                }
            );
        });
    }
    /**
     * Returns friendly names for accounts.
     * @summary Get readable names for a set of accountIds.
     * @param accountIds 
     */
    public async getAccountsNames (accountIds: AccountIds, reqOptions?:RequestOptions) : Promise<AccountsNamesResponse> {
        const localVarPath = '/account/names';

        // verify required parameter 'accountIds' is not null or undefined
        if (accountIds === null || accountIds === undefined) {
            throw new Error('Required parameter accountIds was null or undefined when calling getAccountsNames.');
        }

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'POST',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json',
            data: ObjectSerializer.serialize(accountIds, "AccountIds")
        };

        return new Promise<AccountsNamesResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "Array<AccountNamesDTO>");
                    if (response.status && response.status >= 200 && response.status <= 299) {
                        resolve({ response: response, body: body });
                    } else {
                         reject(response);
                         // reject(new HttpError(response, body, response.statusCode)); // keep as backup
                    }
                },
                (error: AxiosError ) => {
                    reject(error);
                }
            );
        });
    }
    /**
     * Gets an array of incoming transactions. A transaction is said to be incoming with respect to an account if the account is the recipient of the transaction. 
     * @summary Get incoming transactions
     * @param plainAddress The public key of the account.
     * @param Transaction Query Params
     * @param ordering The ordering criteria: * -id - Descending order by id. * id - Ascending order by id. 
     */

    public async incomingTransactions (plainAddress: string, transactionQueryParams?: TransactionQueryParams, reqOptions?:RequestOptions) : Promise<TransactionSearchResponse> {
        const localVarPath = '/transactions/confirmed';
        // verify required parameter 'plainAddress' is not null or undefined
        if (plainAddress === null || plainAddress === undefined) {
            throw new Error('Required parameter publicKey was null or undefined when calling incomingTransactions.');
        }

        let localVarQueryParameters: any = {};
        
        if(transactionQueryParams){
            localVarQueryParameters = transactionQueryParams.buildQueryParams();
        }
        localVarQueryParameters["recipientAddress"] = plainAddress;

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
    /**
     * Gets an array of outgoing transactions. A transaction is said to be outgoing with respect to an account if the account is the sender of the transaction.
     * @summary Get outgoing transactions
     * @param publicKey The public key of the account.
     * @param Transaction Query Params
     * @param ordering The ordering criteria: * -id - Descending order by id. * id - Ascending order by id. 
     */
    
    public async outgoingTransactions (publicKey: string, transactionQueryParams?: TransactionQueryParams, reqOptions?:RequestOptions) : Promise<TransactionSearchResponse> {
        const localVarPath = '/transactions/confirmed';
        
        // verify required parameter 'publicKey' is not null or undefined
        if (publicKey === null || publicKey === undefined) {
            throw new Error('Required parameter publicKey was null or undefined when calling outgoingTransactions.');
        }

        let localVarQueryParameters: any = {};

        if(transactionQueryParams){
            localVarQueryParameters = transactionQueryParams.buildQueryParams();
        }
        localVarQueryParameters["signerPublicKey"] = publicKey;

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
    

    /**
     * Gets an array of [aggregate bonded transactions](https://nemtech.github.io/concepts/aggregate-transaction.html) where the account is the sender or requires to cosign the transaction. 
     * @summary Get aggregate bonded transactions information
     * @param plainAddress The address of the account.
     * @param Transaction Query Params
     * @param ordering The ordering criteria. * -id - Descending order by id. * id - Ascending order by id. 
     */

    // toChange
    public async partialTransactions (plainAddress: string, transactionQueryParams?: TransactionQueryParams, reqOptions?:RequestOptions) : Promise<TransactionSearchResponse> {
        const localVarPath = '/transactions/partial';
        
        // verify required parameter 'plainAddress' is not null or undefined
        if (plainAddress === null || plainAddress === undefined) {
            throw new Error('Required parameter publicKey was null or undefined when calling partialTransactions.');
        }
        
        let localVarQueryParameters: any = {};

        if(transactionQueryParams){
            localVarQueryParameters = transactionQueryParams.buildQueryParams();
        }
        localVarQueryParameters["address"] = plainAddress;
        localVarQueryParameters["firstLevel"] = false;

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
    

    /**
     * Gets an array of transactions for which an account is the sender or receiver.
     * @summary Get confirmed transactions
     * @param plainAddress The public key of the account.
     * @param pageSize The number of transactions to return for each request.
     * @param id The transaction id up to which transactions are returned. 
     * @param ordering The ordering criteria: * -id - Descending order by id. * id - Ascending order by id. 
     */

    public async transactions (plainAddress: string, transactionQueryParams?: TransactionQueryParams, reqOptions?:RequestOptions) : Promise<TransactionSearchResponse> {
        const localVarPath = '/transactions/confirmed'

        // verify required parameter 'plainAddress' is not null or undefined
        if (plainAddress === null || plainAddress === undefined) {
            throw new Error('Required parameter address was null or undefined when calling transactions.');
        }

        let localVarQueryParameters: any = {};
        
        if(transactionQueryParams){
            localVarQueryParameters = transactionQueryParams.buildQueryParams();
        }
        localVarQueryParameters["address"] = plainAddress;

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
    /**
     * Gets the array of transactions not included in a block where an account is the sender or receiver. 
     * @summary Get unconfirmed transactions
     * @param plainAddress The address of the account.
     * @param pageSize The number of transactions to return for each request.
     * @param id The transaction id up to which transactions are returned. 
     * @param ordering The ordering criteria. * -id - Descending order by id. * id - Ascending order by id. 
     */

    public async unconfirmedTransactions (plainAddress: string, transactionQueryParams?: TransactionQueryParams, reqOptions?:RequestOptions) : Promise<TransactionSearchResponse> {
        const localVarPath = '/transactions/unconfirmed';
        
        // verify required parameter 'plainAddress' is not null or undefined
        if (plainAddress === null || plainAddress === undefined) {
            throw new Error('Required parameter address was null or undefined when calling unconfirmedTransactions.');
        }

        let localVarQueryParameters: any = {};
        
        if(transactionQueryParams){
            localVarQueryParameters = transactionQueryParams.buildQueryParams();
        }
        localVarQueryParameters["address"] = plainAddress;

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
