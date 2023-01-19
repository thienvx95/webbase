export class GoogleServiceDto {
    sub?: string;
    access_token?: string;
    refresh_token?: string;
  }
  
  export class UserExternalServiceDto {
    google?: GoogleServiceDto;
    facebook?: any;
  }
  