import { Router } from "express"
import { post } from "../models/Post.js"
import { user } from "../models/User.js"

export const postRouter =Router()

//create post

postRouter.post("/",async(req,res)=>{
    const newPost = new post(req.body)
    try {
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)
    } catch (error) {
        res.status(500).json(error)
    }
    })

//update post
postRouter.put("/:id",async(req,res)=>{
   try {
    const Post = await post.findById(req.params.id);
    if(Post.userId===req.body.userId){
        await Post.updateOne({$set:req.body});
        res.status(200).json("the post has been update")
    }else{
         res.status(403).json("you can't update post since user dont match")
    }
   } catch (error) {
        res.status(500).json(error)
   }
   
})

//delete post
postRouter.delete("/:id",async(req,res)=>{
    try {
     const Post = await post.findById(req.params.id);
     if(Post.userId===req.body.userId){
         await Post.deleteOne({$set:req.body});
         res.status(200).json("the post has been delete")
     }else{
          res.status(403).json("you can't delete post since user dont match")
     }
    } catch (error) {
         res.status(500).json(error)
    }
    
 })
//like, dislike post
postRouter.put("/:id/like",async(req,res)=>{
    try {
        const Post = await post.findById(req.params.id)
        if(!Post.like.includes(req.body.userId)){
            await Post.updateOne({$push:{like:req.body.userId}})
            res.status(200).json("The post has been liked")
        }
        else{
            await Post.updateOne({$pull:{like:req.body.userId}})
            res.status(200).json("The post has been unliked")

        }
    } catch (error) {
        res.status(500).json(error)
    }
   

})
//get post

postRouter.get("/:id",async(req,res)=>{
    try {
        const Post = await post.findById(req.params.id);
        res.status(200).json(Post)
    } catch (error) {
        res.status(500).json(error)
    }
})

//get timelines post
postRouter.get("/timeline/all",async(req,res)=>{
    try {
        const currentUser = await user.findById(req.body.userId)
        const UserPost = await post.find({userId:currentUser.id})
        const friendPost = await Promise.all(
            currentUser.following.map( friendId=>{
                return post.find({userId:friendId})
            })
        )
    res.json(UserPost.concat(...friendPost))
    } catch (error) {
        res.status(500).json(error)

    }
}
)
