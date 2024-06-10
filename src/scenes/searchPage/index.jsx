import {
  Box,
  Button,
  useMediaQuery,
} from "@mui/material";
import Friend from "components/Friend";
import User from "components/User";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import Post from "scenes/widgets/Post";
import PostsWidgetPage from "scenes/widgets/PostsWidgetPage";
import { getFetchPost } from "utils/fetchApi";
import { showToast } from "utils/showToast";


const SearchPage = () => {
  const [listUser, setListUser] = useState(null)
  const [listPost, setListPost] = useState(null)
  const {id, user_name, user_avatar} = useSelector(state => state.user)
  const token = useSelector(state => state.token)
  const dispatch = useDispatch()
  const getPosts = async ({text_search}) => {
    const response = await getFetchPost(`search/post?text_search=${text_search}`, {
      method: "GET",
    });
    const data = await response.json();
    if (data.metadata) {
      setListPost(data.metadata);
    } else {
      showToast(
        "error",
        "Error",
        "Search post fail, please research",
        3000,
        dispatch
      );
    }
  };

  const getUsers = async ({text_search}) => {
    const response = await getFetchPost(`search/user?text_search=${text_search}`, {
      method: "GET",
    });
    const data = await response.json();
    if (data.metadata) {
      setListUser(data.metadata);
    } else {
      showToast(
        "error",
        "Error",
        "Search user fail, please research",
        3000,
        dispatch
      );
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const text_search = searchParams.get('text_search');
    getPosts({text_search})
    getUsers({text_search})
  }, []);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  return (
    <Box>
      <Navbar />
      <div className="flex justify-center w-full">
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
          className="w-[600px] my-10"
        >
          <WidgetWrapper>
          <Box display="flex" flexDirection="column" gap="1.5rem">
          {listUser?.map((user) => (
            <div key={user.id}>
          <User
            friendId={user.id}
            name={`${user.user_name}`}
            userPicturePath={user.user_avatar}
          /></div>
        ))}
        </Box>

        <Box display="flex" className="mt-4" flexDirection="column" gap="1.5rem">
          <Button>
            More
          </Button>
        </Box>

        </WidgetWrapper>
        
        {/* <WidgetWrapper className="mt-4"> */}
        {listPost?.map((post) => (
        <div key={post._id}>
          <Post
            postId={post._id}
            postUserId={post.author_id}
            name={post.author_name}
            description={post.content}
            location={post.location}
            picturePath={
              post.video_images && post.video_images.length > 0
                ? post.video_images[0]
                : null
            }
            userPicturePath={post.author_avatar}
            likes={post.likes}
            comments={post.comments}
            shares={post.shares}
            isPublished={post.isPublished}
            createdAt={post.createdAt}
            user_name={user_name}
            user_id={id}
            token={token}
            is_like={post.is_like}
            share_from_user_id={post.share_from_user_id}
            share_from_user_name={post.share_from_user_name}
          />
        </div>
      ))}
        <Box display="flex" className="mt-4" flexDirection="column" gap="1.5rem">
          <Button>
            More
          </Button>
        </Box>
        {/* </WidgetWrapper> */}

      </Box>
      </div>
    </Box>

  );
};

export default SearchPage;
