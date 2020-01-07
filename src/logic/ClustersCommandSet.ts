import { CommandSet } from 'pip-services3-commons-node';
import { ICommand } from 'pip-services3-commons-node';
import { Command } from 'pip-services3-commons-node';
import { Schema } from 'pip-services3-commons-node';
import { Parameters } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { ObjectSchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';
import { FilterParamsSchema } from 'pip-services3-commons-node';
import { PagingParamsSchema } from 'pip-services3-commons-node';

import { ClusterV1 } from '../data/version1/ClusterV1';
import { ClusterV1Schema } from '../data/version1/ClusterV1Schema';
import { IClustersController } from './IClustersController';

export class ClustersCommandSet extends CommandSet {
    private _logic: IClustersController;

    constructor(logic: IClustersController) {
        super();

        this._logic = logic;

        // Register commands to the database
		this.addCommand(this.makeGetClustersCommand());
		this.addCommand(this.makeGetClusterByIdCommand());
		this.addCommand(this.makeCreateClusterCommand());
		this.addCommand(this.makeUpdateClusterCommand());
		this.addCommand(this.makeDeleteClusterByIdCommand());
		this.addCommand(this.makeAddTenantCommand());
		this.addCommand(this.makeRemoveTenantCommand());
    }

	private makeGetClustersCommand(): ICommand {
		return new Command(
			"get_clusters",
			new ObjectSchema(true)
				.withOptionalProperty('filter', new FilterParamsSchema())
				.withOptionalProperty('paging', new PagingParamsSchema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let filter = FilterParams.fromValue(args.get("filter"));
                let paging = PagingParams.fromValue(args.get("paging"));
                this._logic.getClusters(correlationId, filter, paging, callback);
            }
		);
	}

	private makeGetClusterByIdCommand(): ICommand {
		return new Command(
			"get_cluster_by_id",
			new ObjectSchema(true)
				.withRequiredProperty('cluster_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let cluster_id = args.getAsString("cluster_id");
                this._logic.getClusterById(correlationId, cluster_id, callback);
            }
		);
	}

	private makeCreateClusterCommand(): ICommand {
		return new Command(
			"create_cluster",
			new ObjectSchema(true)
				.withRequiredProperty('cluster', new ClusterV1Schema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let cluster = args.get("cluster");
                this._logic.createCluster(correlationId, cluster, callback);
            }
		);
	}

	private makeUpdateClusterCommand(): ICommand {
		return new Command(
			"update_cluster",
			new ObjectSchema(true)
				.withRequiredProperty('cluster', new ClusterV1Schema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let cluster = args.get("cluster");
                this._logic.updateCluster(correlationId, cluster, callback);
            }
		);
	}
	
	private makeDeleteClusterByIdCommand(): ICommand {
		return new Command(
			"delete_cluster_by_id",
			new ObjectSchema(true)
				.withRequiredProperty('cluster_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let clusterId = args.getAsNullableString("cluster_id");
                this._logic.deleteClusterById(correlationId, clusterId, callback);
			}
		);
	}

	private makeAddTenantCommand(): ICommand {
		return new Command(
			"add_tenant",
			new ObjectSchema(true)
				.withRequiredProperty('tenant_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let tenantId = args.getAsNullableString("tenant_id");
                this._logic.addTenant(correlationId, tenantId, callback);
			}
		);
	}

	private makeRemoveTenantCommand(): ICommand {
		return new Command(
			"remove_tenant",
			new ObjectSchema(true)
				.withRequiredProperty('tenant_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let tenantId = args.getAsNullableString("tenant_id");
                this._logic.removeTenant(correlationId, tenantId, callback);
			}
		);
	}

}