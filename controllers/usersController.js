const User = require("../models/User")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res, next) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            email: req.body.email,
            name: req.body.name,
            username: req.body.username,
            password: hash
        });
        await user.save();
        // res.status(201).json({message: "User Created", user});
        const token = jwt.sign({email: user.email, userId: user._id}, process.env.JWT_SECRET);
        res.status(200).json({token, userId: user._id, username: user.username});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Invalid Credentials"});
    }
}
exports.getUsers = async (req, res, next) => {
    let users;
    if(req.query.search) {
        const q_string = req.query.search;
        const regex = new RegExp(q_string, 'i');
        users = await User.find({name: {$regex: regex}});
    } else {
        users = await User.find();
    }
    
    res.status(200).json(users);
}
exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch {
        console.log(error);
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json(user);
    } catch {
        console.log(error);
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.status(200).json(user);
    } catch {
        console.log(error);
    }
}

exports.loginUser = async (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email })
        .then(user => {
            if(!user)
                return res.status(401).json({ message: "Auth failed" });
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => {
            if(!result) {
                return res.status(401).json({ message: "Auth failed" });
            }
            const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id}, process.env.JWT_SECRET);
            res.status(200).json({token, userId: fetchedUser._id, username: fetchedUser.username});
        })
        .catch(err => {
            return res.status(401).json({ message: "Invalid Credentials" });
        });
}

