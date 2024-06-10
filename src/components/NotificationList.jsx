import { forwardRef } from "react";
import FlexBetween from "./FlexBetween";
import { Badge, Box, Button, useTheme } from "@mui/material";
import { CircleNotifications, PostAdd } from "@mui/icons-material";
import UserImage from "./UserImage";
import { useNavigate } from "react-router-dom";

const NotificationList = forwardRef(({ notifications }, ref) => {
  const { palette } = useTheme();
  const navigate = useNavigate();
  return (
    <FlexBetween ref={ref}>
      <FlexBetween gap="1rem">
        
        <div
          className={`${
            palette.mode === "dark" ? "bg-[#000000]" : "bg-[#ffffff]"
          } px-4 pt-2 pb-4 shadow-xl mt-[20px] rounded-2xl`}
        >
            <div className="text-[20px]">News</div>
          <Box>
            {notifications.map((notification) => {
                if(notification.noti_type == 'ADD FRIEND'){
                    return (<><Box key={notification._id} className={`${
                        palette.mode === "dark" ? "bg-[#1a1a1a]" : "bg-[#ffffff]"
                      } px-4 py-4 shadow-xl mt-[8px] rounded-2xl flex items-center`} sx={{
                        "&:hover": {
                          backgroundColor: palette.primary.light,
                          cursor: "pointer",
                        },
                      }} 
                      onClick={() => navigate(`/post/${notification.option.post_id}`)}>
                        <Badge badgeContent={<PostAdd/>} color="secondary">
                            <UserImage image={notification.noti_sender_avatar} size="40px" />
                        </Badge>
                        <div className="ml-4 mx-2">{notification.noti_sender_name} send friend requests</div>
                      </Box></>)
                }
                else if(notification.noti_type == 'ACCEPT FRIEND'){
                    return (<><Box key={notification._id} className={`${
                        palette.mode === "dark" ? "bg-[#1a1a1a]" : "bg-[#ffffff]"
                      } px-4 py-4 shadow-xl mt-[8px] rounded-2xl flex items-center`} sx={{
                        "&:hover": {
                          backgroundColor: palette.primary.light,
                          cursor: "pointer",
                        },
                      }} 
                      onClick={() => navigate(`/post/${notification.option.post_id}`)}>
                        <Badge badgeContent={<PostAdd/>} color="secondary">
                            <UserImage image={notification.noti_sender_avatar} size="40px" />
                        </Badge>
                        <div className="ml-4 mx-2">{notification.noti_sender_name} accept friend requests</div>
                      </Box></>)
                }else if(notification.noti_type == 'NEW POST'){
                    return (<><Box key={notification._id} className={`${
                        palette.mode === "dark" ? "bg-[#1a1a1a]" : "bg-[#ffffff]"
                      } px-4 py-4 shadow-xl mt-[8px] rounded-2xl flex items-center`} sx={{
                        "&:hover": {
                          backgroundColor: palette.primary.light,
                          cursor: "pointer",
                        },
                      }} 
                      onClick={() => navigate(`/post/${notification.option.post_id}`)}>
                        <Badge badgeContent={<PostAdd/>} color="secondary">
                            <UserImage image={notification.noti_sender_avatar} size="40px" />
                        </Badge>
                        <div className="ml-4 mx-2">{notification.noti_sender_name} posted a new article</div>
                      </Box></>)
                }
              
})}
          </Box>
        </div>
      </FlexBetween>
    </FlexBetween>
  );
});

export default NotificationList;
