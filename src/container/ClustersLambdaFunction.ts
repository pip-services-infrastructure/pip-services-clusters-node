import { Descriptor } from 'pip-services3-commons-node';
import { CommandableLambdaFunction } from 'pip-services3-aws-node';
import { ClustersServiceFactory } from '../build/ClustersServiceFactory';

export class ClustersLambdaFunction extends CommandableLambdaFunction {
    public constructor() {
        super("clusters", "Working clusters function");
        this._dependencyResolver.put('controller', new Descriptor('pip-services-clusters', 'controller', 'default', '*', '*'));
        this._factories.add(new ClustersServiceFactory());
    }
}

export const handler = new ClustersLambdaFunction().getHandler();