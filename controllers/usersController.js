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
        res.status(201).json({message: "User Created", user});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Invalid Credentials"});
    }
}
exports.getUsers = async (req, res, next) => {
    const users = await User.find();
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
            const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id}, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.status(200).json({token, expiresIn: 3600, userId: fetchedUser._id});
        })
        .catch(err => {
            return res.status(401).json({ message: "Invalid Credentials" });
        });
}