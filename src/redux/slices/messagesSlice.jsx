import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    fetchMessagesInfos: (state, action) => {
      const { messages } = action.payload;
      state.messages = messages;
    },
    updateMessagesInfos: (state, action) => {
      const { messages, userId } = action.payload;
      const userIndex = state.messages.findIndex(
        (item) => item.userId === userId
      );

      if (userIndex !== -1) {
        const existingMessages = state.messages[userIndex].messages;
        messages.forEach((item) => {
          const existingMessageIndex = existingMessages.findIndex(
            (m) => m._id === item._id
          );
          if (existingMessageIndex !== -1) {
            existingMessages[existingMessageIndex] = {
              ...existingMessages[existingMessageIndex],
              ...item,
            };
          } else {
            existingMessages.push(item);
          }
        });
      } else {
        state.messages.push({ userId, messages });
      }
    },
    addMessageInfos: (state, action) => {
      const { message, userId } = action.payload;
      const userIndex = state.messages.findIndex(
        (item) => item.userId === userId
      );

      if (userIndex !== -1) {
        state.messages[userIndex].messages.push(message);
        state.messages.sort((a, b) => {
          const lastMessageDateA = new Date(
            a.messages[a.messages.length - 1].updatedAt
          );
          const lastMessageDateB = new Date(
            b.messages[b.messages.length - 1].updatedAt
          );
          return lastMessageDateB - lastMessageDateA;
        });
      } else {
        state.messages.push({ userId, messages: [message] });
      }
    },
    deleteMessageInfos: (state, action) => {
      const { message, userId } = action.payload;
      const userIndex = state.messages.findIndex(
        (item) => item.userId === userId
      );

      if (userIndex !== -1) {
        const updatedMessages = state.messages[userIndex].messages.filter(
          (msg) => msg._id !== message._id
        );
        state.messages[userIndex].messages = updatedMessages;
        if (updatedMessages.length === 0) {
          state.messages.splice(userIndex, 1);
        } else {
          state.messages.sort((a, b) => {
            const lastMessageDateA = new Date(
              a.messages[a.messages.length - 1].updatedAt
            );
            const lastMessageDateB = new Date(
              b.messages[b.messages.length - 1].updatedAt
            );
            return lastMessageDateB - lastMessageDateA;
          });
        }
      }
    },
    removeMesssagesInfos: () => {
      state = initialState;
    },
  },
});

export const {
  fetchMessagesInfos,
  updateMessagesInfos,
  addMessageInfos,
  deleteMessageInfos,
  removeMesssagesInfos,
} = messagesSlice.actions;

export default messagesSlice.reducer;
