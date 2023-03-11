//alt shift f de format lai code
import { Router } from "express";
import { user } from "../models/User.js";
import bcrypt from "bcrypt";
export const authRouter = Router();
import Jwt from "jsonwebtoken";
//register
authRouter.post("/register", async (req, res) => {
  try {
    //tạo mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    //tạo tài khoản
    const newUser = new user({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    //save user vào database and response
    const User = await newUser.save();
    res.status(200).json(User);
  } catch (error) {
    res.status(500).json(error);
  }
});

const generateAccessToken = (users) => {
  return Jwt.sign({ id: users.email, password: users.password }, "mySecretKey", {
    expiresIn: "15m",
  });
};


authRouter.post("/login", async (req, res) => {
  try {
    const uSer = await user.findOne({ email: req.body.email });
    !uSer && res.status(404).send("Email or Password is wrong");
    const validPassword = await bcrypt.compare(
      req.body.password,
      uSer.password
    ); 
    if(!validPassword){
      res.status(404).send("Email or Password is wrong");
    }else{
      const accessToken = generateAccessToken(uSer);
      res.status(200).json({
        username: uSer.email,
        isAdmin: uSer.isAdmin,
        accessToken
      });
    }  
  } catch (error) {
    res.status(500).json(error);
  }
});
