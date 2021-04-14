const Message = require("../models/Message")
const User = require("../models/User");
const { getIo } = require("../socket");


// api/messages
exports.sendMessage = async (req, res, next) => {
    try {
        const currentUser = await User.findById(req.userData.userId);
        const recipientUser = await User.findOne({username: req.body.to});
        let message = new Message({
            text: req.body.text,
            sender: currentUser,
            recipient: recipientUser
        });
        // recipientUser.messages.unshif(message);
        // currentUser.messages.unshif(message);

        const result = await Message.create(message);

        // await recipientUser.save();
        // await currentUser.save();
        getIo().emit("message", result);
        
        res.status(201).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}
// HTTPGET
// api/messages
exports.getMessage = async (req, res, next) => {
    try {
        const message = await Message.findById(req.params.id);
        res.status(201).json(message);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

exports.getConversation = async (req, res, next) => {
    try {
        const recipient = await User.findOne({username: req.params.recipient});
        const currentUser = await User.findById(req.userData.userId);
        
        let messages = await Message.find({sender: currentUser, recipient: recipient}).populate("recipient", "username").populate("sender", "username");
        const more_messages = await Message.find({sender: recipient, recipient: currentUser}).populate("recipient", "username").populate("sender", "username");
        
        messages = await messages.concat(more_messages).sort((a, b) => {
            return a.createdAt - b.createdAt;
        });
        
        res.status(200).json(messages);
    } catch (error) {
        console.log(error);
    }
}

exports.getInbox = async (req, res, next) => {
    try {
        const currentUser = await User.findById(req.userData.userId);
        let messages = await Message.find({sender: currentUser}).populate("recipient", "username").populate("sender", "username");
        const more_messages = await Message.find({recipient: currentUser}).populate("recipient", "username").populate("sender", "username");

        messages = messages.concat(more_messages);
        let inbox = {};
        for(let each of messages) {
            if(each.sender.username === currentUser.username)
                inbox[each.recipient.username] = each;
            if(each.recipient.username === currentUser.username)
                inbox[each.sender.username] = each;
        }
        res.status(200).json(inbox);
    } catch (error) {
        console.log(error);
    }
}