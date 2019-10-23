let _ = require('lodash');
let async = require('async');
let restify = require('restify');
let assert = require('chai').assert;

import { ConfigParams } from 'pip-services-commons-node';
import { Descriptor } from 'pip-services-commons-node';
import { References } from 'pip-services-commons-node';

import { ClusterV1 } from '../../../src/data/version1/ClusterV1';
import { ClustersMemoryPersistence } from '../../../src/persistence/ClustersMemoryPersistence';
import { ClustersController } from '../../../src/logic/ClustersController';
import { ClustersHttpServiceV1 } from '../../../src/services/version1/ClustersHttpServiceV1';

let httpConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);

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
    active_tenants: ['2', '3'],
    inactive_tenants: ['4']
};

suite('ClustersHttpServiceV1', ()=> {    
    let persistence: ClustersMemoryPersistence;
    let service: ClustersHttpServiceV1;
    let rest: any;

    suiteSetup((done) => {
        persistence = new ClustersMemoryPersistence();
        let controller = new ClustersController();

        service = new ClustersHttpServiceV1();
        service.configure(httpConfig);

        let references: References = References.fromTuples(
            new Descriptor('pip-services-clusters', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('pip-services-clusters', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('pip-services-clusters', 'service', 'http', 'default', '1.0'), service
        );
        controller.setReferences(references);
        service.setReferences(references);

        service.open(null, done);
    });
    
    suiteTeardown((done) => {
        service.close(null, done);
    });

    setup((done) => {
        let url = 'http://localhost:3000';
        rest = restify.createJsonClient({ url: url, version: '*' });
        persistence.clear(null, done);
    });
    
    
    test('CRUD Operations', (done) => {
        let cluster1, cluster2: ClusterV1;

        async.series([
        // Create one cluster
            (callback) => {
                rest.post('/v1/clusters/create_cluster',
                    {
                        cluster: CLUSTER1
                    },
                    (err, req, res, cluster) => {
                        assert.isNull(err);

                        assert.isObject(cluster);
                        assert.equal(cluster.name, CLUSTER1.name);
                        assert.equal(cluster.type, CLUSTER1.type);

                        cluster1 = cluster;

                        callback();
                    }
                );
            },
        // Create another cluster
            (callback) => {
                rest.post('/v1/clusters/create_cluster', 
                    {
                        cluster: CLUSTER2
                    },
                    (err, req, res, cluster) => {
                        assert.isNull(err);

                        assert.isObject(cluster);
                        assert.equal(cluster.name, CLUSTER2.name);
                        assert.equal(cluster.type, CLUSTER2.type);

                        cluster2 = cluster;

                        callback();
                    }
                );
            },
        // Get all clusters
            (callback) => {
                rest.post('/v1/clusters/get_clusters',
                    {},
                    (err, req, res, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 2);

                        callback();
                    }
                );
            },
        // Update the cluster
            (callback) => {
                cluster1.maintenance = true;
                cluster1.version = '1.1.0';

                rest.post('/v1/clusters/update_cluster',
                    { 
                        cluster: cluster1
                    },
                    (err, req, res, cluster) => {
                        assert.isNull(err);

                        assert.isObject(cluster);
                        assert.isTrue(cluster.active);
                        assert.equal(cluster.name, cluster1.name);
                        assert.equal(cluster.version, '1.1.0');

                        cluster1 = cluster;

                        callback();
                    }
                );
            },
            // Add tenant to cluster
            (callback) => {
                rest.post('/v1/clusters/add_tenant',
                    { 
                        tenant_id: '5'
                    },
                    (err, req, res, cluster) => {
                        assert.isNull(err);

                        assert.isObject(cluster);
                        assert.isTrue(cluster.active);                        

                        assert.isTrue(_.indexOf(cluster.active_tenants, '5') >= 0);

                        callback();
                    }
                );
            },
            // Remove tenant from cluster
            (callback) => {
                rest.post('/v1/clusters/remove_tenant',
                    { 
                        tenant_id: '5'
                    },
                    (err, req, res, cluster) => {
                        assert.isNull(err);

                        assert.isObject(cluster);
                        assert.isTrue(_.indexOf(cluster.active_tenants, '5') < 0);

                        callback();
                    }
                );
            },
            // Delete cluster
            (callback) => {
                rest.post('/v1/clusters/delete_cluster_by_id',
                    {
                        cluster_id: cluster1.id
                    },
                    (err, req, res, result) => {
                        assert.isNull(err);

                        //assert.isNull(result);

                        callback();
                    }
                );
            },
        // Try to get delete cluster
            (callback) => {
                rest.post('/v1/clusters/get_cluster_by_id',
                    {
                        cluster_id: cluster1.id
                    },
                    (err, req, res, cluster) => {
                        assert.isNull(err);

                        //assert.isNull(cluster);

                        callback();
                    }
                );
            }
        ], done);
    });
});