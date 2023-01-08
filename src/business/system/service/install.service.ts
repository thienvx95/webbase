import { Application } from '@infrastructures/applicationInfo';
import { Role, User, Setting, Menu, DomainHost } from '@entities/index';
import { PasswordUtil } from '@core/ultis';
import { DefaultPassword } from '@core/constants';
import { Roles } from '@core/enums/role.enum';
import { Language } from '@entities/localization/language.entity';
import * as settingsData from '../../../data/setting.json';
import { inject, injectable } from 'inversify';
import { IRepository, REPOSITORY_TYPES } from '@infrastructures/modules/repositories';
import { COMMON_TYPES, ISiteSettings } from '@infrastructures/modules/common';

export interface IInstallService {
  install(): Promise<boolean>;
}
@injectable()
export class InstallService implements IInstallService {
  constructor(
    @inject(REPOSITORY_TYPES.UserRepository) private userRepository: IRepository<User>,
    @inject(REPOSITORY_TYPES.RoleRepository) private roleRepository: IRepository<Role>,
    @inject(REPOSITORY_TYPES.LanguageRepository) private languageRepository: IRepository<Language>,
    @inject(REPOSITORY_TYPES.SettingRepository) private settingRepository: IRepository<Setting>,
    @inject(REPOSITORY_TYPES.MenuRepository) private menuRepository: IRepository<Menu>,
    @inject(REPOSITORY_TYPES.DomainHostRepository) private domainHostRepository: IRepository<DomainHost>,
    @inject(COMMON_TYPES.SiteSettings) private siteSettings: ISiteSettings,
  ) {}

  async install(): Promise<boolean> {
    if (Application.isInstall) {
      return true;
    }
    await this.installSettings();
    await this.installRoles();
    await this.installUsers();
    await this.installLanguages();
    await this.installDomainHost();
    await this.installMenus();
    Application.getInstance().setIsInstall(true);
    return true;
  }

  async installLanguages(): Promise<void> {
    this.languageRepository.insertIfNotExist(
      { _id: 'en-gb' },
      { _id: 'en-gb', name: 'English', rtl: false, sortOrder: 0 },
    );
    this.languageRepository.insertIfNotExist(
      { _id: 'vi-vn' },
      { _id: 'vi-vn', name: 'Vietnamese', rtl: false, sortOrder: 1 },
    );
  }

  async installSettings(): Promise<void> {
    const arrayDataObject = settingsData as Array<Setting>
    for(const setting of arrayDataObject){
      await this.settingRepository.insertIfNotExist({ _id: setting._id }, setting);
    }
  }

  async installDomainHost(): Promise<void> {
    this.domainHostRepository.insertIfNotExist(
      { name: 'Default' },
      {
        name: 'Default',
        domain: 'localhost',
        primary: true,
        scheme: 'http',
        languageCode: 'en-gb',
      },
    );
  }

