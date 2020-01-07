"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
let geojson = require('geojson-utils');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
const ClustersCommandSet_1 = require("./ClustersCommandSet");
class ClustersController {
    constructor() {
        this._dependencyResolver = new pip_services3_commons_node_2.DependencyResolver(ClustersController._defaultConfig);
    }
    configure(config) {
        this._dependencyResolver.configure(config);
    }
    setReferences(references) {
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired('persistence');
    }
    getCommandSet() {
        if (this._commandSet == null)
            this._commandSet = new ClustersCommandSet_1.ClustersCommandSet(this);
        return this._commandSet;
    }
    getClusters(correlationId, filter, paging, callback) {
        this._persistence.getPageByFilter(correlationId, filter, paging, callback);
    }
    getClusterById(correlationId, id, callback) {
        this._persistence.getOneById(correlationId, id, callback);
    }
    createCluster(correlationId, cluster, callback) {
        let newCluster;
        cluster.id = cluster.id || pip_services3_commons_node_4.IdGenerator.nextLong();
        cluster.update_time = cluster.update_time || new Date();
        cluster.active = cluster.active != null ? cluster.active : true;
        cluster.open = cluster.max_tenant_count > cluster.tenants_count;
        this._persistence.create(correlationId, cluster, callback);
    }
    updateCluster(correlationId, cluster, callback) {
        cluster.open = cluster.max_tenant_count > cluster.tenants_count;
        this._persistence.update(correlationId, cluster, callback);
    }
    deleteClusterById(correlationId, id, callback) {
        let oldCluster = null;
        let newCluster;
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
    addTenant(correlationId, tenantId, callback) {
        let cluster = null;
        async.series([
            // Find an open cluster
            (callback) => {
                let filter = pip_services3_commons_node_3.FilterParams.fromTuples('active', true, 'open', true);
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
    removeTenant(correlationId, tenantId, callback) {
        let cluster = null;
        async.series([
            // Find a cluster with tenant
            (callback) => {
                let filter = pip_services3_commons_node_3.FilterParams.fromTuples('tenant_id', tenantId);
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
exports.ClustersController = ClustersController;
ClustersController._defaultConfig = pip_services3_commons_node_1.ConfigParams.fromTuples('dependencies.persistence', 'pip-services-clusters:persistence:*:*:1.0');
//# sourceMappingURL=ClustersController.js.map