import { Message } from '../models/message.model.js';
import User from '../models/user.model.js';
import { io } from '../server.js'; // Import the Socket.io instance from the server

// Function to send a message
export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;

    // Check if the sender has purchased the trainer
    const user = await User.findById(senderId);
    if (!user.trainerPurchased || !user.trainerDetails.equals(receiverId)) {
      return res.status(403).json({ message: 'You must purchase the trainer to chat.' });
    }

    // Create and save the message
    const message = new Message({
      senderId,
      receiverId,
      content,
      createdAt: new Date(),
      isRead: false,
      chatType: 'private',
    });

    await message.save();

    // Emit the new message to both sender and receiver
    io.to(senderId).emit('new_message', message);
    io.to(receiverId).emit('new_message', message);

    return res.status(200).json({ message: 'Message sent successfully', data: message });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error sending message' });
  }
};

// Function to get all messages between a user and a trainer
export const getMessages = async (req, res) => {
  try {
    const { userId, trainerId } = req.params;

    // Fetch all messages between the user and trainer
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: trainerId },
        { senderId: trainerId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json({ messages });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error retrieving messages' });
  }
};