  async installMenus(): Promise<void> {
    this.menuRepository.insertIfNotExist(
      { _id: 'DASHBOARD_ADMIN' },
      {
        _id: 'DASHBOARD_ADMIN',
        authority: [Roles.Admin],
        name: 'admin',
        icon: 'crown',
        layout: false,
        sortOrder: 0
      },
    );
    this.menuRepository.insertIfNotExist(
      { _id: 'DASHBOARD_ADMIN_ACCOUNT_MANAGEMENT' },
      {
        _id: 'DASHBOARD_ADMIN_ACCOUNT_MANAGEMENT',
        authority: [Roles.Admin],
        path: '/dashboard/admin/account-management/',
        name: 'account-management',
        parentId: "DASHBOARD_ADMIN",
        sortOrder: 0
      },
    );
    this.menuRepository.insertIfNotExist(
      { _id: 'DASHBOARD_ADMIN_USER_LIST_PAGE' },
      {
        _id: 'DASHBOARD_ADMIN_USER_LIST_PAGE',
        authority: [Roles.Admin],
        path: '/dashboard/admin/account-management/users',
        name: 'user-list',
        parentId: "DASHBOARD_ADMIN_ACCOUNT_MANAGEMENT",
        sortOrder: 0
      },
    );

    this.menuRepository.insertIfNotExist(
      { _id: 'DASHBOARD_ADMIN_ROLE_LIST_PAGE' },
      {
        _id: 'DASHBOARD_ADMIN_ROLE_LIST_PAGE',
        authority: [Roles.Admin],
        path: '/dashboard/admin/account-management/roles',
        name: 'role-list',
        parentId: "DASHBOARD_ADMIN_ACCOUNT_MANAGEMENT",
        sortOrder: 0
      },
    );

    this.menuRepository.insertIfNotExist(
      { _id: 'DASHBOARD_ADMIN_CONFIGURATION' },
      {
        _id: 'DASHBOARD_ADMIN_CONFIGURATION',
        authority: [Roles.Admin],
        path: '/dashboard/admin/configuration/',
        name: 'configuration',
        parentId: "DASHBOARD_ADMIN",
        sortOrder: 0
      },
    );

    this.menuRepository.insertIfNotExist(
      { _id: 'DASHBOARD_ADMIN_MENU_LIST_PAGE' },
      {
        _id: 'DASHBOARD_ADMIN_MENU_LIST_PAGE',
        authority: [Roles.Admin],
        path: '/dashboard/admin/configuration/menus',
        name: 'menu-list',
        parentId: "DASHBOARD_ADMIN_CONFIGURATION",
        sortOrder: 0
      },
    );

    this.menuRepository.insertIfNotExist(
      { _id: 'DASHBOARD_ADMIN_SYSTEM' },
      {
        _id: 'DASHBOARD_ADMIN_SYSTEM',
        authority: [Roles.Admin],
        path: '/dashboard/admin/system/',
        name: 'system',
        parentId: "DASHBOARD_ADMIN",
        sortOrder: 0
      },
    );

    this.menuRepository.insertIfNotExist(
      { _id: 'DASHBOARD_ADMIN_SETTING_LIST_PAGE' },
      {
        _id: 'DASHBOARD_ADMIN_SETTING_LIST_PAGE',
        authority: [Roles.Admin],
        path: '/dashboard/admin/system/settings',
        name: 'settings',
        parentId: "DASHBOARD_ADMIN_SYSTEM",
        sortOrder: 0
      },
    );
  }

  async installRoles(): Promise<void> {
    this.roleRepository.insertIfNotExist(
      { _id: Roles.Admin },
      { _id: Roles.Admin, description: 'Admin' },
    );
    this.roleRepository.insertIfNotExist(
      { _id: Roles.User },
      { _id: Roles.User, description: 'User' },
    );
  }

  async installUsers(): Promise<void> {
    const passwordSettings = (this.siteSettings.get('Password_Default') as string);
    const defaultPassword = await PasswordUtil.encryptPassword(
      10,
      passwordSettings ?? DefaultPassword,
    );
    const admin = new User({
      email: 'admin@webapp.com',
      password: defaultPassword,
      username: 'admin',
      fullname: 'admin',
      avatar:
        'https://gravatar.com/avatar/64e1b8d34f425d19e1ee2ea7236d3028?s=40&d=retro',
      roles: [Roles.Admin, Roles.User],
    });
    await this.userRepository.insertIfNotExist({ username: 'admin' }, admin);

    const user = new User({
      email: 'user@webapp.com',
      password: defaultPassword,
      username: 'user',
      fullname: 'user',
      avatar:
        'https://gravatar.com/avatar/64e1b8d34f425d19e1ee2ea7236d3028?s=40&d=retro',
      roles: [Roles.User],
    });
    await this.userRepository.insertIfNotExist({ username: 'user' }, user);
  }
}
