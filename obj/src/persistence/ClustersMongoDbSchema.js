"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
let Mixed = mongoose_1.Schema.Types.Mixed;
exports.ClustersMongoDbSchema = function (collection) {
    collection = collection || 'clusters';
    let schema = new mongoose_1.Schema({
        /* Identification */
        _id: { type: String },
        name: { type: String, required: true },
        type: { type: String, required: true },
        active: { type: Boolean, required: true },
        /* Nodes */
        master_nodes: { type: [String], required: false },
        slave_nodes: { type: [String], required: false },
        /* Endpoints */
        api_host: { type: String, required: false },
        service_ports: { type: Mixed, required: false },
        /* Administration */
        maintenance: { type: Boolean, required: false },
        version: { type: String, required: false },
        update_time: { type: Date, required: false },
        /* Tenants allocation */
        max_tenant_count: { type: Number, required: false },
        tenants_count: { type: Number, required: false },
        open: { type: Boolean, required: false },
        active_tenants: { type: [String], required: false },
        inactive_tenants: { type: [String], required: false }
    }, {
        collection: collection,
        autoIndex: true
    });
    schema.set('toJSON', {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    });
    return schema;
};
//# sourceMappingURL=ClustersMongoDbSchema.js.map