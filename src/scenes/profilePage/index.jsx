import { ManageAccountsOutlined, People, PersonAdd } from "@mui/icons-material";
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
import PostsWidgetUser from "scenes/widgets/PostsWidgetUser";
import UserWidgetProfile from "scenes/widgets/UserWidgetProfile";
import { getFetchPost } from "utils/fetchApi";
import { showToast } from "utils/showToast";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [friendQuantity, setFriendQuantity] = useState(0);
  const [isFriend, setIsFriend] = useState(false);
  const [isFollow, setIsFollow] = useState(false);
  const { userId } = useParams();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const { id } = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  const getUser = async () => {
    const response = await getFetchPost(`user/${userId}`, {
      method: "GET",
      headers: { "client-id": id, authorization: token.accessToken },
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

  const getFriends = async () => {
    const response = await getFetchPost(`friend/${userId}`, {
      method: "GET",
    });
    const data = await response.json();
    if (data.metadata) {
      setFriendQuantity(data.metadata.length);
      setIsFriend(() => data.metadata.some((item) => item.user_id === id));
    } else {
      showToast(
        "error",
        "Error",
        "Get Friend fail, please reload",
        3000,
        dispatch
      );
    }
  };

  const getUserFollowUser = async () => {
    const response = await getFetchPost(`follow/${userId}`, {
      method: "GET",
    });
    const data = await response.json();
    setIsFollow(() =>
      data.metadata.some((item) => item.follower_user_id === id)
    );
  };

  const handlePatchFriend = async () => {
    const response = await getFetchPost(`follow/${userId}`, {
      method: "PUT",
      headers: { "client-id": id, authorization: token.accessToken },
    });
    const data = await response.json();
    if (data.metadata) {
      if(data.metadata.status){
        showToast("success", "Success", "Begin follow user", 3000, dispatch);
      }else{
        showToast("success", "Success", "Delete follow user", 3000, dispatch);
      }
      getFriends();
      getUserFollowUser();
    } else {
      showToast("error", "Error", "Error, please try again", 3000, dispatch);
    }
  };

  useEffect(() => {
    getUser();
    getFriends();
    getUserFollowUser();
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
                <Typography color={medium}>{friendQuantity} friends</Typography>
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

          {userId == id ? (
            <Button
              className={`bottom-[-70px] left-[950px] absolute`}
              sx={{
                "&:hover": {
                  backgroundColor: palette.primary.main,
                  cursor: "pointer",
                },
              }}
            >
              <ManageAccountsOutlined
                fontSize="large"
                color={`${palette.mode === "light" ? "#858585" : "#ffffff"}`}
                style={{
                  color: `${palette.mode === "light" ? "#858585" : "#ffffff"}`,
                }}
              />
              <p
                className={`ml-2 mt-1 ${
                  palette.mode === "dark" ? "text-white" : "text-[#858585]"
                }`}
              >
                Edit Profile
              </p>
            </Button>
          ) : (
            <div>
              {isFriend ? (
                <Button
                  className={`bottom-[-70px] left-[950px] absolute`}
                  sx={{
                    "&:hover": {
                      backgroundColor: palette.primary.main,
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => handlePatchFriend()}
                >
                  <People
                    fontSize="large"
                    color={`${
                      palette.mode === "light" ? "#858585" : "#ffffff"
                    }`}
                    style={{
                      color: `${
                        palette.mode === "light" ? "#858585" : "#ffffff"
                      }`,
                    }}
                  />
                  <p
                    className={`ml-2 mt-1 ${
                      palette.mode === "dark" ? "text-white" : "text-[#858585]"
                    }`}
                  >
                    Friend
                  </p>
                </Button>
              ) : (
                // ----------------------
                <div>
                  {isFollow ? (
                    <Button
                      className={`bottom-[-70px] left-[950px] absolute`}
                      sx={{
                        "&:hover": {
                          backgroundColor: palette.primary.main,
                          cursor: "pointer",
                        },
                      }}
                      onClick={() => handlePatchFriend()}
                    >
                      <PersonAdd
                        fontSize="large"
                        color={`${
                          palette.mode === "light" ? "#858585" : "#ffffff"
                        }`}
                        style={{
                          color: `${
                            palette.mode === "light" ? "#858585" : "#ffffff"
                          }`,
                        }}
                      />
                      <p
                        className={`ml-2 mt-1 ${
                          palette.mode === "dark"
                            ? "text-white"
                            : "text-[#858585]"
                        }`}
                      >
                        Following
                      </p>
                    </Button>
                  ) : (
                    <Button
                      className={`bottom-[-70px] left-[950px] absolute`}
                      sx={{
                        "&:hover": {
                          backgroundColor: palette.primary.main,
                          cursor: "pointer",
                        },
                      }}
                      onClick={() => handlePatchFriend()}
                    >
                      <PersonAdd
                        fontSize="large"
                        color={`${
                          palette.mode === "light" ? "#858585" : "#ffffff"
                        }`}
                        style={{
                          color: `${
                            palette.mode === "light" ? "#858585" : "#ffffff"
                          }`,
                        }}
                      />
                      <p
                        className={`ml-2 mt-1 ${
                          palette.mode === "dark"
                            ? "text-white"
                            : "text-[#858585]"
                        }`}
                      >
                        Add Friend
                      </p>
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
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
          {userId == id ? (
            <UserWidgetProfile userId={userId} picturePath={user.user_avatar} />
          ) : (
            <div className="mt-[32px]">
              <UserWidgetProfile
                userId={userId}
                picturePath={user.user_avatar}
              />
            </div>
          )}
          <Box m="2rem 0" />
          <FriendListWidget userId={userId} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          {userId == id && <MyPostWidget picturePath={user.user_avatar} />}
          <Box m="2rem 0" />
          <PostsWidgetUser userId={userId} isProfile />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
