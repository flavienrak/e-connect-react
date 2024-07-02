import { createSlice } from "@reduxjs/toolkit";
const initialState = { users: [] };

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    fetchUsers: (state, action) => {
      const { users } = action.payload;
      let newState = { ...state };
      newState.users = users;
      return newState;
    },
    updateUsers: (state, action) => {
      const { users } = action.payload;
      let newState = { ...state };
      let existingUserIds = new Set(newState.users.map((user) => user._id));
      let uniqueUsers = users.filter((user) => !existingUserIds.has(user._id));
      newState.users = [...newState.users, ...uniqueUsers];
      return newState;
    },
    removeUsers: () => {
      return initialState;
    },
  },
});

export const { fetchUsers, updateUsers, removeUsers } = usersSlice.actions;

export default usersSlice.reducer;
