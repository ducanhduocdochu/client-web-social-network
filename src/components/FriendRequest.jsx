import { GroupAdd, Message, PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { showToast } from "utils/showToast";
import { getFetchPost } from "utils/fetchApi";
import { useState } from "react";

const FriendRequest = ({ friendId, name, userPicturePath }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [isSuccess, setIsSuccess] = useState(false)
  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const handlePatchFriend = async () => {
    const response = await getFetchPost(`follow/${friendId}`, {
      method: "PUT",
      headers: { "client-id": id, authorization: token.accessToken },
    });
    const data = await response.json();
    if (data.metadata) {
      if(data.metadata.status){
        showToast("success", "Success", "Begin add user, please reload", 3000, dispatch);
        setIsSuccess(data.metadata.status);
      }
    } else {
      showToast("error", "Error", "Error, please try again", 3000, dispatch);
    }
  };
  
  return (
    <FlexBetween>
    {!isSuccess && <>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
            navigate(0);
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
        </Box>
      </FlexBetween>
      <IconButton
        onClick={() => handlePatchFriend()}
        sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
      >
          <GroupAdd sx={{ fontSize: "25px", color: primaryDark }} />
      </IconButton></>}
    </FlexBetween>
  );
};

export default FriendRequest;
