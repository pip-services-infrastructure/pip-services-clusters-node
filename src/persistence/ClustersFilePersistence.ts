import { ConfigParams } from 'pip-services-commons-node';
import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';
import { DataPage } from 'pip-services-commons-node';
import { JsonFilePersister } from 'pip-services-data-node';

import { ClustersMemoryPersistence } from './ClustersMemoryPersistence';
import { ClusterV1 } from '../data/version1/ClusterV1';

export class ClustersFilePersistence extends ClustersMemoryPersistence {
	protected _persister: JsonFilePersister<ClusterV1>;

    public constructor(path?: string) {
        super();

        this._persister = new JsonFilePersister<ClusterV1>(path);
        this._loader = this._persister;
        this._saver = this._persister;
    }

    public configure(config: ConfigParams): void {
        super.configure(config);
        this._persister.configure(config);
    }

}