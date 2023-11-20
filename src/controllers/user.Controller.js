import User from "../models/user.Model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Cart from "../models/cart.Model.js"
import {
  LOGIN_ADMIN_TOKEN,
  LOGIN_USER_TOKEN,
  TOKEN_SECRET,
} from "../config.js";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "../helpers/userValidation.js";

export const createUser = async (req, res) => {
  const { username, password, email } = req.body;

  let errorUsername = validateUsername({ username: username });
  let errorEmail = validateEmail({ email: email });
  let errorPassword = validatePassword({ password: password });

  if (errorUsername || errorPassword || errorEmail) {
    return res
      .status(401)
      .json({ message: errorUsername ?? errorEmail ?? errorPassword });
  }

  try {
    const emailFound = await User.findOne({ email: email });
    
    if (emailFound) {
      return res
        .status(400)
        .json({ message: "El email ingresado ya esta registrado." });
    }

    const usernameFound = await User.findOne({ username: username });
    if (usernameFound) {
      return res.status(400).json({
        message: "El nombre de usuario ingresado ya esta registrado.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username: username,
      password: passwordHashed,
      email: email,
      role: "User",
      premium: false
    });

    const newCart = await Cart.create({
      products: [],
      ownerId: newUser._id
    })

    const token = jwt.sign(
      {
        userId: newUser._id,
        userRoleToken:
          newUser.role == "User" ? LOGIN_USER_TOKEN : LOGIN_ADMIN_TOKEN,
        userEmail: newUser.email,
      },
      TOKEN_SECRET
    );

    res.status(201).json({ token: token, username: newUser.username });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  let { userId, userRoleToken } = req.userToken;

  try {
    let userFound = await User.findById(id);

    if (!userFound) {
      return res.status(404).json({ message: "no encontrado" });
    }

    if (userFound._id !== userId && userRoleToken !== LOGIN_ADMIN_TOKEN) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await User.findByIdAndDelete(id);
    res.status(200)
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updatePremiumUser = async (req,res) =>{
  let { userRoleToken, userId } = req.userToken;

  try {
    let userFound = await Product.findById(id);

    if (userFound._id !== userId && userRoleToken !== LOGIN_ADMIN_TOKEN) {
      return res.status(403).json({ message: "Forbidden" });
    }

    userFound.premium = !userFound.premium
    await userFound.save()
    res.status(200).json({id: userFound._id})

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export const login = async (req, res) => {
  let { user, password } = req.body;

  let userFound = await User.findOne({
    $or: [{ username: user }, { email: user }],
  });

  if (!userFound) {
    return res
      .status(418)
      .json({ message: "Nombre de usuario o email incorrectos" });
  }

  const validPassword = await bcrypt.compare(password, userFound.password);

  if (!validPassword) {
    return res.status(400).json({ message: "Contraseña inválida" });
  }

  const token = jwt.sign(
    {
      userId: userFound._id,
      userRoleToken:
      userFound.role == "User" ? LOGIN_USER_TOKEN : LOGIN_ADMIN_TOKEN,
      userEmail: userFound.email,
    },
    TOKEN_SECRET
  );

  res.status(200).json({ token: token, username: userFound.username });
};
