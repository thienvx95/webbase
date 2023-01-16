export { IRepository } from '@core/data/repository.interface';
export { IAuthService } from './auth/authService.interface'
export { IGoogleAuthService } from './auth/googleAuthService.interface'
export { IAutoMapper } from './common/automapper/automapper.interface';
export { ISiteSettings } from './common/siteSetting/siteSetting.interface';
export { IUserService } from './user/useService.interface';
export { EventDispatcher as IEventDispatcher } from "event-dispatch";
export { IFileUploadService } from './common/fileUpload/fileUploadService.interface'
export { IFileUploader } from './common/fileUpload/fileupload.interface'
export { IPermissionService } from './common/permission/permissionService.interface';
export { ISettingService } from  './common/setting/settingService.interface';
export { ICacheBase } from '@infrastructures/caching/cacheBase.interface';
export { IMenuService } from './common/menu/menuService.inteface';
export { IRoleService } from './role/roleService.interface';
export { IInstallService } from './system/installService.interface';