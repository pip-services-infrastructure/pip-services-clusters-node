"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_aws_node_1 = require("pip-services3-aws-node");
const ClustersServiceFactory_1 = require("../build/ClustersServiceFactory");
class ClustersLambdaFunction extends pip_services3_aws_node_1.CommandableLambdaFunction {
    constructor() {
        super("clusters", "Working clusters function");
        this._dependencyResolver.put('controller', new pip_services3_commons_node_1.Descriptor('pip-services-clusters', 'controller', 'default', '*', '*'));
        this._factories.add(new ClustersServiceFactory_1.ClustersServiceFactory());
    }
}
exports.ClustersLambdaFunction = ClustersLambdaFunction;
exports.handler = new ClustersLambdaFunction().getHandler();
//# sourceMappingURL=ClustersLambdaFunction.js.map