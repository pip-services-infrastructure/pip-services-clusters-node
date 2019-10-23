import { ConfigParams } from 'pip-services-commons-node';
import { JsonFilePersister } from 'pip-services-data-node';
import { ClustersMemoryPersistence } from './ClustersMemoryPersistence';
import { ClusterV1 } from '../data/version1/ClusterV1';
export declare class ClustersFilePersistence extends ClustersMemoryPersistence {
    protected _persister: JsonFilePersister<ClusterV1>;
    constructor(path?: string);
    configure(config: ConfigParams): void;
}
