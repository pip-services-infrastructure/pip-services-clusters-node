import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableMemoryPersistence } from 'pip-services3-data-node';
import { ClusterV1 } from '../data/version1/ClusterV1';
import { IClustersPersistence } from './IClustersPersistence';
export declare class ClustersMemoryPersistence extends IdentifiableMemoryPersistence<ClusterV1, string> implements IClustersPersistence {
    constructor();
    private matchString;
    private matchSearch;
    private contains;
    private composeFilter;
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<ClusterV1>) => void): void;
}
