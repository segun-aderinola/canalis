import { CreateUser } from "../dtos/create-user.dto";
import { IUser } from "../model/user.model";

class UserFactory {
  static createUser(data: CreateUser) {
    const user = {} as IUser;

    user.name = data.name;
    user.email = data.email;
    user.phoneNumber = data.phoneNumber;
    user.roleId = data.roleId;
    user.supervisorId = data.supervisorId;
    user.password = data.password;
    user.address = data.address;
    user.region = data.region;


     
    return user;
  }
}

export default UserFactory;
