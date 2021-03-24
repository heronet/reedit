const Post = require("../models/Post");

exports.getPosts = async (req, res, next) => {
    const posts = await Post.find();
    res.status(200).json({success: true, data: posts});
}

exports.getPost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post) {
            res.status(200).json({success: true, data: post});
        } else {
            res.status(404).json({success: false, message: "Not found"});
        }
    } catch (error) {
        res.status(404).json({success: false, message: "Not found"});
    }
}

exports.createPost = (req, res, next) => {
    const post = new Post({
        title: req.body.title, content: req.body.content
    });
    post.save().then((data) => {
        res.status(200).json({success: true, data});
    });
}

exports.deletePost = async (req, res, next) => {
    const post = await Post.findByIdAndDelete(req.params.id);
    res.status(201).json({success: true, data: post});
}

exports.updatePost = async (req, res, next) => {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body);
    await post.save();
    res.status(201).json({success: true});
}