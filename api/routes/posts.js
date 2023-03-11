//alt shift f de format lai code
import { Router } from "express";
import { post } from "../models/Post.js";
import { user } from "../models/User.js";
import  Jwt  from "jsonwebtoken";
export const postRouter = Router();

//create post

//verify access token
const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    Jwt.verify(token,"mySecretKey", (err, users) => {
      if (err) {
        return res.status(400).json("token not veryfy");
      }
      req.users = users;
      next();
    });
  } else {
    res.status(400).json("you are not vertify");
  }
};


postRouter.post("/:id/create",verify, async (req, res) => {
  const newPost = new post(req.body);
  newPost.userId = req.params.id
  console.log(newPost)
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    res.status(500).json(error);
  }
});

//update post
postRouter.put("/:id/update",verify, async (req, res) => {
  try {
    const Post = await post.findById(req.params.id);
    if (Post.userId === req.body.userId) {
      await Post.updateOne({ $set: req.body });
      res.status(200).json("the post has been update");
    } else {
      res.status(403).json("you can't update post since user dont match");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//delete post
postRouter.delete("/:id/delete", verify,async (req, res) => {
  try {
    const Post = await post.findById(req.params.id);
    if (Post.userId === req.body.userId) {
      await Post.deleteOne();
      res.status(200).json("the post has been delete");
    } else {
      res.status(403).json("you can't delete post since user dont match");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
//like, dislike post
postRouter.put("/:id/like",verify, async (req, res) => {
  try {
    const Post = await post.findById(req.params.id);
    if (!Post.like.includes(req.body.userId)) {
      await Post.updateOne({ $push: { like: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await Post.updateOne({ $pull: { like: req.body.userId } });
      res.status(200).json("The post has been unliked");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
//get post

postRouter.get("/:id",verify,async (req, res) => {
  try {
    const Post = await post.findById(req.params.id);
    res.status(200).json(Post);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get timelines post
postRouter.get("/timeline/all",verify, async (req, res) => {
  try {
    const currentUser = await user.findById(req.body.userId);
    const UserPost = await post.find({ userId: currentUser.id });
    const friendPost = await Promise.all(
      currentUser.following.map((friendId) => {
        return post.find({ userId: friendId });
      })
    );
    res.json(UserPost.concat(...friendPost));
  } catch (error) {
    res.status(500).json(error);
  }
});
