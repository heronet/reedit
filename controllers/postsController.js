const Post = require("../models/Post");
const User = require("../models/User");
const { getIo } = require("../socket");
const cloudinary = require('cloudinary').v2;
const sharp = require('sharp');


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.getPosts = async (req, res, next) => {
    try {
        const pageSize = +req.query.pagesize;
        const currentPage = +req.query.page;
        let postQuery;

        // Post by a specific user

        const poster = req.query.userId;

        if(pageSize && currentPage) {
            postQuery = await Post.find().sort({date: -1}).skip(pageSize * (currentPage - 1)).limit(pageSize);
        } else if(poster) {
            postQuery = await Post.find({creator: poster}).sort({date: -1});
        } else {
            postQuery = await Post.find().sort({date: -1});
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
        let post;
        if(req.file) {
            //const url = req.protocol + '://' + req.get('host') + "/images/" + req.file.filename;
            const filePath = __basedir + "/images/" + req.file.filename;
            let newFilePath = __basedir + "/images/" + 'converted-'+ req.file.filename;
            await sharp(filePath).jpeg({quality: 40}).toFile(newFilePath);
            await cloudinary.uploader.upload(newFilePath, (error, result) => {
                post = new Post({
                    title: req.body.title,
                    content: req.body.content,
                    creator: req.userData.userId,
                    creatorName: user.username,
                    imagePath: result.secure_url,
                    imagePuplicId: result.public_id
                });
            });
        } else {
            post = new Post({
                title: req.body.title,
                content: req.body.content,
                creator: req.userData.userId,
                creatorName: user.username
            });
        }
        post.save().then((data) => {
            return res.status(200).json({success: true, data: {...data, id: data._id}});
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Creating post failed"});
    }
}

exports.deletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.creator == req.userData.userId) {
            if(post.imagePuplicId) {
                await cloudinary.uploader.destroy(post.imagePuplicId, (error, result) => {
                    console.log(result, error);
                });
            }
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
    const user = await User.findById(req.userData.userId);
    let imagePath = req.body.imagePath;
    req.body.creator = req.userData.userId;
    req.body.username = user.username;
    if(req.file) {
        //const url = req.protocol + '://' + req.get('host');
        const filePath = __basedir + "/images/" + req.file.filename;
        let newFilePath = __basedir + "/images/" + 'converted-'+ req.file.filename;
        await sharp(filePath).jpeg({quality: 50}).toFile(newFilePath);
        await cloudinary.uploader.upload(newFilePath, (error, result) => {
            imagePath = result.secure_url;
            req.body.imagePath = imagePath;
        });
        //imagePath = url + "/images/" + req.file.filename
    }
    if(post.creator == req.userData.userId) {
        await post.updateOne(req.body);
        return res.status(201).json(post);
    }
    return res.status(401).json({message: "Not authorized"});
}

exports.addComment = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        await post.updateOne(req.body);
        return res.status(201).json(post);
    } catch (error) {
        return res.status(401).json({message: "Not authorized"});
    }
}

// Likes 

exports.likePost = async (req, res, next) => {
    try {
        const currentUser = await User.findById(req.userData.userId);
        const likedPost = await Post.findById(req.params.id);
        // TODO: Get the post -> add like to it -> save it


        await likedPost.likes.unshift(currentUser);
        await likedPost.save();
        await currentUser.likes.unshift(likedPost);
        
        await currentUser.save();

        // getIo().emit("like", likedPost.likes.length);
        
        res.status(201).json({"success": true, likes: likedPost.likes.length});
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}
exports.unlikePost = async (req, res, next) => {
    try {
        const currentUser = await User.findById(req.userData.userId);
        const likedPost = await Post.findById(req.params.id);

        likedPost.likes = likedPost.likes.filter(item => item.toString() !== currentUser._id.toString());
        
        await likedPost.save();
        currentUser.likes = currentUser.likes.filter(item => {
            return item.toString() !== likedPost._id.toString();
        });
        await currentUser.save();
        
        // getIo().socket.emit("like", likedPost.likes.length);
        
        res.status(201).json({"success": true, likes: likedPost.likes.length});
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

exports.userLikes = async (req, res, next) => {
    try {
        const user = await User.findById(req.userData.userId);
        const likes = user.likes;

        res.status(200).json(likes);
    } catch (error) {
        console.log(error);
    }
}