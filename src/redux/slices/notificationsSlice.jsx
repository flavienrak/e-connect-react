import { createSlice } from "@reduxjs/toolkit";

const initialState = { notifications: [] };

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    fetchNotifications: (state, action) => {
      const { notifications } = action.payload;
      state.notifications = notifications;
    },
    updateAllNotifications: (state, action) => {
      const { notifications } = action.payload;
      state.notifications = state.notifications.map((notification) => {
        const updatedNotification = notifications.find(
          (item) => item._id === notification._id
        );
        return updatedNotification
          ? { ...notification, ...updatedNotification }
          : notification;
      });
    },
    addNotificationInfos: (state, action) => {
      const { notification } = action.payload;
      const index = state.notifications.findIndex(
        (item) => item._id === notification._id
      );
      if (index !== -1) {
        state.notifications.splice(index, 1);
      }
      state.notifications.unshift(notification);
    },
    deleteOneNotificationInfos: (state, action) => {
      const { notification } = action.payload;
      const index = state.notifications.findIndex(
        (item) => item._id === notification._id
      );
      if (index !== -1) {
        state.notifications.splice(index, 1);
      }
    },
    deleteNotificationsInfos: (state, action) => {
      const { notifications } = action.payload;
      const notificationIdsToDelete = new Set(
        notifications.map((item) => item._id)
      );
      state.notifications = state.notifications.filter(
        (item) => !notificationIdsToDelete.has(item._id)
      );
    },
    removeNotifications: () => {
      state = initialState;
    },
  },
});

export const {
  fetchNotifications,
  addNotificationInfos,
  deleteOneNotificationInfos,
  deleteNotificationsInfos,
  updateAllNotifications,
  removeNotifications,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
