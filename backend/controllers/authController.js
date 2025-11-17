import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import crypto from 'crypto';
import User from '../models/userModel.js';
import { sendEmail } from '../utils/sendEmail.js';


/* ------------------ REGISTER USER ------------------ */
export const registerUser = expressAsyncHandler( async (req, res) => {
        const {name, email, password } = req.body;

        //check all fields
        if(!name || !email || !password){
            res.status(400);
            throw new Error("Please enter all fields!");
        }

        //if user EXISTS
        const userExists = await User.findOne({email});
        if(userExists){
            res.status(400);
            throw new Error("User already Exists!");
        }

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        //generate verification token
        const verificationToken = crypto.randomBytes(32).toString("hex");

        //create user 
        const user = await User.create({
            name, 
            email, 
            password: hashPassword,
            isVerified: false,
            verificationToken,
        });

        //Email verification link
        const verifyURL = `http://localhost:5173/verify-email/${verificationToken}`;
        const message = `
        <h2>Welcome ${name}!</h2>
        <p>Click below to verify your email:</p>
        <a href="${verifyURL}" target="_blank">${verifyURL}</a>
        <p>This link will expire soon.</p>
        `;

        try{
            await sendEmail(user.email, "Verify Your Email", message);
            res.status(201).json({
              message: "User registered successfully! Please check your email to verify your account.",
            });
        } catch (err){
            console.log(err);
            user.verificationToken = undefined;
            await user.save();
            res.status(500);
            throw new Error("Could not send verification email.");
        }
});


/* ------------------ VERIFY EMAIL ------------------ */

export const verifyEmail = expressAsyncHandler( async(req, res) => {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });
    if(!user) {
        res.status(400);
        throw new Error("Invalid or expired verification token.")
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ 
        message: "Your email has been successfully verified! You can now log in." 
    });
});


/* ------------------ LOGIN USER ------------------ */
export const loginUser = expressAsyncHandler( async(req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({ email });
    if(!user){
        res.status(400);
        throw new Error("User not found!");
    }

    if(!user.isVerified){
        res.status(400);
        throw new Error("Please verify your email before logging in!");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
       res.status(400);
       throw new Error("Invalid Credentials!");
    }

    res.status(200).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
    });
});


/* ------------------ FORGOT PASSWORD ------------------ */
export const forgotPassword = expressAsyncHandler( async (req, res) => {
    const {email} = req.body;

    const user = await User.findOne({ email });
    if(!user){
        res.status(404);
        throw new Error("User not found!");
    }
   
    //generate a password reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    //Set reset token and expiry (1 hour)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();
    
    //Create password reset URL 
    const resetURL = `http://localhost:5173/reset-password/${resetToken}`;

    //message
    const message = `
      <h2>Password Reset Request</h2>
      <p>Click below to reset your password:</p>
      <a href="${resetURL}" target="_blank">${resetURL}</a>
      <p>This link will expire in 1 hour.</p>
      `;

      try{
        await sendEmail(user.email, "Password Reset Request", message);
        res.status(200).json({ message: "Password reset email sent successfully!" })
      } catch (err){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(500);
        throw new Error("Email could not be sent. Try again later.");
      }
});


/* ------------------ RESET PASSWORD ------------------ */
export const resetPassword = expressAsyncHandler( async(req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
    });

    if(!user){
        res.status(400);
        throw new Error("Invalid or expired password reset token.");
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
        message: "Password reset successful! You can now log in."
    });
});


/* ------------------ GET CURRENT USER ------------------ */
export const getMe = expressAsyncHandler( async(req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    
    res.status(201).json(user);
});

/* ------------------ GENERATE TOKEN ------------------ */
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
}

export const deleteAllUsers = async (req, res) => {
  try {
    await User.deleteMany({});
    return res.status(200).json({
      message: "All users deleted successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting users",
      error: error.message,
    });
  }
};

