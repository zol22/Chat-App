import { findAllUsersExceptLoggedInUser, findMessages, createNewMessage } from '../services/message.service.js'; 

// Get all users except loggedInUser for sidebar
export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await findAllUsersExceptLoggedInUser(loggedInUserId);

        res.status(200).json({ success: true, filteredUsers});
    } catch (error) {
        res.status(500).json({ error: 'Internal Sever Error', details : error.message });
    }

}

// Retrieve all messages exchanged between two users: the currently logged-in user (loggedInUserId) and another user (userToChatId).
export const getMessages = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const {id:userToChatId} = req.params.id;
        const messages = await findMessages(loggedInUserId, userToChatId);

        res.status(200).json({ success: true, messages});
        
    } catch (error) {
        res.status(500).json({ error: 'Internal Sever Error', details : error.message });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const {id:receiverId } = req.params._id
        const loggedInUserId = req.user._id // Extract the userId saved in the request which was saved in there thanks to the middleware

        let imageUrl;
        if (image) { // If user is sending an image, we will upload it to cloudinary
            //Upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }
        const newMessage = await createNewMessage(loggedInUserId, receiverId, text, imageUrl)
        // todo real time funcitonallity goes here -> socket.io

        res.status(200).json({ success: true, newMessage});
    } catch (error) {
        res.status(500).json({ error: 'Internal Sever Error', details : error.message });
    }
}