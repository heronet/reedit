const User = require("../models/User")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res, next) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            email: req.body.email,
            password: hash
        });
        await user.save();
        res.status(201).json({message: "User Created", user});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error});
    }
}
exports.getUsers = async (req, res, next) => {
    const users = await User.find();
    res.status(200).json(users);
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
            const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id}, 'secret', { expiresIn: "1h" });
            res.status(200).json({token, expiresIn: 3600, userId: fetchedUser._id});
        })
        .catch(err => {
            return res.status(401).json({ message: "Auth failed" });
        });
}