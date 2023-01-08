import { Container } from "inversify";
import { IAuthService, IGoogleAuthService, AuthenticateUserService, GoogleAuthService } from '@business/auth/service/index';
import { IUserService, UserService } from '@business/user/service/user.service';
import { IInstallService, InstallService } from "@business/system/service/install.service";
import { IMenuService, MenuService } from "@business/common/service/menu/menu.service";
import { IRoleService, RoleService } from "@business/role/service/role.service";
import { IPermissionService, PermissionService } from "@business/common/service/permission/permission.serivce";

export const SERVICE_TYPES = {
    AuthService: Symbol.for("AuthService"),
    GoogleAuthService: Symbol.for("GoogleAuthService"),
    UserService: Symbol.for("UserService"),
    InstallService: Symbol.for("InstallService"),
    MenuService: Symbol.for("MenuService"),
    RoleService: Symbol.for("RoleService"),
    PermissionService: Symbol.for("PermissionService"),
    SettingService: Symbol.for("SettingService"),
};

export function services(container: Container): void {
    container.bind<IAuthService>(SERVICE_TYPES.AuthService).to(AuthenticateUserService);
    container.bind<IGoogleAuthService>(SERVICE_TYPES.GoogleAuthService).to(GoogleAuthService);
    container.bind<IUserService>(SERVICE_TYPES.UserService).to(UserService);
    container.bind<IInstallService>(SERVICE_TYPES.InstallService).to(InstallService);
    container.bind<IMenuService>(SERVICE_TYPES.MenuService).to(MenuService);
    container.bind<IRoleService>(SERVICE_TYPES.MenuService).to(RoleService);
    container.bind<IPermissionService>(SERVICE_TYPES.MenuService).to(PermissionService);
}

export { IInstallService , IAuthService, IGoogleAuthService, IUserService, IMenuService, IRoleService, IPermissionService }