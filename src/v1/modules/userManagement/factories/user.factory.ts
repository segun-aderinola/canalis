// import { ObjectLiteral } from "@shared/types/object-literal.type";
import { CreateUser } from "../dtos/create-user.dto";
import { IUser } from "../model/user.model";

class UserFactory {
  static createUser(data: CreateUser) {
    const user = {} as IUser;

    user.name = data.name;
    user.email = data.email;
    user.meansOfId = data.meansOfId;
    user.phoneNumber = data.phoneNumber;
    user.roleId = data.roleId;
    user.supervisorId = data.supervisorId;
    user.password = data.password;
    user.address = data.address;
    
  
    const allowedStatuses = ["active", "inactive", "deactivated"];
    user.status = allowedStatuses.includes(data.status) ? data.status : 'active';

    const hasChangedPassword = [false, true];
    user.hasChangedPassword = hasChangedPassword.includes(data.hasChangedPassword) ? data.hasChangedPassword : false;

    return user;
  }
}

export default UserFactory;
