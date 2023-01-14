import { UserDto } from "@business/user/model/user.dto";

export class JwtPayload {
    constructor(user: UserDto){
        this.id = user._id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.roles = user.roles.map(x => x.toString());
        this.avatar = user.avatar;
    }

    id: string;
    firstName: string;
    lastName: string;
    roles: string[];
    avatar: string;
}