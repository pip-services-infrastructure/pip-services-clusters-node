"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_mongodb_node_1 = require("pip-services3-mongodb-node");
class ClustersMongoDbPersistence extends pip_services3_mongodb_node_1.IdentifiableMongoDbPersistence {
    constructor() {
        super('clusters');
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
        let criteria = [];
        let search = filter.getAsNullableString('search');
        if (search != null) {
            let searchRegex = new RegExp(search, "i");
            let searchCriteria = [];
            searchCriteria.push({ name: { $regex: searchRegex } });
            searchCriteria.push({ type: { $regex: searchRegex } });
            searchCriteria.push({ version: { $regex: searchRegex } });
            criteria.push({ $or: searchCriteria });
        }
        let id = filter.getAsNullableString('id');
        if (id != null)
            criteria.push({ _id: id });
        let type = filter.getAsNullableString('type');
        if (type != null)
            criteria.push({ type: type });
        let active = filter.getAsNullableBoolean('active');
        if (active != null)
            criteria.push({ active: active });
        let open = filter.getAsNullableBoolean('open');
        if (open != null)
            criteria.push({ open: open });
        let name = filter.getAsNullableString('name');
        if (name != null)
            criteria.push({ name: name });
        // Filter tenant_ids
        let tenantIds = filter.getAsObject('tenant_ids');
        if (_.isString(tenantIds))
            tenantIds = tenantIds.split(',');
        if (_.isArray(tenantIds))
            criteria.push({ active_tenants: { $in: tenantIds } });
        let tenantId = filter.getAsNullableString('tenant_id');
        if (tenantId != null)
            criteria.push({ active_tenants: tenantId });
        return criteria.length > 0 ? { $and: criteria } : null;
    }
    getPageByFilter(correlationId, filter, paging, callback) {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }
}
exports.ClustersMongoDbPersistence = ClustersMongoDbPersistence;
//# sourceMappingURL=ClustersMongoDbPersistence.js.map