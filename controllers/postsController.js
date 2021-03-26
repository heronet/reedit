const Post = require("../models/Post");
const User = require("../models/User");

exports.getPosts = async (req, res, next) => {
    try {
        const pageSize = +req.query.pagesize;
        const currentPage = +req.query.page;
        let postQuery;

        if(pageSize && currentPage) {
            postQuery = await Post.find().skip(pageSize * (currentPage - 1)).limit(pageSize);
        } else {
            postQuery = await Post.find();
        }
        const posts = await postQuery;
        const count = await Post.countDocuments();
        res.status(200).json({success: true, data: posts, count});
    } catch {
        res.status(500).json({message: "Fetching posts failed"});
    }
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

exports.createPost = async (req, res, next) => {
    try {
        const user = await User.findById(req.userData.userId);
        const post = new Post({
            title: req.body.title,
            content: req.body.content,
            creator: req.userData.userId,
            creatorName: user.username
        });
        post.save().then((data) => {
            res.status(200).json({success: true, data});
        });
    } catch (error) {
        res.status(500).json({success: false, message: "Creating post failed"});
    }
}

exports.deletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.creator == req.userData.userId) {
            await Post.findByIdAndDelete(req.params.id);
            return res.status(200).json(post);
        } else {
            res.status(401).json({ message: "Not Authorized!"});
        }
    } catch {
        return res.status(401).json({ message: "Not Authorized!"});
    }
    
}

exports.updatePost = async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    
    if(post.creator == req.userData.userId) {
        await post.updateOne(req.body);
        return res.status(201).json(post);
    }
    return res.status(401).json({message: "Not authorized"});
}