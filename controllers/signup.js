import { signupJoi } from "../Joi/signupJoi.js";
import logger from "../logger.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const handleAddUser = async (req, res) => {
  const { error } = signupJoi.validate(req.body);
  if (error) {
    logger.warn(`Signup validation failed: ${error.details[0].message}`);
    return res.status(400).json({ msg: error.details[0].message });
  }
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      logger.warn(`Signup failed: Email already exists (${email})`);
      return res.status(400).json({ msg: "email already exists" });
    }

    const addUser = new User({
      name,
      email,
      password,
    });

    await addUser.save();
    const token = jwt.sign({ userId: addUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    logger.info(`User registered: ${email}`);

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.log(error);
    logger.error(`Signup Error: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
