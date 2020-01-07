let _ = require('lodash');
let async = require('async');
let geojson = require('geojson-utils');

import { ConfigParams } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';
import { DependencyResolver } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { ICommandable } from 'pip-services3-commons-node';
import { CommandSet } from 'pip-services3-commons-node';
import { IdGenerator } from 'pip-services3-commons-node';
import { RandomInteger } from 'pip-services3-commons-node';
import { NotFoundException } from 'pip-services3-commons-node';
import { BadRequestException } from 'pip-services3-commons-node';

import { ClusterV1 } from '../data/version1/ClusterV1';
import { IClustersPersistence } from '../persistence/IClustersPersistence';
import { IClustersController } from './IClustersController';
import { ClustersCommandSet } from './ClustersCommandSet';

export class ClustersController implements IConfigurable, IReferenceable, ICommandable, IClustersController {
    private static _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        'dependencies.persistence', 'pip-services-clusters:persistence:*:*:1.0'
    );

    private _dependencyResolver: DependencyResolver = new DependencyResolver(ClustersController._defaultConfig);
    private _persistence: IClustersPersistence;
    private _commandSet: ClustersCommandSet;

    public configure(config: ConfigParams): void {
        this._dependencyResolver.configure(config);
    }

    public setReferences(references: IReferences): void {
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired<IClustersPersistence>('persistence');
    }

    public getCommandSet(): CommandSet {
        if (this._commandSet == null)
            this._commandSet = new ClustersCommandSet(this);
        return this._commandSet;
    }

    public getClusters(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<ClusterV1>) => void): void {
        this._persistence.getPageByFilter(correlationId, filter, paging, callback);
    }

    public getClusterById(correlationId: string, id: string,
        callback: (err: any, cluster: ClusterV1) => void): void {
        this._persistence.getOneById(correlationId, id, callback);
    }

    public createCluster(correlationId: string, cluster: ClusterV1,
        callback: (err: any, cluster: ClusterV1) => void): void {
        let newCluster: ClusterV1;

        cluster.id = cluster.id || IdGenerator.nextLong();
        cluster.update_time = cluster.update_time || new Date();
        cluster.active = cluster.active != null ? cluster.active : true;
        cluster.open = cluster.max_tenant_count > cluster.tenants_count;

        this._persistence.create(correlationId, cluster, callback);
    }

    public updateCluster(correlationId: string, cluster: ClusterV1,
        callback: (err: any, cluster: ClusterV1) => void): void {
        cluster.open = cluster.max_tenant_count > cluster.tenants_count;
        this._persistence.update(correlationId, cluster, callback);
    }

    public deleteClusterById(correlationId: string, id: string,
        callback: (err: any, cluster: ClusterV1) => void): void {
        let oldCluster: ClusterV1 = null;
        let newCluster: ClusterV1;

        // Todo: Implement logical deletion
        async.series([
            // Get cluster
            (callback) => {
                this._persistence.getOneById(correlationId, id, (err, data) => {
                    oldCluster = data;
                    callback(err);
                });
            },
            (callback) => {
                this._persistence.deleteById(correlationId, id, (err, data) => {
                    oldCluster = data;
                    callback(err);
                });
            }
        ], (err) => {
            callback(err, newCluster);
        });
    }

    public addTenant(correlationId: string, tenantId: string, 
        callback: (err: any, cluster: ClusterV1) => void): void {

        let cluster: ClusterV1 = null;

        async.series([
            // Find an open cluster
            (callback) => {
                let filter = FilterParams.fromTuples(
                    'active', true,
                    'open', true
                );

                this._persistence.getPageByFilter(correlationId, filter, null, (err, page) => {
                    if (err != null || page == null) {
                        callback(err);
                        return;
                    }

                    if (page.data && page.data.length > 0)
                        cluster = page.data[0];
                    
                    callback(err);
                });
            },
            // Add tenant to a cluster
            (callback) => {
                if (cluster == null) {
                    callback(null);
                    return;
                }

                cluster.active_tenants = cluster.active_tenants || [];
                cluster.active_tenants.push(tenantId);
                cluster.tenants_count++;
                cluster.open = cluster.max_tenant_count > cluster.tenants_count;

                this._persistence.update(correlationId, cluster, callback);
            }
        ], (err) => {
            callback(err, err == null ? cluster : null);
        });
    }

    public removeTenant(correlationId: string, tenantId: string, 
        callback: (err: any, cluster: ClusterV1) => void): void {

        let cluster: ClusterV1 = null;

        async.series([
            // Find a cluster with tenant
            (callback) => {
                let filter = FilterParams.fromTuples(
                    'tenant_id', tenantId
                );

                this._persistence.getPageByFilter(correlationId, filter, null, (err, page) => {
                    if (err != null || page == null) {
                        callback(err);
                        return;
                    }

                    if (page.data && page.data.length > 0)
                        cluster = page.data[0];
                    
                    callback(err);
                });
            },
            // Remove tenant from a cluster
            (callback) => {
                if (cluster == null) {
                    callback(null);
                    return;
                }

                cluster.active_tenants = _.filter(cluster.active_tenants, s => s != tenantId);
                cluster.tenants_count--;
                cluster.open = cluster.max_tenant_count > cluster.tenants_count;

                this._persistence.update(correlationId, cluster, callback);
            }
        ], (err) => {
            callback(err, err == null ? cluster : null);
        });
    }    
}
