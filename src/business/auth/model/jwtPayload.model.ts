import { UserDto } from "@business/user/model/user.dto";

export class JwtPayload {
    constructor(user: UserDto){
        this.sub = user.id;
        this.fullname = user.fullname;
        this.email = user.email;
        this.roles = user.roles.map(x => x.toString());
        this.avatar = user.avatar;
    }

    sub: string;

    fullname: string;

    email: string;

    roles: string[];

    avatar: string;
}