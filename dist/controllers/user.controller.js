import cloudinary from "../configs/cloudinary.config";
import User from "../models/user.model";
export const updateUserProfile = async (req, res) => {
    try {
        const { image, ...otherData } = req.body;
        let updatedData = { ...otherData };
        // Handling image update
        if (image) {
            // Check if the image is in base64 format
            if (image.startsWith("data:image")) {
                try {
                    const uploadResponse = await cloudinary.uploader.upload(image, {
                        folder: "Sparkmate_User",
                    });
                    updatedData.image = uploadResponse.secure_url;
                }
                catch (error) {
                    return res.status(400).json({
                        success: false,
                        msg: "Error uploading the image",
                    });
                }
            }
        }
        // Update the user in the database
        const updatedUser = await User.findByIdAndUpdate(req.userId, updatedData, {
            new: true,
        });
        return res.status(200).json({
            success: true,
            msg: "User updated successfully",
            updatedUser,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            msg: error.message,
        });
    }
};
export const getUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        return res.status(200).json({
            success: true,
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
// export const updateUserProfile = async (req: any, res: any) => {
//   try {
//     const { image, ...otherData } = req.body;
//     let updatedData = otherData;
//     // Handling image update
//     if (image) {
//       // base64 format
//       if (image.startWith("data:image")) {
//       try {
//         const uploadResponse: any = cloudinary.uploader.upload(image, {
//           folder: "Sparkmate_User",
//         });
//         updatedData.image = (await uploadResponse?.secure_url) as any;
//       } catch (error) {
//         return res.status(400).json({
//           success: false,
//           msg: "Error uploading the image",
//         });
//         }
//       }
//     }
//     const updatedUser = await User.findByIdAndUpdate(req.userId, updatedData, {
//       new: true,
//     });
//     return res.status(200).json({
//       success: true,
//       msg: "User updated successfully",
//       updatedUser,
//     });
//   } catch (error: any) {
//     return res.status(500).json({
//       success: false,
//       msg: error.message,
//     });
//   }
// };
