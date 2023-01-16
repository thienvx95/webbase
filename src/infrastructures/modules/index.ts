export const COMMON_TYPES = {
  EventDispatcher: Symbol.for('EventDispatcher'),
  AutoMapper: Symbol.for('AutoMapper'),
  SiteSettings: Symbol.for('SiteSettings'),
  MemoryCache: Symbol.for('MemoryCache'),
};

export const SERVICE_TYPES = {
  AuthService: Symbol.for('AuthService'),
  GoogleAuthService: Symbol.for('GoogleAuthService'),
  UserService: Symbol.for('UserService'),
  InstallService: Symbol.for('InstallService'),
  MenuService: Symbol.for('MenuService'),
  RoleService: Symbol.for('RoleService'),
  PermissionService: Symbol.for('PermissionService'),
  SettingService: Symbol.for('SettingService'),
  FileUploadService: Symbol.for('FileUploadService'),
  FileUploader: Symbol.for('FileUploader'),
};

export const REPOSITORY_TYPES = {
  UserRepository: Symbol.for('UserRepository'),
  UserTokenRepository: Symbol.for('UserTokenRepository'),
  LanguageRepository: Symbol.for('LanguageRepository'),
  RoleRepository: Symbol.for('RoleRepository'),
  SettingRepository: Symbol.for('SettingRepository'),
  MenuRepository: Symbol.for('MenuRepository'),
  DomainHostRepository: Symbol.for('DomainHostRepository'),
  FileUploadRepository: Symbol.for('FileUploadRepository'),
  PermissionRepository: Symbol.for('PermissionRepository'),
};
