/*
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

import {Observable} from 'rxjs';
import {AccountInfo} from '../model/account/AccountInfo';
import {Address} from '../model/account/Address';
import {MultisigAccountGraphInfo} from '../model/account/MultisigAccountGraphInfo';
import {MultisigAccountInfo} from '../model/account/MultisigAccountInfo';
import {PublicAccount} from '../model/account/PublicAccount';
import {AggregateTransaction} from '../model/transaction/AggregateTransaction';
import {Transaction} from '../model/transaction/Transaction';
import {TransactionSearch} from '../model/transaction/TransactionSearch';
import {TransactionQueryParams} from './TransactionQueryParams';
import {AccountRestrictionsInfo} from "../model/account/AccountRestrictionsInfo";
import { AccountNames } from '../model/account/AccountNames';

/**
 * Account interface repository.
 *
 * @since 1.0
 */
export interface AccountRepository {

    /**
     * Gets an AccountInfo for an account.
     * @param address Address
     * @returns Observable<AccountInfo>
     */
    getAccountInfo(address: Address): Observable<AccountInfo>;

    /**
     * Gets AccountsInfo for different accounts.
     * @param addresses List of Address
     * @returns Observable<AccountInfo[]>
     */
    getAccountsInfo(addresses: Address[]): Observable<AccountInfo[]>;

    /**
     * Get readable names for a set of accountIds.
     * Returns friendly names for accounts.
     * @param accountIds List of Address
     * @return Observable<AccountNames>
     */
    getAccountsNames(accountIds: Address[]): Observable<AccountNames[]>;

    /**
     * Gets Account restrictions.
     * @param publicAccount public account
     * @returns Observable<AccountRestrictionsInfo>
     */
    getAccountRestrictions(address: Address): Observable<AccountRestrictionsInfo>;

    /**
     * Gets Account restrictions.
     * @param address list of addresses
     * @returns Observable<AccountRestrictionsInfo[]>
     */
    getAccountRestrictionsFromAccounts(addresses: Address[]): Observable<AccountRestrictionsInfo[]>;

    /**
     * Gets a MultisigAccountInfo for an account.
     * @param address - User address
     * @returns Observable<MultisigAccountInfo>
     */
    getMultisigAccountInfo(address: Address): Observable<MultisigAccountInfo>;

    /**
     * Gets a MultisigAccountGraphInfo for an account.
     * @param address - User address
     * @returns Observable<MultisigAccountGraphInfo>
     */
    getMultisigAccountGraphInfo(address: Address): Observable<MultisigAccountGraphInfo>;

    /**
     * Gets an array of confirmed transactions for which an account is signer or receiver.
     * @param publicAccount - User public account
     * @param txnQueryParam - (Optional) Transaction Query Params
     * @returns Observable<Transaction[]>
     */
    transactions(publicAccount: PublicAccount,
                 txnQueryParams?: TransactionQueryParams): Observable<Transaction[]>;

    /**
     * Gets an array of confirmed transactions for which an account is signer or receiver.
     * @param publicAccount - User public account
     * @param txnQueryParam - (Optional) Transaction Query Params
     * @returns Observable<TransactionSearch>
     */
     transactionsWithPagination(publicAccount: PublicAccount,
        txnQueryParam?: TransactionQueryParams): Observable<TransactionSearch>;

    /**
     * Gets an array of transactions for which an account is the recipient of a transaction.
     * A transaction is said to be incoming with respect to an account if the account is the recipient of a transaction.
     * @param publicAccount - User public account
     * @param txnQueryParam - (Optional) Transaction Query Params
     * @returns Observable<Transaction[]>
     */
    incomingTransactions(accountId: Address | PublicAccount,
                         txnQueryParam?: TransactionQueryParams): Observable<Transaction[]>;

    /**
     * Gets an array of transactions for which an account is the recipient of a transaction.
     * A transaction is said to be incoming with respect to an account if the account is the recipient of a transaction.
     * @param publicAccount - User public account
     * @param txnQueryParam - (Optional) Transaction Query Params
     * @returns Observable<TransactionSearch>
     */
     incomingTransactionsWithPagination(accountId: Address | PublicAccount,
        txnQueryParam?: TransactionQueryParams): Observable<TransactionSearch>;

    /**
     * Gets an array of transactions for which an account is the sender a transaction.
     * A transaction is said to be outgoing with respect to an account if the account is the sender of a transaction.
     * @param publicAccount - User public account
     * @param txnQueryParam - (Optional) Transaction Query Params
     * @returns Observable<Transaction[]>
     */
    outgoingTransactions(publicAccount: PublicAccount,
                         txnQueryParam?: TransactionQueryParams): Observable<Transaction[]>;

    /**
     * Gets an array of transactions for which an account is the sender a transaction.
     * A transaction is said to be outgoing with respect to an account if the account is the sender of a transaction.
     * @param publicAccount - User public account
     * @param txnQueryParam - (Optional) Transaction Query Params
     * @returns Observable<TransactionSearch>
     */
     outgoingTransactionsWithPagination(publicAccount: PublicAccount,
        txnQueryParam?: TransactionQueryParams): Observable<TransactionSearch>;

    /**
     * Gets the array of transactions for which an account is the sender or receiver and which have not yet been included in a block.
     * Unconfirmed transactions are those transactions that have not yet been included in a block.
     * Unconfirmed transactions are not guaranteed to be included in any block.
     * @param publicAccount - User public account
     * @param txnQueryParam - (Optional) Transaction Query Params
     * @returns Observable<Transaction[]>
     */
    unconfirmedTransactions(publicAccount: PublicAccount,
                            txnQueryParam?: TransactionQueryParams): Observable<Transaction[]>;

    /**
     * Gets the array of transactions for which an account is the sender or receiver and which have not yet been included in a block.
     * Unconfirmed transactions are those transactions that have not yet been included in a block.
     * Unconfirmed transactions are not guaranteed to be included in any block.
     * @param publicAccount - User public account
     * @param txnQueryParam - (Optional) Transaction Query Params
     * @returns Observable<TransactionSearch>
     */
     unconfirmedTransactionsWithPagination(publicAccount: PublicAccount,
        txnQueryParam?: TransactionQueryParams): Observable<TransactionSearch>;

    /**
     * Gets an array of transactions for which an account is the sender or has sign the transaction.
     * A transaction is said to be aggregate bonded with respect to an account if there are missing signatures.
     * @param publicAccount - User public account
     * @param txnQueryParam - (Optional) Transaction Query Params
     * @returns Observable<AggregateTransaction[]>
     */
    aggregateBondedTransactions(publicAccount: PublicAccount,
                                txnQueryParam?: TransactionQueryParams): Observable<AggregateTransaction[]>;
}
