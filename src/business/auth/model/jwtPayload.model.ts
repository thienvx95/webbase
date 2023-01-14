import { UserDto } from "@business/user/model/user.dto";

export class JwtPayload {
    constructor(user: UserDto){
        console.log("🚀 ~ file: jwtPayload.model.ts:5 ~ JwtPayload ~ constructor ~ user", user)
        this.id = user.id;
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