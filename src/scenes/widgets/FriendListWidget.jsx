import { Box, Typography, useTheme } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";
import { getFetchPost } from "utils/fetchApi";

const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.friends);

  const getFriends = async () => {
    const response = await getFetchPost(
      `friend/${userId}`,
      {
        method: "GET",
      }
    );
    const data = await response.json();
    dispatch(setFriends(data.metadata));
  };

  useEffect(() => {
    getFriends();
  }, []);

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Friend List
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {friends.map((friend) => (
          <Friend
            key={friend._id}
            friendId={friend.user_id}
            name={`${friend.user_name}`}
            userPicturePath={friend.user_avatar}
          />
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
