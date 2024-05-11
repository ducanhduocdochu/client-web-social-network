import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";
import Post from "./Post";
import { getFetchPost } from "utils/fetchApi";
import { showToast } from "utils/showToast";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const {user_name, id} = useSelector((state) => state.user);

  const getPosts = async () => {
    const response = await getFetchPost("post", {
      method: "GET",
      headers: { "client-id": userId, authorization: token.accessToken },
    });
    const data = await response.json();
    if(data.metadata){
      dispatch(setPosts(data.metadata));
    }else{
      showToast("error", "Error", "Load post fail, please refresh", 3000, dispatch);
    }
  };

  // const getUserPosts = async () => {
  //   const response = await fetch(
  //     `http://localhost:3002/v1/api/post`,
  //     {
  //       method: "GET",
  //       headers: { "client-id": userId, "authorization": token.accessToken },
  //     }
  //   );
  //   const data = await response.json();
  //   console.log(data)
  //   dispatch(setPosts({ posts: data }));
  // };

  // useEffect(() => {
  //   if (isProfile) {
  //     getUserPosts();
  //   } else {
  //     getPosts();
  //   }
  // }, []);

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <>
      {posts?.map((post) => (
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
    </>
  );
};

export default PostsWidget;
