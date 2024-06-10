import {
  Box,
  useMediaQuery,
} from "@mui/material";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import PostsWidgetPage from "scenes/widgets/PostsWidgetPage";


const ProfilePage = () => {
  const { postId } = useParams();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  return (
    <Box>
      <Navbar />
      <div className="flex justify-center w-full">
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
          className="w-[600px]"
        >
          <Box m="2rem 0" /> 
          <PostsWidgetPage postId={postId} />
      </Box>
      </div>
    </Box>

  );
};

export default ProfilePage;
