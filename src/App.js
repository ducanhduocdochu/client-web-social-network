import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import ProfilePage from "scenes/profilePage";
import PostPage from "scenes/postPage";
import SearchPage from "scenes/searchPage";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import { io } from "socket.io-client";
import { showToast } from "utils/showToast";
import { setNotifications } from "state";

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));
  const user = useSelector((state) => state.user);
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch()

  useEffect(() => {
    if(user){
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to server");
    });

    newSocket.on("getNotification", (data) => {
      console.log(data)
      if(data.noti_type == "NEW POST"){
        showToast('info', 'Notification', `${data.noti_sender_name} posted a new article`, 3000, dispatch)
      } else if(data.noti_type == "ADD FRIEND"){
        showToast('info', 'Notification', `${data.noti_sender_name} send friend request`, 3000, dispatch)
      } else if(data.noti_type == "ACCEPT FRIEND"){
        showToast('info', 'Notification', `${data.noti_sender_name} accept friend request`, 3000, dispatch)
      }
    });

    return () => {
      newSocket.disconnect();
    };}
  }, []);

  useEffect(() => {
    if (socket && user.user_name) {
      socket.emit("addUser",user.user_name);
    }
  }, [socket, user]);
  
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/home"
              element={isAuth ? <HomePage /> : <Navigate to="/" />}
            />
            <Route
              path="/profile/:userId"
              element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
            />
            <Route
              path="/post/:postId"
              element={isAuth ? <PostPage /> : <Navigate to="/" />}
            />
            <Route
              path="/search"
              element={isAuth ? <SearchPage /> : <Navigate to="/" />}
            />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
