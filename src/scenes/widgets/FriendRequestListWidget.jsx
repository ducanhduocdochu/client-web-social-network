import { Box, Typography, useTheme } from "@mui/material";
import FriendRequest from "components/FriendRequest";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFetchPost } from "utils/fetchApi";

const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const [followList, setFollowList] =  useState([])  
  const [friends, setFriends] =  useState(null)  

  const getFriends = async () => {
    const response = await getFetchPost(
      `friend/${userId}`,
      {
        method: "GET",
      }
    );
    const data = await response.json();
    setFriends(data.metadata);
  };

  const getUserFollowUser = async () => {
    const response = await getFetchPost(
      `follow/${userId}`,
      {
        method: "GET",
      }
    );
    const data = await response.json();
    const filteredFriend = data.metadata.filter(obj1 => !friends.some(obj2 => obj1.follower_user_id === obj2.user_id));
    setFollowList(filteredFriend);
  };

  useEffect(() => {
    getFriends()
  }, []);

  useEffect(() => {
    if(friends){
      getUserFollowUser();
    }
  }, [friends, userId]);

  return (
    <WidgetWrapper className="mt-[32px]">
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Follow List
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {followList?.map((follow) => (
          <FriendRequest
            key={follow._id}
            friendId={follow.follower_user_id}
            name={`${follow.follower_user_name}`}
            userPicturePath={follow.follower_user_avatar}
          />
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
