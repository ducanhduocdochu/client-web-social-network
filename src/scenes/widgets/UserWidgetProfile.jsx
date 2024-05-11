import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme } from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "utils/showToast";

const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const dispatch = useDispatch()

  const getUser = async () => {
    const response = await fetch(`http://localhost:3002/v1/api/user/${userId}`, {
    method: "GET",
    headers: { "client-id": userId, "authorization": token.accessToken },
  });
    const data = await response.json();
    if(data.code === 500){
      showToast('error', 'End of session', "Please login again", 3000, dispatch)
      setTimeout(() =>navigate("/"), 3000);
    }
    if(data.metadata){
      setUser(data.metadata.foundUser);
    } 
  };

  useEffect(() => {
    getUser();
  }, []);

  if (!user) {
    return null;
  }

  const {
    user_name,
    user_avatar,
    user_location,
    user_occupation,
    user_twitter,
    user_facebook,
    user_linkedin
  } = user;

  return (
    <WidgetWrapper>
      <Divider />
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{user_location? user_location:"Empty"}</Typography>
          <EditOutlined sx={{ color: main }} className="ml-[116px]" />
        </Box>
        <Box display="flex" alignItems="center" gap="1rem">
          <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{user_occupation? user_occupation:"Empty"}</Typography>
          <EditOutlined sx={{ color: main }} className="ml-[116px]" />
        </Box>
      </Box>

      <Divider />

      {/* THIRD ROW */}
      <Box p="1rem 0">
        <FlexBetween mb="0.5rem">
          <Typography color={medium}>Who's viewed your profile</Typography>
          <Typography color={main} fontWeight="500">
            {0}
          </Typography>
        </FlexBetween>
        <FlexBetween>
          <Typography color={medium}>Impressions of your post</Typography>
          <Typography color={main} fontWeight="500">
            {0}
          </Typography>
        </FlexBetween>
      </Box>

      <Divider />

      {/* FOURTH ROW */}
      <Box p="1rem 0">
        <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
          Social Profiles
        </Typography>

        <FlexBetween gap="1rem" mb="0.5rem">
          <FlexBetween gap="1rem">
            <img src="../assets/twitter.png" alt="twitter" />
            <Box>
              <Typography color={main} fontWeight="500">
                Twitter
              </Typography>
              <Typography color={medium}>{user_twitter? user_twitter:"Empty"}</Typography>
            </Box>
          </FlexBetween>
          <EditOutlined sx={{ color: main }} />
        </FlexBetween>

        <FlexBetween gap="1rem">
          <FlexBetween gap="1rem">
            <img src="../assets/linkedin.png" alt="linkedin" />
            <Box>
              <Typography color={main} fontWeight="500">
                Linkedin
              </Typography>
              <Typography color={medium}>{user_linkedin? user_linkedin:"Empty"}</Typography>
            </Box>
          </FlexBetween>
          <EditOutlined sx={{ color: main }} />
        </FlexBetween>

        <FlexBetween gap="1rem" className="mt-2">
          <FlexBetween gap="1rem">
            <img src="../assets/facebook.jpg" className="w-[26px] h-[26px]" alt="facebook" />
            <Box>
              <Typography color={main} fontWeight="500">
                Facebook
              </Typography>
              <Typography color={medium}>{user_facebook? user_facebook:"Empty"}</Typography>
            </Box>
          </FlexBetween>
          <EditOutlined sx={{ color: main }} />
        </FlexBetween>
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;
