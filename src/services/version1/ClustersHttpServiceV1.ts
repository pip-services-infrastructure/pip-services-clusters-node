import { Descriptor } from 'pip-services-commons-node';
import { CommandableHttpService } from 'pip-services-rpc-node';

export class ClustersHttpServiceV1 extends CommandableHttpService {
    public constructor() {
        super('v1/clusters');
        this._dependencyResolver.put('controller', new Descriptor('pip-services-clusters', 'controller', 'default', '*', '1.0'));
    }
}