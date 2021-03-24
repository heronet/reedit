const multer = require("multer");
const Post = require("../models/Post");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});


exports.getPosts = async (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    let postQuery;

    if(pageSize && currentPage) {
        postQuery = await Post.find().skip(pageSize * (currentPage - 1)).limit(pageSize);
    } else {
        postQuery = await Post.find();
    }
    const posts = await postQuery;
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
    try {
        const post = new Post({
            title: req.body.title,
            content: req.body.content,
            creator: req.userData.userId
        });
        post.save().then((data) => {
            res.status(200).json({success: true, data});
        });
    } catch (error) {
        res.status(404).json({success: true, error});
    }
}

exports.imageUpload = multer({ storage: storage }).single("image");

exports.deletePost = async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    if(post.creator == req.userData.userId) {
        await Post.findByIdAndDelete(req.params.id);
        return res.status(200).json(post);
    }
    return res.status(401).json({message: "Auth failed"});
}

exports.updatePost = async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    
    if(post.creator == req.userData.userId) {
        await post.updateOne(req.body);
        return res.status(201).json(post);
    }
    return res.status(401).json({message: "Auth failed"});
}