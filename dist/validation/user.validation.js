import { z } from "zod";
export const registerSchema = z
    .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format").min(1, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    age: z.number().min(0, "Age must be a positive number"),
    gender: z.enum(["male", "female"]),
    genderPreference: z.enum(["male", "female", "both"]),
    bio: z.string().nonempty("Bio cannot be empty"),
})
    .refine((data) => {
    if (!data.genderPreference) {
        throw new Error("Gender preference is required");
    }
    return true;
}, {
    message: "Gender preference is required",
    path: ["genderPreference"],
});
export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});
