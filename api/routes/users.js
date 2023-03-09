import { Router } from "express";
import { user} from "../models/User.js"
import bcrypt from "bcrypt"
export const userRouter = Router()

userRouter.get("/",(req,res)=>{
    res.send("hello user")
})


//update user
userRouter.put("/:id",async(req,res)=>{
    if(req.body.userId===req.params.id ||req.body.isAdmin){
        if(req.body.password){
            try {
                const salt=await bcrypt .genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password,salt)
            } catch (error) {
                return res.status(500).json(error)
            }
        }
        try {
                await user.findByIdAndUpdate(req.body.id,{
                $set:req.body,
            })
            res.status(200).json("account has been updated")
        }catch(error){
            res.status(500).json(error)
        }      
    }
    else{
        return res.status(403).json("you can update on")
    }
})

//delete user
userRouter.delete("/:id",async(req,res)=>{
    if(req.body.userId===req.params.id ||req.body.isAdmin){
        try {
                await user.findByIdAndDelete(req.params.id)
                res.status(200).json("account has been deleted")
            }
           catch(error){
            res.status(500).json(error)
        }      
    }
    else{
        return res.status(403).json("you can delete on")
    }
})

//get a user

userRouter.get("/:id",async(req,res)=>{
    try {
        const User = await user.findById(req.params.id)
        const {password,updatedAt, ...other}=User._doc
        res.status(200).json(other)

    } catch (error) {
        res.status(500).json(error)
    }
})

//follow user
userRouter.put("/:id/follow",async(req,res)=>{
    if(req.body.userId!==req.params.id){
        try {
            const followingUser = await user.findById(req.params.id);
            const followedUser = await user.findById(req.body.userId);
            if(!followingUser.followers.includes(req.body.userId))
            {
                await followingUser.updateOne({$push:{following:req.body.userId}});
                await followedUser.updateOne({$push:{followers:req.params.id}});
                res.status(200).json("user has been follow")
            }else{
                res.status(403).json("you already follow this user")
            }

        } catch (error) {
            res.status(500).json(err)
        }
    }else{
        res.status(403).json("you cant follow")
    }
})

//unfollow user

userRouter.put("/:id/unfollow",async(req,res)=>{
    if(req.body.userId!==req.params.id){
        try {
            const unfollowingUser = await user.findById(req.params.id);
            const unfollowedUser = await user.findById(req.body.userId);
            if(unfollowingUser.following.includes(req.body.userId))
            {
                await unfollowingUser.updateOne({$pull:{following:req.body.userId}});
                await unfollowedUser.updateOne({$pull:{followers:req.params.id}});
                res.status(200).json("user has been unfollow")
            }else{
                res.status(403).json("you already unfollow this user")
            }

        } catch (error) {
            res.status(500).json(err)
        }
    }else{
        res.status(403).json("you can't unfollow yourself")
    }
})
