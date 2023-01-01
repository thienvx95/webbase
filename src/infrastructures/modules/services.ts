import { Container } from "inversify";
import { IAuthService, IGoogleAuthService, AuthenticateUserService, GoogleAuthService } from '@business/auth/service/index';
import { IUserService, UserService } from '@business/user/service/user.service';
import { IInstallService, InstallService } from "@business/system/service/install.service";

export const SERVICE_TYPES = {
    AuthService: Symbol.for("AuthService"),
    GoogleAuthService: Symbol.for("GoogleAuthService"),
    UserService: Symbol.for("UserService"),
    InstallService: Symbol.for("InstallService")
};

export function services(container: Container): void {
    container.bind<IAuthService>(SERVICE_TYPES.AuthService).to(AuthenticateUserService);
    container.bind<IGoogleAuthService>(SERVICE_TYPES.GoogleAuthService).to(GoogleAuthService);
    container.bind<IUserService>(SERVICE_TYPES.UserService).to(UserService);
    container.bind<IInstallService>(SERVICE_TYPES.InstallService).to(InstallService);
}

export { IInstallService , IAuthService, IGoogleAuthService, IUserService }