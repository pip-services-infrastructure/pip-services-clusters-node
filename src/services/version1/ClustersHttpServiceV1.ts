import { Descriptor } from 'pip-services3-commons-node';
import { CommandableHttpService } from 'pip-services3-rpc-node';

export class ClustersHttpServiceV1 extends CommandableHttpService {
    public constructor() {
        super('v1/clusters');
        this._dependencyResolver.put('controller', new Descriptor('pip-services-clusters', 'controller', 'default', '*', '1.0'));
    }
}