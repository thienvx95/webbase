export const DATABASE = {
    ZONES: {
      NORTH: "NORTH",
      SOUTH: "SOUTH",
      BOTH: "BOTH",
    },
    STATUS: {
      OPEN: "OPEN",
      PENDING: "PENDING",
      ACCEPT: "ACCEPT",
      REJECT: "REJECT",
      APPROVED: "APPROVED",
      CLOSE: "CLOSE",
      DELETED: "DELETED",
  
    },
    LEAD_TYPE: {
      FULL: "FULL",
      QUICK: "QUICK",
    },
  
    PROFILE_PIC_PREFIX: {
      ORIGINAL: "profilePic_",
      THUMB: "profileThumb_",
    },
  
    LOGO_PREFIX: {
      ORIGINAL: "logo_",
      THUMB: "logoThumb_",
    },
  
    DOCUMENT_PREFIX: "document_",
  
    USER_ROLES: {
      ADMIN: "Admin",
      USER: "User",
      SUB_ADMIN: "SubAdmin",
    },
  
  
    DEVICE_TYPES: {
      IOS: "IOS",
      ANDROID: "ANDROID",
    },
  
    STATUS_TYPES: {
      USERRATE: "USERRATE",
    },
  
    GENDER: {
      MALE: "Male",
      FEMALE: "Female",
    },
  
    LANGUAGE: ["en", "ja", "ko", "vi", "zh"],
    DEFAULT_LANGUAGE: "en",
  
  };
  
  export const LogLevels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  };
  
  export const LogColors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "white",
  };
  
  export const DefaultPassword = '123456aA!@';
  export const PasswordRegex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
  export const ErrorInfoRegex = /at (?:(.+?)\s+\()?(?:(.+?):(\d+)(?::(\d+))?|([^)]+))\)?/;
  export const GoogleUrl = {
    Auth: "https://accounts.google.com/o/oauth2/v2/auth",
    Token: "https://oauth2.googleapis.com/token",
    GetUserInfo: "https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token=",
  };


  export const NameTargetTag = {
    DbProviderTag: "DbProvider"
  }

  export const ApplicationVersion = '1.0.0';