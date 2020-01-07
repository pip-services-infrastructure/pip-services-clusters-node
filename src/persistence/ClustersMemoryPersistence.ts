let _ = require('lodash');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableMemoryPersistence } from 'pip-services3-data-node';

import { ClusterV1 } from '../data/version1/ClusterV1';
import { IClustersPersistence } from './IClustersPersistence';

export class ClustersMemoryPersistence 
    extends IdentifiableMemoryPersistence<ClusterV1, string> 
    implements IClustersPersistence {

    constructor() {
        super();
    }

    private matchString(value: string, search: string): boolean {
        if (value == null && search == null)
            return true;
        if (value == null || search == null)
            return false;
        return value.toLowerCase().indexOf(search) >= 0;
    }

    private matchSearch(item: ClusterV1, search: string): boolean {
        search = search.toLowerCase();
        if (this.matchString(item.name, search))
            return true;
        if (this.matchString(item.type, search))
            return true;
        if (this.matchString(item.version, search))
            return true;
        return false;
    }

    private contains(array1, array2) {
        if (array1 == null || array2 == null) return false;
        
        for (let i1 = 0; i1 < array1.length; i1++) {
            for (let i2 = 0; i2 < array2.length; i2++)
                if (array1[i1] == array2[i1]) 
                    return true;
        }
        
        return false;
    }
    
    private composeFilter(filter: FilterParams): any {
        filter = filter || new FilterParams();
        
        let search = filter.getAsNullableString('search');
        let id = filter.getAsNullableString('id');
        let name = filter.getAsNullableString('name');
        let type = filter.getAsNullableString('type');
        let active = filter.getAsNullableBoolean('active');
        let open = filter.getAsNullableBoolean('open');
        let tenantId = filter.getAsNullableString('tenant_id');
        let tenantIds = filter.getAsObject('tenant_ids');
        
        // Process ids filter
        if (_.isString(tenantIds))
            tenantIds = tenantIds.split(',');
        if (!_.isArray(tenantIds))
            tenantIds = null;

        return (item) => {
            if (id && item.id != id) 
                return false;
            if (tenantId && _.indexOf(item.active_tenants, tenantId) < 0)
                return false;
            if (tenantIds && !this.contains(tenantIds, item.active_tenants))
                return false;
            if (name && item.name != name) 
                return false;
            if (type && item.type != type) 
                return false;
            if (active && item.active != active) 
                return false;
            if (open && item.open != open) 
                return false;
            if (search && !this.matchSearch(item, search)) 
                return false;
            return true; 
        };
    }

    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<ClusterV1>) => void): void {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }

}
