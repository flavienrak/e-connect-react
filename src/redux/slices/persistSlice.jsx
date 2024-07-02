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
      let newState = { ...state };
      if (typeof authToken !== "undefined") {
        newState.authToken = authToken;
      }
      if (mode) {
        newState.mode = mode;
      }
      if (theme) {
        newState.theme = theme;
      }
      return newState;
    },
  },
});

export const { updatePersistInfos } = persistSlice.actions;
export default persistSlice.reducer;
