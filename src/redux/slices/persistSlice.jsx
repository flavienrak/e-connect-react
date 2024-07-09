import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  authToken: "",
  mode: "light",
  theme: "default",
};

const persistSlice = createSlice({
  name: "persistInfos",
  initialState,
  reducers: {
    updatePersistInfos: (state, action) => {
      const { authToken, mode, theme } = action.payload;
      if (typeof authToken !== "undefined") {
        state.authToken = authToken;
      }
      if (mode) {
        state.mode = mode;
      }
      if (theme) {
        state.theme = theme;
      }
    },
  },
});

export const { updatePersistInfos } = persistSlice.actions;
export default persistSlice.reducer;
