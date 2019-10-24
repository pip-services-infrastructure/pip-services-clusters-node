import { IStringIdentifiable } from 'pip-services-commons-node';
export declare class ClusterV1 implements IStringIdentifiable {
    id: string;
    name: string;
    type: string;
    active: boolean;
    master_nodes?: string[];
    slave_nodes?: string[];
    api_host?: string;
    service_ports?: {
        [name: string]: number;
    };
    maintenance?: boolean;
    version?: string;
    update_time?: Date;
    max_tenant_count?: number;
    tenants_count?: number;
    open?: boolean;
    active_tenants?: string[];
    inactive_tenants?: string[];
}
