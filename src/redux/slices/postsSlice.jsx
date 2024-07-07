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
      state.posts = posts;
    },
    addOnePostInfos: (state, action) => {
      const { post } = action.payload;
      state.posts = [post, ...state.posts];
    },
    removeOnePostInfos: (state, action) => {
      const { post } = action.payload;
      state.posts = state.posts.filter((item) => item._id !== post._id);
    },
    updatePostInfos: (state, action) => {
      const { post } = action.payload;
      state.posts = state.posts.map((item) =>
        item._id === post._id ? post : item
      );
    },
    updateLikesPostInfos: (state, action) => {
      const { post } = action.payload;
      state.posts = state.posts.map((item) =>
        item._id === post._id ? { ...item, likes: post.likes } : item
      );
    },
    updateCommentsPostInfos: (state, action) => {
      const { post } = action.payload;
      state.posts = state.posts.map((item) =>
        item._id === post._id ? { ...item, comments: post.comments } : item
      );
    },
    removePostsInfos: () => {
      state = initialState;
    },
  },
});

export const {
  fetchPostsInfos,
  addOnePostInfos,
  updatePostInfos,
  updateLikesPostInfos,
  updateCommentsPostInfos,
  removeOnePostInfos,
  removePostsInfos,
} = postsSlice.actions;

export default postsSlice.reducer;
