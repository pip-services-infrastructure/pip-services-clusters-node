let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';

import { ClusterV1 } from '../../src/data/version1/ClusterV1';

import { IClustersPersistence } from '../../src/persistence/IClustersPersistence';

let CLUSTER1: ClusterV1 = {
    id: '1',
    name: 'Cluster #1',
    type: 'root',
    active: true,
    api_host: 'api.mycluster1.com',
    service_ports: { myservice1: 30001, myservice2: 30002 },
    max_tenants_count: 1,
    tenants_count: 1,
    active_tenants: ['1']
};
let CLUSTER2: ClusterV1 = {
    id: '2',
    name: 'Cluster #2',
    type: 'tenants',
    active: true,
    api_host: 'api.mycluster2.com',
    service_ports: { myservice1: 30001, myservice2: 30002 },
    max_tenants_count: 10,
    tenants_count: 4,
    open: true,
    active_tenants: ['2', '3'],
    inactive_tenants: ['4']
};
let CLUSTER3: ClusterV1 = {
    id: '3',
    name: 'Cluster #3',
    type: 'tenants',
    active: false,
    maintenance: true,
    open: false,
    api_host: 'api.mycluster3.com',
    service_ports: { myservice1: 30001, myservice2: 30002 },
    max_tenants_count: 10,
    tenants_count: 0
};

export class ClustersPersistenceFixture {
    private _persistence: IClustersPersistence;
    
    constructor(persistence) {
        assert.isNotNull(persistence);
        this._persistence = persistence;
    }

    private testCreateClusters(done) {
        async.series([
        // Create one cluster
            (callback) => {
                this._persistence.create(
                    null,
                    CLUSTER1,
                    (err, cluster) => {
                        assert.isNull(err);

                        assert.isObject(cluster);
                        assert.equal(cluster.name, CLUSTER1.name);
                        assert.equal(cluster.type, CLUSTER1.type);
                        assert.equal(cluster.active, CLUSTER1.active);
                        assert.equal(cluster.api_host, CLUSTER1.api_host);

                        callback();
                    }
                );
            },
        // Create another cluster
            (callback) => {
                this._persistence.create(
                    null,
                    CLUSTER2,
                    (err, cluster) => {
                        assert.isNull(err);

                        assert.isObject(cluster);
                        assert.equal(cluster.name, CLUSTER2.name);
                        assert.equal(cluster.type, CLUSTER2.type);
                        assert.equal(cluster.active, CLUSTER2.active);

                        callback();
                    }
                );
            },
        // Create yet another cluster
            (callback) => {
                this._persistence.create(
                    null,
                    CLUSTER3,
                    (err, cluster) => {
                        assert.isNull(err);

                        assert.isObject(cluster);
                        assert.equal(cluster.name, CLUSTER3.name);
                        assert.equal(cluster.type, CLUSTER3.type);
                        assert.equal(cluster.active, CLUSTER3.active);

                        callback();
                    }
                );
            }
        ], done);
    }
                
    public testCrudOperations(done) {
        let cluster1: ClusterV1;

        async.series([
        // Create items
            (callback) => {
                this.testCreateClusters(callback);
            },
        // Get all clusters
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    new FilterParams(),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 3);

                        cluster1 = page.data[0];

                        callback();
                    }
                );
            },
        // Update the cluster
            (callback) => {
                cluster1.version = '1.1.0';

                this._persistence.update(
                    null,
                    cluster1,
                    (err, cluster) => {
                        assert.isNull(err);

                        assert.isObject(cluster);
                        assert.equal(cluster.version, '1.1.0');
                        assert.equal(cluster.id, cluster1.id);

                        callback();
                    }
                );
            },
        // Delete cluster
            (callback) => {
                this._persistence.deleteById(
                    null,
                    cluster1.id,
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Try to get delete cluster
            (callback) => {
                this._persistence.getOneById(
                    null,
                    cluster1.id,
                    (err, cluster) => {
                        assert.isNull(err);

                        assert.isNull(cluster || null);

                        callback();
                    }
                );
            }
        ], done);
    }

    testGetWithFilter(done) {
        async.series([
        // Create clusters
            (callback) => {
                this.testCreateClusters(callback);
            },
        // Get clusters filtered by tenant_id
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        tenant_id: '2'
                    }),
                    new PagingParams(),
                    (err, clusters) => {
                        assert.isNull(err);

                        assert.isObject(clusters);
                        assert.lengthOf(clusters.data, 1);

                        callback();
                    }
                );
            },
        // Get clusters filtered by tenant_ids
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        tenant_ids: ['2', '3']
                    }),
                    new PagingParams(),
                    (err, clusters) => {
                        assert.isNull(err);

                        assert.isObject(clusters);
                        assert.lengthOf(clusters.data, 1);

                        callback();
                    }
                );
            },
        // Get clusters filtered by type
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        type: 'tenants'
                    }),
                    new PagingParams(),
                    (err, clusters) => {
                        assert.isNull(err);

                        assert.isObject(clusters);
                        assert.lengthOf(clusters.data, 2);

                        callback();
                    }
                );
            },
        // Get clusters filtered by active
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        active: true
                    }),
                    new PagingParams(),
                    (err, clusters) => {
                        assert.isNull(err);

                        assert.isObject(clusters);
                        assert.lengthOf(clusters.data, 2);

                        callback();
                    }
                );
            },
        // Get clusters filtered by open
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        open: true
                    }),
                    new PagingParams(),
                    (err, clusters) => {
                        assert.isNull(err);

                        assert.isObject(clusters);
                        assert.lengthOf(clusters.data, 1);

                        callback();
                    }
                );
            }
        ], done);
    }

}
