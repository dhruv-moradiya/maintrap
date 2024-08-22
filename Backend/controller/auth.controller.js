import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import {
  generateTokenAndSetCookie,
  generateVerificationToken,
} from "../utils/utils.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mailtrap/emails.js";

export const signup = async (req, res) => {
  const { email, name, password } = req.body;

  try {
    if (!email || !name || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const userAlreadyExist = await User.findOne({ email });
    if (userAlreadyExist) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationToken();

    const user = await new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpireAt: Date.now() + 24 * 60 * 60 * 1000,
    }).save();

    generateTokenAndSetCookie({ res, userId: user._id });

    await sendVerificationEmail({ name, email, verificationToken });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;

  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpireAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpireAt = undefined;
    await user.save();

    await sendWelcomeEmail({ name: user.name, email: user.email });

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }

    generateTokenAndSetCookie({ res, userId: user._id });

    user.lastLogin = Date.now();

    await user.save();

    return res.status(200).json({ success: true, message: "Login success" });
  } catch (error) {}
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const resetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const resetTokenExpireAt = Date.now() + 1 * 60 * 60 * 1000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpireAt = resetTokenExpireAt;

    await user.save();

    await sendPasswordResetEmail({ name: user.name, email, resetToken });

    return res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const changePassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetTokenExpireAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ status: false, message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpireAt = undefined;

    sendResetSuccessEmail(user.email);

    await user.save();
    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const checkAuth = async (req, res) => {
  console.log("req :>> ", req);
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
