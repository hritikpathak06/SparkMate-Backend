import { ZodError } from "zod";
import { loginSchema, registerSchema } from "../validation/user.validation.js";
import authServices from "../services/auth.services.js";
import { generateJWTToken } from "../configs/generateJwtToken.js";
import User from "../models/user.model.js";
// Register User
export const registerUser = async (req, res) => {
    try {
        const parseData = registerSchema.parse(req.body);
        const { name, email, age, password, gender, genderPreference, bio } = parseData;
        const existingUser = await authServices.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                msg: "User already exists",
            });
        }
        if (age < 18) {
            return res.status(400).json({
                sucess: false,
                msg: "You are not allowed to use this web app",
            });
        }
        await authServices.createUser({
            name,
            email,
            password,
            age,
            gender,
            genderPreference,
            bio
        });
        return res.status(201).json({
            success: true,
            msg: "User registered successfully",
        });
    }
    catch (error) {
        if (error instanceof ZodError) {
            const errorMessages = error.errors[0].message;
            return res.status(400).json({
                success: false,
                msg: errorMessages,
            });
        }
        return res.status(500).json({
            success: false,
            msg: error.message,
        });
    }
};
// Login user
export const loginUser = async (req, res) => {
    try {
        const parseData = loginSchema.parse(req.body);
        const { email, password } = parseData;
        const user = await authServices.findUserByEmail(email);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "Invalid email",
            });
        }
        const isPasswordSame = await user.matchPassword(password);
        if (!isPasswordSame) {
            return res.status(404).json({
                success: false,
                msg: "Invalid Credentials",
            });
        }
        const token = await generateJWTToken(user._id);
        res.cookie("token", token, {
            maxAge: 15 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "None",
        });
        return res.status(200).json({
            success: true,
            msg: "user logged in successfull",
            user,
            token,
        });
    }
    catch (error) {
        if (error instanceof ZodError) {
            const errorMessages = error.errors[0].message;
            return res.status(400).json({
                success: false,
                msg: errorMessages,
            });
        }
        return res.status(500).json({
            success: false,
            httpOnly: true,
            secure: true,
            sameSite: "None",
            msg: error.message,
        });
    }
};
// Logout user
export const logoutUser = async (req, res) => {
    try {
        res.cookie("token", null, {
            maxAge: 0,
        });
        return res.status(200).json({
            success: true,
            msg: "User logged out successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            msg: error.message,
        });
    }
};
// Me
export const myProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        return res.status(200).json({
            success: true,
            msg: "user fetched successully",
            user,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            msg: error.message,
        });
    }
};
