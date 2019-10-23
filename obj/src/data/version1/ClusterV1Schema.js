"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const pip_services_commons_node_3 = require("pip-services-commons-node");
const pip_services_commons_node_4 = require("pip-services-commons-node");
class ClusterV1Schema extends pip_services_commons_node_1.ObjectSchema {
    constructor() {
        super();
        ;
        this.withOptionalProperty('id', pip_services_commons_node_4.TypeCode.String);
        this.withRequiredProperty('name', pip_services_commons_node_4.TypeCode.String);
        this.withRequiredProperty('type', pip_services_commons_node_4.TypeCode.String);
        this.withRequiredProperty('active', pip_services_commons_node_4.TypeCode.Boolean);
        this.withOptionalProperty('master_nodes', new pip_services_commons_node_3.ArraySchema(pip_services_commons_node_4.TypeCode.String));
        this.withOptionalProperty('slave_nodes', new pip_services_commons_node_3.ArraySchema(pip_services_commons_node_4.TypeCode.String));
        this.withOptionalProperty('api_host', pip_services_commons_node_4.TypeCode.String);
        this.withOptionalProperty('service_ports', new pip_services_commons_node_2.MapSchema());
        this.withOptionalProperty('maintenance', pip_services_commons_node_4.TypeCode.Boolean);
        this.withOptionalProperty('version', pip_services_commons_node_4.TypeCode.String);
        this.withOptionalProperty('update_time', null); //TypeCode.Date);
        this.withOptionalProperty('max_tenants_count', pip_services_commons_node_4.TypeCode.Integer);
        this.withOptionalProperty('tenants_count', pip_services_commons_node_4.TypeCode.Integer);
        this.withOptionalProperty('open', pip_services_commons_node_4.TypeCode.Boolean);
        this.withOptionalProperty('active_tenants', new pip_services_commons_node_3.ArraySchema(pip_services_commons_node_4.TypeCode.String));
        this.withOptionalProperty('inactive_tenants', new pip_services_commons_node_3.ArraySchema(pip_services_commons_node_4.TypeCode.String));
    }
}
exports.ClusterV1Schema = ClusterV1Schema;
//# sourceMappingURL=ClusterV1Schema.js.map