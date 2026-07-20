import Message from "../models/Message.js";

import Conversation from "../models/Conversation.js";

export const createConversation = async (req, res) => {
  const { receiverId } = req.body;

  let conversation = await Conversation.findOne({
    participants: {
      $all: [req.user._id, receiverId],
    },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [req.user._id, receiverId],
    });
  }

  res.json(conversation);
};

export const sendMessage = async (req, res) => {
  const {
    conversationId,

    text,
  } = req.body;

  const message = await Message.create({
    conversation: conversationId,

    sender: req.user._id,

    text,
  });

  await Conversation.findByIdAndUpdate(
    conversationId,

    {
      lastMessage: message._id,
    },
  );

  res.json(message);
};

export const getMessages = async (req, res) => {
  const messages = await Message.find({
    conversation: req.params.id,
  })

    .populate("sender", "name");

  res.json(messages);
};
