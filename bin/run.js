let ClustersProcess = require('../obj/src/container/ClustersProcess').ClustersProcess;

try {
    new ClustersProcess().run(process.argv);
} catch (ex) {
    console.error(ex);
}
