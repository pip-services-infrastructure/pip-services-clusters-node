"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_rpc_node_1 = require("pip-services-rpc-node");
class ClustersHttpServiceV1 extends pip_services_rpc_node_1.CommandableHttpService {
    constructor() {
        super('v1/clusters');
        this._dependencyResolver.put('controller', new pip_services_commons_node_1.Descriptor('pip-services-clusters', 'controller', 'default', '*', '1.0'));
    }
}
exports.ClustersHttpServiceV1 = ClustersHttpServiceV1;
//# sourceMappingURL=ClustersHttpServiceV1.js.map