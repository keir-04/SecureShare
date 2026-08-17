const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  createUser,
  findUserByEmail,
} = require("../models/User");

exports.register = async (req, res) => {

  try {

    const { fullname, email, password } = req.body;

    const exists = findUserByEmail(email);

    if (exists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    createUser(fullname, email, hashed);

    res.status(201).json({
      success: true,
      message: "Registration Successful",
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }

};

exports.login = async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = findUserByEmail(email);

    if (!user) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {

      return res.status(400).json({
        message: "Invalid Credentials",
      });

    }

    const token = jwt.sign(

      {
        id: user.id,
        email: user.email,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "1d",
      }

    );

    res.json({

      success: true,

      token,

      user: {

        id: user.id,
        fullname: user.fullname,
        email: user.email,

      },

    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }

};