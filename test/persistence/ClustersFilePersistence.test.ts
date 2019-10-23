import { ConfigParams } from 'pip-services-commons-node';

import { ClustersFilePersistence } from '../../src/persistence/ClustersFilePersistence';
import { ClustersPersistenceFixture } from './ClustersPersistenceFixture';

suite('ClustersFilePersistence', ()=> {
    let persistence: ClustersFilePersistence;
    let fixture: ClustersPersistenceFixture;
    
    setup((done) => {
        persistence = new ClustersFilePersistence('./data/clusters.test.json');

        fixture = new ClustersPersistenceFixture(persistence);

        persistence.open(null, (err) => {
            persistence.clear(null, done);
        });
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