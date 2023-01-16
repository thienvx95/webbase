export class GoogleService {
    sub?: string;
    access_token?: string;
    refresh_token?: string;
  }
  
  export class UserExternalService {
    google?: GoogleService;
    facebook?: any;
  }
  