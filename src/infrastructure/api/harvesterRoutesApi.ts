/**
 * Sirius REST API Reference
 * No description provided (https://bcdocs.xpxsirius.io/endpoints/v0.9.0/#tag/Harvester-routes) * 
 */

import axios from 'axios';
import {AxiosRequestConfig, AxiosResponse, AxiosError} from 'axios';

/* tslint:disable:no-unused-locals */
import { InlineHarvesterInfoDTO } from '../model/inlineHarvesterInfoDTO';
import { HarvesterSearchDTO } from '../model/harvesterSearchDTO';
import { PaginationQueryParams } from '../PaginationQueryParams';
import { RequestOptions } from '../RequestOptions';

import { ObjectSerializer } from '../model/models';

export interface HarvesterInfoResponse{ 
    response: AxiosResponse; 
    body: InlineHarvesterInfoDTO[];  
}

export interface HarvesterSearchResponse{ 
    response: AxiosResponse; 
    body: HarvesterSearchDTO;  
}

let defaultBasePath = 'http://localhost:3000';

export class HarvesterRoutesApi {
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
     * Get the harvesting harvester from an account.
     * @param accountId The accountId (public key/address) in string.
     */
    public async getAccountHarvestingHarvesterInfo (accountId: string, reqOptions?:RequestOptions) : Promise<HarvesterInfoResponse> {
        const localVarPath = '/account/{accountId}/harvesting'
            .replace('{' + 'accountId' + '}', encodeURIComponent(accountId));

        // verify required parameter 'accountId' is not null or undefined
        if (accountId === null || accountId === undefined) {
            throw new Error('Required parameter accountId was null or undefined when calling getAccountHarvestingHarvester.');
        }

        let requestHeaders = this.combineHeaders(reqOptions);

        let localVarRequestOptions: AxiosRequestConfig = {
            method: 'GET',
            headers: requestHeaders,
            url: localVarPath,
            baseURL: this.basePath,
            responseType: 'json'
        };

        return new Promise<HarvesterInfoResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "Array<InlineHarvesterInfoDTO>");
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
     * Search harvesters.
     * @summary Search harvester based on query params
     * @param paginationQueryParams search filter
     */
    public async searchHarvesters (paginationQueryParams?: PaginationQueryParams, reqOptions?:RequestOptions) : Promise<HarvesterSearchResponse> {
        const localVarPath = '/harvesters';

        let localVarQueryParameters: any = {};

        if(paginationQueryParams){
            localVarQueryParameters = paginationQueryParams.buildQueryParams();
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

        return new Promise<HarvesterSearchResponse>((resolve, reject) => {
            axios(localVarRequestOptions).then(
                (response)=>{
                    let body = ObjectSerializer.deserialize(response.data, "HarvesterSearchDTO");
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
