import { IReferences } from 'pip-services3-commons-node';
import { ProcessContainer } from 'pip-services3-container-node';
import { DefaultRpcFactory } from 'pip-services3-rpc-node';

import { ClustersServiceFactory } from '../build/ClustersServiceFactory';

export class ClustersProcess extends ProcessContainer {

    public constructor() {
        super("clusters", "Working clusters microservice");
        this._factories.add(new ClustersServiceFactory);
        this._factories.add(new DefaultRpcFactory);
    }

}
