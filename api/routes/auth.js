import { Router } from "express"
import { user } from "../models/User.js"
import bcrypt from "bcrypt"
export const authRouter = Router()
//register
authRouter.post("/register", async (req,res)=>{

    try {
        //tạo mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,salt)
        //tạo tài khoản
        const newUser = new user({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword,
    
        })
        //save user vào database and response
        const User = await newUser.save();
        res.status(200).json(User)
    } catch (error) {
        res.status(500).json(error)
    }
    })

authRouter.post("/login", async (req,res)=>{
    try {
        const uSer = await user.findOne({email:req.body.email})
        !uSer && res.status(404).send("user not found")
        const validPassword =await bcrypt.compare(req.body.password,uSer.password)
        !validPassword && res.status(404).send("password not found")
        res.status(200).json(uSer)
        }
    catch (error) {
        res.status(500).json(error)
    }
}
)
    

    

