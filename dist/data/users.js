import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/user.model";
dotenv.config();
const maleNames = ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas"];
const femaleNames = ["Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen", "Nancy", "Lisa"];
const genderPreferences = ["male", "female", "both"];
const bioDescriptors = [
    "Coffee addict", "Cat lover", "Dog person", "Foodie", "Gym rat", "Bookworm", "Movie buff",
    "Music lover", "Travel junkie", "Beach bum", "City slicker", "Outdoor enthusiast",
    "Netflix binger", "Yoga enthusiast", "Craft beer connoisseur", "Sushi fanatic",
    "Adventure seeker", "Night owl", "Early bird", "Aspiring chef"
];
// james39@example.com
// mary44@example.com
// patricia32@example.com
// jennifer40@example.com
// linda31@example.com
// Generate a unique random bio with three descriptors
const generateBio = () => {
    const shuffledDescriptors = bioDescriptors.sort(() => 0.5 - Math.random());
    return shuffledDescriptors.slice(0, 3).join(" | ");
};
// Function to generate a random user
const generateRandomUser = (gender, index) => {
    const names = gender === "male" ? maleNames : femaleNames;
    const name = names[index];
    const age = Math.floor(Math.random() * (45 - 21 + 1) + 21);
    return {
        name,
        email: `${name.toLowerCase()}${age}@example.com`,
        password: bcrypt.hashSync("password123", 10),
        age,
        gender,
        genderPreference: genderPreferences[Math.floor(Math.random() * genderPreferences.length)],
        bio: generateBio(),
        image: `/${gender}/${index + 1}.jpg`,
    };
};
export const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        // Clear existing users
        await User.deleteMany({});
        // Generate male and female users
        const maleUsers = maleNames.map((_, i) => generateRandomUser("male", i));
        const femaleUsers = femaleNames.map((_, i) => generateRandomUser("female", i));
        const allUsers = [...maleUsers, ...femaleUsers];
        // Insert users into the database
        await User.insertMany(allUsers);
        console.log("Database seeded successfully with users having random, unique bios.");
    }
    catch (error) {
        console.error("Error seeding database:", error);
    }
    finally {
        mongoose.disconnect();
    }
};
// Run the seeding function
// seedUsers();
