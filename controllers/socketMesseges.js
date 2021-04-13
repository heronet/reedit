exports.sendMessage = async (message) => {
    try {
        socket.on('message', (message) => {
            console.log("message");
        });
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

        
        res.status(201).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}