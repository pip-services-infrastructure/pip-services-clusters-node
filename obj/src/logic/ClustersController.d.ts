import { ConfigParams } from 'pip-services-commons-node';
import { IConfigurable } from 'pip-services-commons-node';
import { IReferences } from 'pip-services-commons-node';
import { IReferenceable } from 'pip-services-commons-node';
import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';
import { DataPage } from 'pip-services-commons-node';
import { ICommandable } from 'pip-services-commons-node';
import { CommandSet } from 'pip-services-commons-node';
import { ClusterV1 } from '../data/version1/ClusterV1';
import { IClustersController } from './IClustersController';
export declare class ClustersController implements IConfigurable, IReferenceable, ICommandable, IClustersController {
    private static _defaultConfig;
    private _dependencyResolver;
    private _persistence;
    private _commandSet;
    configure(config: ConfigParams): void;
    setReferences(references: IReferences): void;
    getCommandSet(): CommandSet;
    getClusters(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<ClusterV1>) => void): void;
    getClusterById(correlationId: string, id: string, callback: (err: any, cluster: ClusterV1) => void): void;
    createCluster(correlationId: string, cluster: ClusterV1, callback: (err: any, cluster: ClusterV1) => void): void;
    updateCluster(correlationId: string, cluster: ClusterV1, callback: (err: any, cluster: ClusterV1) => void): void;
    deleteClusterById(correlationId: string, id: string, callback: (err: any, cluster: ClusterV1) => void): void;
    addTenant(correlationId: string, tenantId: string, callback: (err: any, cluster: ClusterV1) => void): void;
    removeTenant(correlationId: string, tenantId: string, callback: (err: any, cluster: ClusterV1) => void): void;
}
