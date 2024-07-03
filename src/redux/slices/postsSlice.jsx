import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    fetchPostsInfos: (state, action) => {
      const { posts } = action.payload;
      let newState = { ...state };
      newState.posts = posts;
      return newState;
    },
    addOnePostInfos: (state, action) => {
      const { post } = action.payload;
      let newState = { ...state };
      newState.posts = [post, ...newState.posts];
      return newState;
    },
    removeOnePostInfos: (state, action) => {
      const { post } = action.payload;
      let newState = { ...state };
      const newInfos = newState.posts.filter((item) => item._id !== post._id);
      newState.posts = newInfos;
      return newState;
    },
    updateLikesPostInfos: (state, action) => {
      const { post } = action.payload;
      let newState = { ...state };
      const newInfos = newState.posts.map((item) =>
        item._id === post._id ? { ...item, likes: post.likes } : item
      );
      newState.posts = newInfos;
      return newState;
    },
    updateCommentsPostInfos: (state, action) => {
      const { post } = action.payload;
      let newState = { ...state };
      const newInfos = newState.posts.map((item) =>
        item._id === post._id ? { ...item, comments: post.comments } : item
      );
      newState.posts = newInfos;
      return newState;
    },
    removePostsInfos: () => {
      return initialState;
    },
  },
});

export const {
  fetchPostsInfos,
  addOnePostInfos,
  updateLikesPostInfos,
  updateCommentsPostInfos,
  removeOnePostInfos,
  removePostsInfos,
} = postsSlice.actions;

export default postsSlice.reducer;
