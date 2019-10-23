import { CommandSet } from 'pip-services-commons-node';
import { IClustersController } from './IClustersController';
export declare class ClustersCommandSet extends CommandSet {
    private _logic;
    constructor(logic: IClustersController);
    private makeGetClustersCommand;
    private makeGetClusterByIdCommand;
    private makeCreateClusterCommand;
    private makeUpdateClusterCommand;
    private makeDeleteClusterByIdCommand;
    private makeAddTenantCommand;
    private makeRemoveTenantCommand;
}
