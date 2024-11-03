import User from "../models/user.model";

class AuthService {
  public async createUser(data: {
    name: string;
    email: string;
    password: string;
    gender: string;
    age: number;
    genderPreference: string;
    bio:string;
  }) {
    const newUser = new User({
      name: data.name,
      email: data.email,
      password: data.password,
      gender: data.gender,
      age: data.age,
      genderPreference: data.genderPreference,
      bio:data.bio
    });

    await newUser.save();
    return newUser;
  }

  public async findUserByEmail(email: string) {
    return await User.findOne({ email });
  }

}

export default new AuthService();
