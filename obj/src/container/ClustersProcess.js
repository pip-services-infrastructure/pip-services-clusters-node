"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_container_node_1 = require("pip-services3-container-node");
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
const ClustersServiceFactory_1 = require("../build/ClustersServiceFactory");
class ClustersProcess extends pip_services3_container_node_1.ProcessContainer {
    constructor() {
        super("clusters", "Working clusters microservice");
        this._factories.add(new ClustersServiceFactory_1.ClustersServiceFactory);
        this._factories.add(new pip_services3_rpc_node_1.DefaultRpcFactory);
    }
}
exports.ClustersProcess = ClustersProcess;
//# sourceMappingURL=ClustersProcess.js.map