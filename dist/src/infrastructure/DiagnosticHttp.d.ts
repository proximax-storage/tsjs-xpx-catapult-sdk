import { Observable } from 'rxjs';
import { BlockchainStorageInfo } from '../model/blockchain/BlockchainStorageInfo';
import { ServerInfo } from '../model/diagnostic/ServerInfo';
import { DiagnosticRepository } from './DiagnosticRepository';
import { Http } from './Http';
import { Authentication } from './model/models';
/**
 * Diagnostic http repository.
 *
 * @since 1.0
 */
export declare class DiagnosticHttp extends Http implements DiagnosticRepository {
    /**
     * Constructor
     * @param url
     */
    constructor(url: string, auth?: Authentication, headers?: {});
    /**
     * Gets blockchain storage info.
     * @returns Observable<BlockchainStorageInfo>
     */
    getDiagnosticStorage(): Observable<BlockchainStorageInfo>;
    /**
     * Gets blockchain server info.
     * @returns Observable<Server>
     */
    getServerInfo(): Observable<ServerInfo>;
}
