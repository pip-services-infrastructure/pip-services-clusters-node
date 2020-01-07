import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-node';
import { ClusterV1 } from '../data/version1/ClusterV1';
import { IClustersPersistence } from './IClustersPersistence';
export declare class ClustersMongoDbPersistence extends IdentifiableMongoDbPersistence<ClusterV1, string> implements IClustersPersistence {
    constructor();
    private composeFilter;
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<ClusterV1>) => void): void;
}
