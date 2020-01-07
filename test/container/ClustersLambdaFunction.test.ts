let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { Descriptor } from 'pip-services3-commons-node';
import { ConfigParams } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';
import { ConsoleLogger } from 'pip-services3-components-node';

import { ClusterV1 } from '../../src/data/version1/ClusterV1';
import { ClustersMemoryPersistence } from '../../src/persistence/ClustersMemoryPersistence';
import { ClustersController } from '../../src/logic/ClustersController';
import { ClustersLambdaFunction } from '../../src/container/ClustersLambdaFunction';

let CLUSTER1: ClusterV1 = {
    id: '1',
    name: 'Cluster #1',
    type: 'root',
    active: true,
    api_host: 'api.mycluster1.com',
    service_ports: { myservice1: 30001, myservice2: 30002 },
    max_tenant_count : 1,
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
    max_tenant_count : 10,
    tenants_count: 4,
    active_tenants: ['2', '3'],
    inactive_tenants: ['4']
};

suite('ClustersLambdaFunction', ()=> {
    let lambda: ClustersLambdaFunction;

    suiteSetup((done) => {
        let config = ConfigParams.fromTuples(
            'logger.descriptor', 'pip-services:logger:console:default:1.0',
            'persistence.descriptor', 'pip-services-clusters:persistence:memory:default:1.0',
            'controller.descriptor', 'pip-services-clusters:controller:default:default:1.0'
        );

        lambda = new ClustersLambdaFunction();
        lambda.configure(config);
        lambda.open(null, done);
    });
    
    suiteTeardown((done) => {
        lambda.close(null, done);
    });
    
    test('CRUD Operations', (done) => {
        var cluster1, cluster2;

        async.series([
        // Create one cluster
            (callback) => {
                lambda.act(
                    {
                        role: 'clusters',
                        cmd: 'create_cluster',
                        cluster: CLUSTER1
                    },
                    (err, cluster) => {
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
                lambda.act(
                    {
                        role: 'clusters',
                        cmd: 'create_cluster',
                        cluster: CLUSTER2
                    },
                    (err, cluster) => {
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
                lambda.act(
                    {
                        role: 'clusters',
                        cmd: 'get_clusters' 
                    },
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 2);

                        callback();
                    }
                );
            },
        // Update the cluster
            (callback) => {
                cluster1.version = '1.1.0';

                lambda.act(
                    {
                        role: 'clusters',
                        cmd: 'update_cluster',
                        cluster: cluster1
                    },
                    (err, cluster) => {
                        assert.isNull(err);

                        assert.isObject(cluster);
                        assert.equal(cluster.version, '1.1.0');
                        assert.equal(cluster.name, CLUSTER1.name);

                        cluster1 = cluster;

                        callback();
                    }
                );
            },
            // Add tenant to cluster
            (callback) => {
                lambda.act(
                    {
                        role: 'clusters',
                        cmd: 'add_tenant',
                        tenant_id: '5'
                    },
                    (err, cluster) => {
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
                lambda.act(
                    {
                        role: 'clusters',
                        cmd: 'remove_tenant',
                        tenant_id: '5'
                    },
                    (err, cluster) => {
                        assert.isNull(err);

                        assert.isObject(cluster);
                        assert.isTrue(_.indexOf(cluster.active_tenants, '5') < 0);

                        callback();
                    }
                );
            },
            // Delete cluster
            (callback) => {
                lambda.act(
                    {
                        role: 'clusters',
                        cmd: 'delete_cluster_by_id',
                        cluster_id: cluster1.id
                    },
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Try to get delete cluster
            (callback) => {
                lambda.act(
                    {
                        role: 'clusters',
                        cmd: 'get_cluster_by_id',
                        cluster_id: cluster1.id
                    },
                    (err, cluster) => {
                        assert.isNull(err);

                        assert.isNull(cluster);

                        callback();
                    }
                );
            }
        ], done);
    });
});