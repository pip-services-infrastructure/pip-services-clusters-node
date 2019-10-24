# <img src="https://github.com/pip-services/pip-services/raw/master/design/Logo.png" alt="Pip.Services Logo" style="max-width:30%"> <br/> Clusters microservice

This is the clusters microservice. It keeps list of working clusters.

The microservice currently supports the following deployment options:
* Deployment platforms: Standalone Process
* External APIs: HTTP/REST
* Persistence: Memory, Flat Files, MongoDB

This microservice has no dependencies on other microservices.
<a name="links"></a> Quick Links:

* [Download Links](doc/Downloads.md)
* [Development Guide](doc/Development.md)
* [Configuration Guide](doc/Configuration.md)
* Client SDKs
  - [Node.js SDK](https://github.com/pip-services-infrastructure/pip-clients-clusters-node)


##  Contract

Logical contract of the microservice is presented below. For physical implementation (HTTP/REST, Thrift, Seneca, Lambda, etc.),
please, refer to documentation of the specific protocol.

```typescript
class ClusterV1 implements IStringIdentifiable {
    public id: string;

    public name: string;
    public type: string;
    public active: boolean;

    public master_nodes?: string[];
    public slave_nodes?: string[];

    public api_host?: string;
    public service_ports?:  { [name: string]: number };
    
    public maintenance?: boolean;
    public version?: string;
    public update_time?: Date;

    public max_tenant_count ?: number;
    public tenants_count?: number;
    public open?: boolean;
    public active_tenants?: string[];
    public inactive_tenants?: string[];
}

interface IClustersController {
    getClusters(correlationId: string, filter: FilterParams, paging: PagingParams, 
        callback: (err: any, page: DataPage<ClusterV1>) => void): void;

    getClusterById(correlationId: string, cluster_id: string, 
        callback: (err: any, cluster: ClusterV1) => void): void;

    createCluster(correlationId: string, cluster: ClusterV1, 
        callback: (err: any, cluster: ClusterV1) => void): void;

    updateCluster(correlationId: string, cluster: ClusterV1, 
        callback: (err: any, cluster: ClusterV1) => void): void;
    
    deleteClusterById(correlationId: string, cluster_id: string,
        callback: (err: any, cluster: ClusterV1) => void): void;

    addTenant(correlationId: string, tenantId: string, 
        callback: (err: any, cluster: ClusterV1) => void): void;

    removeTenant(correlationId: string, tenantId: string, 
        callback: (err: any, cluster: ClusterV1) => void): void;            
}


```

## Download

Right now the only way to get the microservice is to check it out directly from github repository
```bash
git clone git@github.com:pip-services-infrastructure/pip-services-clusters-node.git
```

Pip.Service team is working to implement packaging and make stable releases available for your 
as zip downloadable archieves.

## Run

Add **config.yaml** file to the root of the microservice folder and set configuration parameters.
As the starting point you can use example configuration from **config.example.yaml** file. 

Example of microservice configuration
```yaml
{    
---
- descriptor: "pip-services-commons:logger:console:default:1.0"
  level: "trace"

- descriptor: "pip-services-clusters:persistence:file:default:1.0"
  path: "./data/blobs"

- descriptor: "pip-services-clusters:controller:default:default:1.0"

- descriptor: "pip-services-clusters:service:http:default:1.0"
  connection:
    protocol: "http"
    host: "0.0.0.0"
    port: 3000
}
```
 
For more information on the microservice configuration see [Configuration Guide](Configuration.md).

Start the microservice using the command:
```bash
node run
```

## Use

The easiest way to work with the microservice is to use client SDK. 
The complete list of available client SDKs for different languages is listed in the [Quick Links](#links)

If you use Node.js then you should add dependency to the client SDK into **package.json** file of your project
```javascript
{
    ...
    "dependencies": {
        ....
        "pip-clients-clusters-node": "^1.0.*",
        ...
    }
}
```

Define client configuration parameters.

```typescript
// Client configuration
var httpConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);
client.configure(httpConfig);
```

Instantiate the client and open connection to the microservice
```typescript
// Create the client instance
client = new ClustersHttpClientV1();

// Connect to the microservice
client.open(null, function(err) {
    if (err) {
        console.error('Connection to the microservice failed');
        console.error(err);
        return;
    }
    
    // Work with the microservice
    ...
});
```
Now the client is ready to perform operations:

Create new cluster:
```typescript 
let CLUSTER1: ClusterV1 = {
    id: '1',
    name: 'Cluster #1',
    type: 'root',
    active: true,
    api_host: 'api.mycluster1.com',
    service_ports: { myservice1: 30001, myservice2: 30002 },
    max_tenant_count: 1,
    tenants_count: 1,
    active_tenants: ['1']
};   

    client.createCluster("123", CLUSTER1, (err, cluster){
        if (err != null) {
            console.error('Can\'t create cluster!');
            console.error(err);
        } else {
            console.dir('Cluster was created successfull');
        }
    });
```
Update exists cluster:
```typescript
    CLUSTER1.name = "Cluster #2";
    client.updateCluster("123", CLUSTER1, (err, cluster){
        if (err != null) {
            console.error('Can\'t update cluster!');
            console.error(err);
        } else {
            console.dir('Cluster was updated successfull');
        }
    });
```
Delete existing cluster by cluster_id
```typescript    
    client.deleteClusterById("123", 1, (err, cluster){
        if (err != null) {
            console.error('Can\'t delete cluster!');
            console.error(err);
        } else {
            console.dir('Cluster was delete successfull');
            console.dir('Deleted cluster:');
            console.dir(cluster.toString());
        }
    });
```
Add new tenant into active cluster
```typescript
    client.addTenant("123", "5", (err, cluster) {
        if (err != null) {
            console.error('Can\'t add tenant to cluster!');
            console.error(err);
        } else {
            console.dir('Tenant was added successfull');
            console.dir('Cluster:');
            console.dir(cluster.toString());
        }
    });
```
Remove existing tenant by tenantId
```typescript
    client.removeTenant("123", "5", (err, cluster) {
        if (err != null) {
            console.error('Can\'t delete tenant from cluster!');
            console.error(err);
        } else {
            console.dir('Tenant was deleted successfull');
            console.dir('Cluster:');
            console.dir(cluster.toString());
        }
    });
```
Get list of all clusters:
```typescript
    let filter = FilterParams.fromTuples(
        'active', true,
        'open', true
    );
    client.getClusters("123", filter, new PagingParams(), (err, clusters){
        if (err != null) {
            console.error('Can\'t find cluster by filter!');
            console.error(err);
        } else {
            console.dir("Cluster list length:");
            console.dir(clusters.data.length);
        }
    });
```
Get cluster by cluster_id:
```typescript
    client.getClusterById("123", "1", (err, cluster){
         if (err != null) {
            console.error('Can\'t find cluster by cluster id!');
            console.error(err);
        } else {
            console.dir('Cluster was finded successfull');
            console.dir('Cluster:');
            console.dir(cluster.toString());
        }
    });
```
Get cluster by tenant:
```typescript
    client.getClusterByTenant("123", "5", (err, cluster){
        if (err != null) {
            console.error('Can\'t find cluster by tenant id!');
            console.error(err);
        } else {
            console.dir('Cluster was finded successfull');
            console.dir('Cluster:');
            console.dir(cluster.toString());
        }
    });
```

## Acknowledgements

This microservice was created and currently maintained by *Sergey Seroukhov*.
