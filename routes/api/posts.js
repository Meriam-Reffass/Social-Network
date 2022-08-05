const express = require("express");
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const router = require("express").Router();
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
router.post(
  "/",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await User.findById(req.user.id).select('-password')
        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        })
        const post = await newPost.save()
        res.json(post)
        
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Server Error')
        
    }
   

}
);
router.get("/:id", [auth], async (req,res)=>{
    try {
        const posts = await Post.findById(req.params.id);
        if(!posts){
            return res.status(404).json({msg: 'Post not found'})
        }
        res.json(posts)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})
router.delete("/:id",auth,async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id)
        if(!post){
            return res.status(404).json({msg: 'Post not found'})
        }
       
        if(post.user.toString() !== req.user.id){
            return res.status(401).json({msg: 'User not authorized' })
        }
        await post.remove()
        res.json(post)
        
    } catch (err) {
        console.error(err.message)
        return res.status(500).send('Server Error')
        
    }
})
router.put("/like/:id", auth, async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        //check if the post has already been liked
        if(post.likes.filter(like=>like.user.toString()===req.user.id).length>0){
            return res.status(400).json({msg: 'post alreaddy liked'})
        }
        post.likes.unshift({user: req.user.id});
        await post.save();
        res.json(post.likes)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send('Server Error')
    }
})
module.exports = router;
