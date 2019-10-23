import { ConfigParams } from 'pip-services-commons-node';

import { ClustersMemoryPersistence } from '../../src/persistence/ClustersMemoryPersistence';
import { ClustersPersistenceFixture } from './ClustersPersistenceFixture';

suite('ClustersMemoryPersistence', ()=> {
    let persistence: ClustersMemoryPersistence;
    let fixture: ClustersPersistenceFixture;
    
    setup((done) => {
        persistence = new ClustersMemoryPersistence();
        persistence.configure(new ConfigParams());
        
        fixture = new ClustersPersistenceFixture(persistence);
        
        persistence.open(null, done);
    });
    
    teardown((done) => {
        persistence.close(null, done);
    });
        
    test('CRUD Operations', (done) => {
        fixture.testCrudOperations(done);
    });

    test('Get with Filters', (done) => {
        fixture.testGetWithFilter(done);
    });

});