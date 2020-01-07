import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';

import { ClustersMongoDbPersistence } from '../persistence/ClustersMongoDbPersistence';
import { ClustersFilePersistence } from '../persistence/ClustersFilePersistence';
import { ClustersMemoryPersistence } from '../persistence/ClustersMemoryPersistence';
import { ClustersController } from '../logic/ClustersController';
import { ClustersHttpServiceV1 } from '../services/version1/ClustersHttpServiceV1';

export class ClustersServiceFactory extends Factory {
	public static Descriptor = new Descriptor("pip-services-clusters", "factory", "default", "default", "1.0");
	public static MemoryPersistenceDescriptor = new Descriptor("pip-services-clusters", "persistence", "memory", "*", "1.0");
	public static FilePersistenceDescriptor = new Descriptor("pip-services-clusters", "persistence", "file", "*", "1.0");
	public static MongoDbPersistenceDescriptor = new Descriptor("pip-services-clusters", "persistence", "mongodb", "*", "1.0");
	public static ControllerDescriptor = new Descriptor("pip-services-clusters", "controller", "default", "*", "1.0");
	public static HttpServiceDescriptor = new Descriptor("pip-services-clusters", "service", "http", "*", "1.0");
	
	constructor() {
		super();
		this.registerAsType(ClustersServiceFactory.MemoryPersistenceDescriptor, ClustersMemoryPersistence);
		this.registerAsType(ClustersServiceFactory.FilePersistenceDescriptor, ClustersFilePersistence);
		this.registerAsType(ClustersServiceFactory.MongoDbPersistenceDescriptor, ClustersMongoDbPersistence);
		this.registerAsType(ClustersServiceFactory.ControllerDescriptor, ClustersController);
		this.registerAsType(ClustersServiceFactory.HttpServiceDescriptor, ClustersHttpServiceV1);
	}
	
}
