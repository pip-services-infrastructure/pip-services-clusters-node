import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';
import { DataPage } from 'pip-services-commons-node';
import { IGetter } from 'pip-services-data-node';
import { IWriter } from 'pip-services-data-node';

import { ClusterV1 } from '../data/version1/ClusterV1';

export interface IClustersPersistence extends IGetter<ClusterV1, string>, IWriter<ClusterV1, string> {
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, 
        callback: (err: any, page: DataPage<ClusterV1>) => void): void;

    getOneById(correlationId: string, id: string, 
        callback: (err: any, item: ClusterV1) => void): void;

    create(correlationId: string, item: ClusterV1, 
        callback: (err: any, item: ClusterV1) => void): void;

    update(correlationId: string, item: ClusterV1, 
        callback: (err: any, item: ClusterV1) => void): void;

    deleteById(correlationId: string, id: string,
        callback: (err: any, item: ClusterV1) => void): void;
}
