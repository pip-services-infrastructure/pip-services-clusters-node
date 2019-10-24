import { IStringIdentifiable } from 'pip-services-commons-node';

export class ClusterV1 implements IStringIdentifiable {
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