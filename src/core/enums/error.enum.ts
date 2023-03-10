export enum ErrorEnum {
    Login_Invalid = 100,
    Login_Inactive = 110,
    Invalid_Token = 120,
    User_Not_Found = 130,
    Duplicate_Record = 140,
    Password_Not_Match = 150,
    UnAuthorized = 160,
    Token_Expired = 170,
    UnAuthorized_Access = 180,
    Api_Rate_Limit = 190,
    Error_Upload_Files = 200,
    Error_Update = 210,
    Error_Create = 220,
    Error_Delete = 220,
    Not_Found = 404,
    Upload_File_Error = 230
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
    [ErrorEnum.Error_Create, "Created failed!"],
    [ErrorEnum.Error_Update, "Updated failed!"],
    [ErrorEnum.Error_Delete, "Deleted failed!"],
    [ErrorEnum.Not_Found, "Not Found!"],
    [ErrorEnum.Upload_File_Error, "Upload File Error!"]
]);