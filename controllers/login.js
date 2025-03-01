import { loginSchema } from "../Joi/loginJoi.js";
import logger from "../logger.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const handleLogin = async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    logger.warn(`Validation Error: ${error.details[0].message}`);
    return res.status(400).json({ msg: error.details[0].message });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`Failed login attempt: Email not found (${email})`);
      return res.status(400).json({ error: "Invalid email" });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      logger.warn(`Failed login attempt: Incorrect password for ${email}`);
      return res.status(400).json({ error: "Invalid password" });
    }

    const payload = {
      id: user._id,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    logger.info(`User logged in: ${email}`);
    return res.status(200).json({ msg: "Login successful", token });
  } catch (error) {
    logger.error(`Login Error: ${error.message}`);
    res.status(500).json({ msg: "Internal server error" });
  }
};
