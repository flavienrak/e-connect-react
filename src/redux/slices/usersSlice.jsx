import { createSlice } from "@reduxjs/toolkit";

const initialState = { users: [] };

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    fetchUsers: (state, action) => {
      const { users } = action.payload;
      state.users = users;
    },
    updateUsers: (state, action) => {
      const { users } = action.payload;
      const existingUserIds = new Set(state.users.map((user) => user._id));
      const uniqueUsers = users.filter(
        (user) => !existingUserIds.has(user._id)
      );
      state.users.push(...uniqueUsers);
    },
    removeUsers: () => {
      state = initialState;
    },
  },
});

export const { fetchUsers, updateUsers, removeUsers } = usersSlice.actions;

export default usersSlice.reducer;
