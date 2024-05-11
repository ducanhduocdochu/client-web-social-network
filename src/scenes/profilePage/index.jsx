import { ManageAccountsOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import UserImage from "components/UserImage";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import UserWidgetProfile from "scenes/widgets/UserWidgetProfile";
import { getFetchPost } from "utils/fetchApi";
import { showToast } from "utils/showToast";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  const getUser = async () => {
    const response = await getFetchPost(`user/${userId}`, {
      method: "GET",
      headers: { "client-id": userId, authorization: token.accessToken },
    });
    const data = await response.json();
    if (data.code === 500) {
      showToast(
        "error",
        "End of session",
        "Please login again",
        3000,
        dispatch
      );
      setTimeout(() => navigate("/"), 3000);
    }
    if (data.metadata) {
      setUser(data.metadata.foundUser);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  if (!user) return null;

  return (
    <Box>
      <Navbar />
      <div className="flex justify-center mb-[100px]">
        <div className="relative">
          <div className="absolute bottom-[-110px] left-[100px]">
            <UserImage image={user.user_avatar} size={180} />
          </div>
          <div className="bottom-[-70px] left-[320px] absolute">
            <FlexBetween gap="1rem">
              <Box>
                <Typography
                  variant="h1"
                  color={dark}
                  fontWeight="500"
                  sx={{
                    "&:hover": {
                      color: palette.primary.light,
                      cursor: "pointer",
                    },
                  }}
                >
                  {user.user_name}
                </Typography>
                <Typography color={medium}>0 friends</Typography>
              </Box>
            </FlexBetween>
          </div>
          <img
            style={{
              width: "1200px",
              height: "400px",
              borderRadius: "0.75rem",
              marginTop: "0.75rem",
              objectFit: "cover",
            }}
            alt="bia"
            src={`${"https://toiyeumeo.com/wp-content/uploads/2021/03/hinh-nen-may-tinh-hinh-meo-768x432.jpg"}`}
          />

          <Button
            className={`bottom-[-70px] left-[950px] absolute`}
            sx={{
              "&:hover": {
                backgroundColor: palette.primary.main,
                cursor: "pointer",
              },
            }}
            // onClick={patchLike}
          >
            <ManageAccountsOutlined
              fontSize="large"
              color={`${palette.mode === "light" ? "#858585" : "#ffffff"}`}
              style={{ color: `${palette.mode === "light" ? "#858585" : "#ffffff"}` }}
            />
            <p
              className={`ml-2 mt-1 ${
                palette.mode === "dark" ? "text-white" : "text-[#858585]"
              }`}
            >
              Edit Profile
            </p>
          </Button>
        </div>
      </div>

      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidgetProfile userId={userId} picturePath={user.user_avatar} />
          <Box m="2rem 0" />
          <FriendListWidget userId={userId} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget picturePath={user.user_avatar} />
          <Box m="2rem 0" />
          <PostsWidget userId={userId} isProfile />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
