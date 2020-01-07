"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const ClustersMongoDbPersistence_1 = require("../persistence/ClustersMongoDbPersistence");
const ClustersFilePersistence_1 = require("../persistence/ClustersFilePersistence");
const ClustersMemoryPersistence_1 = require("../persistence/ClustersMemoryPersistence");
const ClustersController_1 = require("../logic/ClustersController");
const ClustersHttpServiceV1_1 = require("../services/version1/ClustersHttpServiceV1");
class ClustersServiceFactory extends pip_services3_components_node_1.Factory {
    constructor() {
        super();
        this.registerAsType(ClustersServiceFactory.MemoryPersistenceDescriptor, ClustersMemoryPersistence_1.ClustersMemoryPersistence);
        this.registerAsType(ClustersServiceFactory.FilePersistenceDescriptor, ClustersFilePersistence_1.ClustersFilePersistence);
        this.registerAsType(ClustersServiceFactory.MongoDbPersistenceDescriptor, ClustersMongoDbPersistence_1.ClustersMongoDbPersistence);
        this.registerAsType(ClustersServiceFactory.ControllerDescriptor, ClustersController_1.ClustersController);
        this.registerAsType(ClustersServiceFactory.HttpServiceDescriptor, ClustersHttpServiceV1_1.ClustersHttpServiceV1);
    }
}
exports.ClustersServiceFactory = ClustersServiceFactory;
ClustersServiceFactory.Descriptor = new pip_services3_commons_node_1.Descriptor("pip-services-clusters", "factory", "default", "default", "1.0");
ClustersServiceFactory.MemoryPersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-clusters", "persistence", "memory", "*", "1.0");
ClustersServiceFactory.FilePersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-clusters", "persistence", "file", "*", "1.0");
ClustersServiceFactory.MongoDbPersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-clusters", "persistence", "mongodb", "*", "1.0");
ClustersServiceFactory.ControllerDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-clusters", "controller", "default", "*", "1.0");
ClustersServiceFactory.HttpServiceDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-clusters", "service", "http", "*", "1.0");
//# sourceMappingURL=ClustersServiceFactory.js.map