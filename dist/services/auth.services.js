import User from "../models/user.model.js";
class AuthService {
    async createUser(data) {
        const newUser = new User({
            name: data.name,
            email: data.email,
            password: data.password,
            gender: data.gender,
            age: data.age,
            genderPreference: data.genderPreference,
            bio: data.bio
        });
        await newUser.save();
        return newUser;
    }
    async findUserByEmail(email) {
        return await User.findOne({ email });
    }
}
export default new AuthService();
