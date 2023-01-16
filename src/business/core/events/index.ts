/**
 * events
 * ---------------------
 * Define all your possible custom events here.
 */
export const events = {
    user: {
        created: "onUserCreate",
        updated: "onUserUpdate",
        deleted: "onUserDelete"
    },
    role: {
      created: "onRoleCreate",
      updated: "onRoleUpdate",
      deleted: "onROleDelete"
    },
    menu: {
      updated: "onMenuUpdated",
    },
    setting: {
      updated: "onSettingUpdated",
    },
    permission: {
      created: "onPermissionCreate",
      updated: "onPermissionUpdate",
      deleted: "onPermissionDelete"
    },
    fileUpload: {
      created: "onFileUploadCreate",
      updated: "onFileUploadUpdate",
      deleted: "onFileUploadDelete"
    },
  // [INSERT NEW EVENT KEY ABOVE] < Needed for generating containers seamlessly
  };