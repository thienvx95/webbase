import { Container } from 'inversify';
import { SERVICE_TYPES } from './index';
import {
  IAuthService,
  IGoogleAuthService,
  AuthenticateUserService,
  GoogleAuthService,
} from '@business/auth/service/index';
import {
  IUserService,
  IInstallService,
  IMenuService,
  IRoleService,
  IPermissionService,
  ISettingService,
  IFileUploadService,
  IFileUploader,
} from '@business/core/interface';
import { UserService } from '@business/user/service/user.service';
import { InstallService } from '@business/system/service/install.service';
import { MenuService } from '@business/common/service/menu/menu.service';
import { RoleService } from '@business/role/service/role.service';
import { PermissionService } from '@business/common/service/permission/permission.serivce';
import { SettingService } from '@business/common/service/setting/setting.service';
import { FileUploadService } from '@business/common/service/fileUpload/fileUpload.service';
import { SystemConfig } from '@core/configuration';
import { StorageProvider } from '@core/enums/storageProvider.enum';
import { AWSFileUploadSerivce } from '@business/common/service/fileUpload/aws/awsFileUpload.loader';

export function services(container: Container): void {
  container
    .bind<IAuthService>(SERVICE_TYPES.AuthService)
    .to(AuthenticateUserService);
  container
    .bind<IGoogleAuthService>(SERVICE_TYPES.GoogleAuthService)
    .to(GoogleAuthService);
  container.bind<IUserService>(SERVICE_TYPES.UserService).to(UserService);
  container
    .bind<IInstallService>(SERVICE_TYPES.InstallService)
    .to(InstallService);
  container.bind<IMenuService>(SERVICE_TYPES.MenuService).to(MenuService);
  container.bind<IRoleService>(SERVICE_TYPES.RoleService).to(RoleService);
  container
    .bind<IPermissionService>(SERVICE_TYPES.PermissionService)
    .to(PermissionService);
  container
    .bind<ISettingService>(SERVICE_TYPES.SettingService)
    .to(SettingService);
  container
    .bind<IFileUploadService>(SERVICE_TYPES.FileUploadService)
    .to(FileUploadService);
  container
    .bind<IFileUploader>(SERVICE_TYPES.FileUploader)
    .toDynamicValue(() => {
      if (SystemConfig.Configs.StorageProvider == StorageProvider.S3) {
        return container.resolve<IFileUploader>(AWSFileUploadSerivce);
      }
      return null;
    })
    .inSingletonScope();
}
