"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_container_node_1 = require("pip-services-container-node");
const pip_services_rpc_node_1 = require("pip-services-rpc-node");
const ClustersServiceFactory_1 = require("../build/ClustersServiceFactory");
class ClustersProcess extends pip_services_container_node_1.ProcessContainer {
    constructor() {
        super("clusters", "Working clusters microservice");
        this._factories.add(new ClustersServiceFactory_1.ClustersServiceFactory);
        this._factories.add(new pip_services_rpc_node_1.DefaultRpcFactory);
    }
}
exports.ClustersProcess = ClustersProcess;
//# sourceMappingURL=ClustersProcess.js.map