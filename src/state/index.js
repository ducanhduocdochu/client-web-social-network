import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  friends: [],
  posts: [],
  toasts: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => {
      state.friends = action.payload
    },
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    setPost: (state, action) => {
      // const updatedPosts = state.posts?.map((post) => {
      //   if (post._id === action.payload.post._id) return action.payload.post;
      //   return post;
      // });
      // state.posts = updatedPosts;
      state.posts = [action.payload, ...state.posts];
    },
    addToast: (state, action) => {
      state.toasts.push(action.payload);
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    }
  },
});

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost, addToast, removeToast } =
  authSlice.actions;
export default authSlice.reducer;
