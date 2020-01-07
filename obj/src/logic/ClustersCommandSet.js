"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
const pip_services3_commons_node_5 = require("pip-services3-commons-node");
const pip_services3_commons_node_6 = require("pip-services3-commons-node");
const pip_services3_commons_node_7 = require("pip-services3-commons-node");
const pip_services3_commons_node_8 = require("pip-services3-commons-node");
const ClusterV1Schema_1 = require("../data/version1/ClusterV1Schema");
class ClustersCommandSet extends pip_services3_commons_node_1.CommandSet {
    constructor(logic) {
        super();
        this._logic = logic;
        // Register commands to the database
        this.addCommand(this.makeGetClustersCommand());
        this.addCommand(this.makeGetClusterByIdCommand());
        this.addCommand(this.makeCreateClusterCommand());
        this.addCommand(this.makeUpdateClusterCommand());
        this.addCommand(this.makeDeleteClusterByIdCommand());
        this.addCommand(this.makeAddTenantCommand());
        this.addCommand(this.makeRemoveTenantCommand());
    }
    makeGetClustersCommand() {
        return new pip_services3_commons_node_2.Command("get_clusters", new pip_services3_commons_node_5.ObjectSchema(true)
            .withOptionalProperty('filter', new pip_services3_commons_node_7.FilterParamsSchema())
            .withOptionalProperty('paging', new pip_services3_commons_node_8.PagingParamsSchema()), (correlationId, args, callback) => {
            let filter = pip_services3_commons_node_3.FilterParams.fromValue(args.get("filter"));
            let paging = pip_services3_commons_node_4.PagingParams.fromValue(args.get("paging"));
            this._logic.getClusters(correlationId, filter, paging, callback);
        });
    }
    makeGetClusterByIdCommand() {
        return new pip_services3_commons_node_2.Command("get_cluster_by_id", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('cluster_id', pip_services3_commons_node_6.TypeCode.String), (correlationId, args, callback) => {
            let cluster_id = args.getAsString("cluster_id");
            this._logic.getClusterById(correlationId, cluster_id, callback);
        });
    }
    makeCreateClusterCommand() {
        return new pip_services3_commons_node_2.Command("create_cluster", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('cluster', new ClusterV1Schema_1.ClusterV1Schema()), (correlationId, args, callback) => {
            let cluster = args.get("cluster");
            this._logic.createCluster(correlationId, cluster, callback);
        });
    }
    makeUpdateClusterCommand() {
        return new pip_services3_commons_node_2.Command("update_cluster", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('cluster', new ClusterV1Schema_1.ClusterV1Schema()), (correlationId, args, callback) => {
            let cluster = args.get("cluster");
            this._logic.updateCluster(correlationId, cluster, callback);
        });
    }
    makeDeleteClusterByIdCommand() {
        return new pip_services3_commons_node_2.Command("delete_cluster_by_id", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('cluster_id', pip_services3_commons_node_6.TypeCode.String), (correlationId, args, callback) => {
            let clusterId = args.getAsNullableString("cluster_id");
            this._logic.deleteClusterById(correlationId, clusterId, callback);
        });
    }
    makeAddTenantCommand() {
        return new pip_services3_commons_node_2.Command("add_tenant", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('tenant_id', pip_services3_commons_node_6.TypeCode.String), (correlationId, args, callback) => {
            let tenantId = args.getAsNullableString("tenant_id");
            this._logic.addTenant(correlationId, tenantId, callback);
        });
    }
    makeRemoveTenantCommand() {
        return new pip_services3_commons_node_2.Command("remove_tenant", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('tenant_id', pip_services3_commons_node_6.TypeCode.String), (correlationId, args, callback) => {
            let tenantId = args.getAsNullableString("tenant_id");
            this._logic.removeTenant(correlationId, tenantId, callback);
        });
    }
}
exports.ClustersCommandSet = ClustersCommandSet;
//# sourceMappingURL=ClustersCommandSet.js.map