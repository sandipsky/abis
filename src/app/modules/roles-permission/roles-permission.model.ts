export interface IRolesPermission {
  id: number;
  name: string;
  is_active: boolean;
  description: string;
}

export interface IPermissionOperation {
  id: number;
  name: string;
  selected: boolean;
}

export interface IPermissionModule {
  module_name: string;
  operations: IPermissionOperation[];
}

export interface IPermissionMasterModule {
  master_module: string;
  modules: IPermissionModule[];
}
