export enum ErrorEnum {
    Login_Invalid,
    Login_Inactive,
    Invalid_Token,
    User_Not_Found,
    Duplicate_Record,
    Password_Not_Match,
    UnAuthorized,
    Token_Expired,
    UnAuthorized_Access,
    Api_Rate_Limit,
    Error_Upload_Files
}

export const ErrorMessageMapping = new Map<ErrorEnum, string>([
    [ErrorEnum.Login_Invalid, 'Username or Password is invalid'],
    [ErrorEnum.Login_Inactive, 'Username is inactive'],
    [ErrorEnum.Duplicate_Record, 'Duplicate record'],
    [ErrorEnum.Invalid_Token, "Invalid Token"],
    [ErrorEnum.User_Not_Found, 'User not found!'],
    [ErrorEnum.Password_Not_Match, 'Password not match!'],
    [ErrorEnum.UnAuthorized,"Authorized Required!"],
    [ErrorEnum.Token_Expired,"Token expired or invalid."],
    [ErrorEnum.UnAuthorized_Access,"Unauthorized Access"],
    [ErrorEnum.Api_Rate_Limit,"Too many requests, please try again later."],
    [ErrorEnum.Error_Upload_Files,"Error to upload files"],
])