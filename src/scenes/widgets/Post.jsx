import {
  Avatar,
  Box,
  Tab,
  Tabs,
  Button,
  useTheme,
  Typography,
  Divider,
  InputBase,
  CircularProgress,
  LinearProgress,
} from "@mui/material";

import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Slide from "@mui/material/Slide";

import CommentIcon from "components/Icon/CommentIcon";
import LikeIcon from "components/Icon/LikeIcon";
import MoreIcon from "components/Icon/MoreIcon";
import PrivateIcon from "components/Icon/PrivateIcon";
import PublicIcon from "components/Icon/PublicIcon";
import ShareIcon from "components/Icon/ShareIcon";
import UserImage from "components/UserImage";
import { forwardRef, useEffect, useState } from "react";
import { getFetchPost } from "utils/fetchApi";
import { showToast } from "utils/showToast";
import { useDispatch } from "react-redux";
import FlexBetween from "components/FlexBetween";
import { useNavigate } from "react-router-dom";
import {
  ShareLocation,
  ShareLocationRounded,
  ShareSharp,
} from "@mui/icons-material";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Post = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  shares,
  isPublished,
  createdAt,
  user_name,
  user_id,
  token,
  is_like,
  share_from_user_id,
  share_from_user_name,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { palette } = useTheme();
  const [more, setMore] = useState(true);
  const [isLike, setIsLike] = useState(is_like);
  const [like, setLike] = useState(likes);
  const [commentPre, setCommentPre] = useState(comments);
  const [share, setShare] = useState(shares);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    getComments();
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [openLike, setOpenLike] = useState(false);

  const handleClickOpenLike = () => {
    getLikes();
    setOpenLike(true);
  };
  const handleCloseLike = () => {
    setOpenLike(false);
  };
// ------------------------------
  const [openShare, setOpenShare] = useState(false);

  const handleClickOpenShare = () => {
    getShares();
    setOpenShare(true);
  };
  const handleCloseOpenShare = () => {
    setOpenShare(false);
  };

  const [listcomment, setListcomment] = useState([]);
  const [listlike, setListlike] = useState([]);
  const [listshare, setListshare] = useState([]);

  const getComments = async () => {
    const response = await getFetchPost(`comment/${postId}`, {
      method: "GET",
    });
    const data = await response.json();
    if (data.metadata) {
      setListcomment(data.metadata);
    } else {
      showToast(
        "error",
        "Error",
        "Load comment fail, please refresh",
        3000,
        dispatch
      );
    }
  };

  const getLikes = async () => {
    const response = await getFetchPost(`like/${postId}`, {
      method: "GET",
    });
    const data = await response.json();
    if (data.metadata) {
      setListlike(data.metadata);
    } else {
      showToast(
        "error",
        "Error",
        "Load like fail, please refresh",
        3000,
        dispatch
      );
    }
  };

  const getShares = async () => {
    const response = await getFetchPost(`share/${postId}`, {
      method: "GET",
    });
    const data = await response.json();
    if (data.metadata) {
      setListshare(data.metadata);
    } else {
      showToast(
        "error",
        "Error",
        "Load like fail, please refresh",
        3000,
        dispatch
      );
    }
  };

  const patchLike = async () => {
    const response = await getFetchPost(`like/${postId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "client-id": user_id,
        authorization: token.accessToken,
      },
    });
    const data = await response.json();
    if (!data.metadata) {
      showToast(
        "error",
        "Error",
        "Like post fail, please relike",
        3000,
        dispatch
      );
    }

    if (data.metadata.isLike) {
      setLike(() => like + 1);
      setIsLike(data.metadata.isLike);
    } else {
      setLike(() => like - 1);
      setIsLike(data.metadata.isLike);
    }
  };

  const sharePost = async (body) => {
    const response = await getFetchPost(`share`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "client-id": user_id,
        authorization: token.accessToken,
      },
      body: JSON.stringify({
        post_id: postId 
      }),
    });
    const data = await response.json();
    if(data.metadata){
      setShare(() => share + 1)
    } else{
      showToast(
        "error",
        "Error",
        data.message,
        3000,
        dispatch
      );
    }
  }

  const postComment = async (body) => {
    const response = await getFetchPost(`comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "client-id": user_id,
        authorization: token.accessToken,
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (data.metadata) {
      if (!data.metadata.parentComment) {
        setListcomment([
          ...listcomment,
          {
            ...data.metadata,
            author_avatar: userPicturePath,
            author_name: user_name,
            listReplyComment: [],
          },
        ]);
        setTextComment((prevTextComment) => [
          { ...prevTextComment.find((obj) => obj.id === 0), content: "" },
          ...prevTextComment.filter((obj) => obj.id !== 0),
        ]);

        setCommentPre(() => commentPre + 1);
      } else {
        var desiredObject = listcomment.find(
          (obj) => obj._id === data.metadata.parentComment
        );
        var listCommetFIlter = listcomment.filter(
          (obj) => obj._id !== data.metadata.parentComment
        );
        setListcomment([
          {
            ...desiredObject,
            listReplyComment: [
              ...desiredObject.listReplyComment,
              {
                ...data.metadata,
                author_avatar: userPicturePath,
                author_name: user_name,
              },
            ],
          },
          ...listCommetFIlter,
        ]);

        setTextComment((prevTextComment) => {
          const updatedTextComment = [
            {
              ...prevTextComment.find(
                (obj) => obj.id === data.metadata.parentComment
              ),
              content: "",
            },
            ...prevTextComment.filter(
              (obj) => obj.id !== data.metadata.parentComment
            ),
          ];
          return updatedTextComment;
        });

        setCommentPre(() => commentPre + 1);
      }
    } else {
      showToast(
        "error",
        "Error",
        "Post comment fail, please repost",
        3000,
        dispatch
      );
    }
  };

  const [onReply, setOnReply] = useState([]);

  const [textComment, setTextComment] = useState([]);

  const handleComment = (id) => {
    var desiredObject = textComment.find(function (obj) {
      return obj.id === id;
    });
    var data;
    if (id == 0) {
      data = {
        content: desiredObject.content,
        post_id: postId,
      };
    } else {
      data = {
        content: desiredObject.content,
        post_id: postId,
        parentComment: desiredObject.parentComment,
      };
    }
    postComment(data);
  };

  useEffect(() => {
    // getComments();
    // getLikes();
  }, []);

  useEffect(() => {}, [listlike]);

  useEffect(() => {
    const newListTextComment = listcomment.map((comment) => {
      const newObj = {};
      newObj.id = comment._id;
      newObj.content = "";
      newObj.parentComment = comment._id;
      return newObj;
    });

    newListTextComment.push({
      id: 0,
      content: "",
      parentComment: "",
    });

    setTextComment(newListTextComment);

    const listReplyDefault = listcomment.map((comment) => {
      const newObj = {};
      newObj[comment._id.toString()] = false;
      return newObj;
    });

    setOnReply(listReplyDefault);
  }, [listcomment]);

  return (
    <div
      className={`${
        palette.mode === "dark" ? "bg-[#1a1a1a]" : "bg-[#ffffff]"
      } px-4 py-2 shadow-xl mt-[20px] rounded-2xl`}
    >
      <Dialog
        open={openLike}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseLike}
        aria-describedby="alert-dialog-slide-description"
      >
        <IconButton
          aria-label="close"
          onClick={handleCloseLike}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <div className="pr-4 pl-4 pb-4 w-[600px]">
          <div
            className={`${
              palette.mode === "dark" ? "bg-[#383838]" : "bg-[#ffffff]"
            } flex justify-between items-center z-[1000] w-[578px] pt-4`}
          >
            {!openLike ? (
              <Box sx={{ width: "100%" }}>
                <LinearProgress />
              </Box>
            ) : (
              <div className="flex flex-col w-full">
                <h1 className="self-center text-[20px] font-[600]">Likes</h1>
                {listlike.map((like) => (
                  <div
                    key={like._id}
                    className="flex justify-between items-center my-4"
                  >
                    <div className="flex items-center">
                      <div className="mr-4">
                        <UserImage image={like.user_avatar} size="55px" />
                      </div>
                      <Box
                        onClick={() => {
                          navigate(`/profile/${like.id}`);
                          navigate(0);
                        }}
                      >
                        <Typography
                          color={palette.main}
                          variant="h5"
                          fontWeight="500"
                          sx={{
                            "&:hover": {
                              color: palette.primary.light,
                              cursor: "pointer",
                            },
                          }}
                        >
                          {like.user_name}
                        </Typography>
                      </Box>
                    </div>
                    <LikeIcon
                      width={"32px"}
                      height={"32px"}
                      color={`${
                        palette.mode === "light" ? "#858585" : "#ffffff"
                      }`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Dialog>

      <Dialog
        open={openShare}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseOpenShare}
        aria-describedby="alert-dialog-slide-description"
      >
        <IconButton
          aria-label="close"
          onClick={handleCloseOpenShare}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <div className="pr-4 pl-4 pb-4 w-[600px]">
          <div
            className={`${
              palette.mode === "dark" ? "bg-[#383838]" : "bg-[#ffffff]"
            } flex justify-between items-center z-[1000] w-[578px] pt-4`}
          >
              <div className="flex flex-col w-full">
                <h1 className="self-center text-[20px] font-[600]">Shares</h1>
                {listshare.map((share) => (
                  <div
                    key={share._id}
                    className="flex justify-between items-center my-4"
                  >
                    <div className="flex items-center">
                      <div className="mr-4">
                        <UserImage image={share.user_avatar} size="55px" />
                      </div>
                      <Box
                        onClick={() => {
                          navigate(`/profile/${share.id}`);
                          navigate(0);
                        }}
                      >
                        <Typography
                          color={palette.main}
                          variant="h5"
                          fontWeight="500"
                          sx={{
                            "&:hover": {
                              color: palette.primary.light,
                              cursor: "pointer",
                            },
                          }}
                        >
                          {share.user_name}
                        </Typography>
                      </Box>
                    </div>
                    <ShareIcon
                      width={"32px"}
                      height={"32px"}
                      color={`${
                        palette.mode === "light" ? "#858585" : "#ffffff"
                      }`}
                    />
                  </div>
                ))}
              </div>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <div className="pr-4 pl-4 pb-4 w-[600px]">
          <div
            className={`${
              palette.mode === "dark" ? "bg-[#383838]" : "bg-[#ffffff]"
            } flex justify-between items-center fixed z-[1000] w-[578px] pt-4 pb-4`}
          >
            <div className="flex items-center">
              <UserImage image={userPicturePath} size="55px" />
              <div className="flex items-start flex-col ml-2">
                <Typography
                  color={palette.primary.dark}
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
                <div className="flex items-center">
                  <p className="mr-2 text-[12px]">{createdAt}</p>
                  {isPublished ? (
                    <PublicIcon
                      color={`${
                        palette.mode === "light" ? "#858585" : "#ffffff"
                      }`}
                    />
                  ) : (
                    <PrivateIcon
                      color={`${
                        palette.mode === "light" ? "#858585" : "#ffffff"
                      }`}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="my-4 mt-[96px]">
            {share_from_user_id && (
              <div className="flex items-center">
                <ShareSharp />
                <div
                  className={`ml-6 ${
                    palette.mode === "dark" ? "text-white" : "text-[#858585]"
                  }`}
                >
                  Post shared by{" "}
                  {
                    <Typography
                      color={palette.primary.dark}
                      variant="h5"
                      fontWeight="500"
                      sx={{
                        "&:hover": {
                          color: palette.primary.light,
                          cursor: "pointer",
                        },
                      }}
                    >
                      {share_from_user_name}
                    </Typography>
                  }
                </div>
              </div>
            )}

            {description.length > 500 ? (
              <div>
                {more ? (
                  <div>
                    {description.substring(0, 500)}
                    <Button onClick={() => setMore(!more)}>...See more</Button>
                  </div>
                ) : (
                  <div>
                    {description}
                    <Button onClick={() => setMore(!more)}>Collapse</Button>
                  </div>
                )}
              </div>
            ) : (
              description
            )}
          </div>

          <h1>
            <LocationOnIcon />
            {location}
          </h1>

          {picturePath && (
            <img
              width="100%"
              height="auto"
              alt="post"
              style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
              src={`${picturePath}`}
            />
          )}

          <div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Button>
                  <LikeIcon width={"24px"} height={"24px"} color="#1976d2" />
                  <p
                    className={`text-[${
                      palette.mode === "light" ? "#858585" : "#ffffff"
                    }] pt-2 ml-1`}
                  >
                    {like}
                  </p>
                </Button>
              </div>
              <div className="flex">
                <Button onClick={handleClickOpen}>
                  <p
                    className={`text-[${
                      palette.mode === "light" ? "#858585" : "#ffffff"
                    }] mr-1`}
                  >
                    {commentPre}
                  </p>
                  <p
                    className={`text-[${
                      palette.mode === "light" ? "#858585" : "#ffffff"
                    }] mr-1`}
                  >
                    comments
                  </p>
                </Button>
                <Button>
                  <p
                    className={`text-[${
                      palette.mode === "light" ? "#858585" : "#ffffff"
                    }] mr-1`}
                  >
                    {share}
                  </p>
                  <p
                    className={`text-[${
                      palette.mode === "light" ? "#858585" : "#ffffff"
                    }]`}
                  >
                    shares
                  </p>
                </Button>
              </div>
            </div>
            <div className="w-[100%] h-[1px] bg-[#cccccc] mt-2"></div>
            <div className="flex justify-between items-center">
              <Button
                className={`flex justify-between my-3 items-center w-1/3`}
                sx={{
                  "&:hover": {
                    backgroundColor: palette.primary.main,
                    cursor: "pointer",
                  },
                }}
                onClick={patchLike}
              >
                <LikeIcon
                  width={"32px"}
                  height={"32px"}
                  color={`${
                    isLike
                      ? "#1976d2"
                      : palette.mode === "light"
                      ? "#858585"
                      : "#ffffff"
                  }`}
                />
                <p
                  className={`ml-6 mt-1 ${
                    isLike
                      ? "text-[#1976d2]"
                      : palette.mode === "dark"
                      ? "text-white"
                      : "text-[#858585]"
                  }`}
                >
                  Like
                </p>
              </Button>
              <Button
                className="flex justify-between my-3 items-center w-1/3"
                sx={{
                  "&:hover": {
                    backgroundColor: palette.primary.main,
                    cursor: "pointer",
                  },
                }}
                onClick={handleClose}
              >
                <CommentIcon
                  color={`${palette.mode === "light" ? "#858585" : "#ffffff"}`}
                />
                <p
                  className={`ml-6 mt-1 ${
                    palette.mode === "dark" ? "text-white" : "text-[#858585]"
                  }`}
                >
                  Comment
                </p>
              </Button>
              <Button
                className="flex justify-between my-3 items-center w-1/3"
                sx={{
                  "&:hover": {
                    backgroundColor: palette.primary.main,
                    cursor: "pointer",
                  },
                }}
                onClick={sharePost}
              >
                <ShareIcon
                  color={`${palette.mode === "light" ? "#858585" : "#ffffff"}`}
                />
                <p
                  className={`ml-6 mt-1 ${
                    palette.mode === "dark" ? "text-white" : "text-[#858585]"
                  }`}
                >
                  Share
                </p>
              </Button>
            </div>
            <div className="w-[100%] h-[1px] bg-[#cccccc]"></div>
          </div>

          <Box mt="0.5rem">
            {listcomment.map((comment) => (
              <Box key={`${comment._id}`} className="my-6">
                <div className="flex items-start">
                  <div>
                    <UserImage image={comment.author_avatar} size="40px" />
                  </div>
                  <div className="flex flex-col">
                    <div
                      className={`${
                        palette.mode === "dark"
                          ? "bg-[#1a1a1a]"
                          : "bg-[#ffffff]"
                      } w-full pl-2 pr-4 py-2 shadow-xl ml-3 rounded-2xl w-auto p2-4 pt-2`}
                    >
                      <div className="ml-2 flex justify-between items-center">
                        <Typography
                          color={palette.primary.dark}
                          variant="h5"
                          fontWeight="500"
                          sx={{
                            "&:hover": {
                              color: palette.primary.light,
                              cursor: "pointer",
                            },
                          }}
                        >
                          {comment.author_name}
                        </Typography>
                        <p className="text-[12px]">2m</p>
                      </div>
                      <div className="ml-2">{comment.content}</div>
                      {/* {comment.listReplyComment.length > 0 && ( */}
                      <Button
                        onClick={() => {
                          setOnReply((prev) => ({
                            ...prev,
                            [comment._id]: !prev[comment._id],
                          }));
                        }}
                      >
                        <p className="text-[10px]">view reply</p>
                      </Button>
                    </div>
                    {onReply[comment._id] && (
                      <div className="">
                        {comment.listReplyComment.map((comment) => (
                          <Box key={`${comment._id}`} className="my-6">
                            <div className="flex items-start">
                              <div>
                                <UserImage
                                  image={comment.author_avatar}
                                  size="40px"
                                />
                              </div>
                              <div
                                className={`${
                                  palette.mode === "dark"
                                    ? "bg-[#1a1a1a]"
                                    : "bg-[#ffffff]"
                                } w-full pl-2 pr-4 py-2 shadow-xl ml-3 rounded-2xl w-auto pb-4 pt-2`}
                              >
                                <div className="ml-2 flex justify-between items-center">
                                  <Typography
                                    color={palette.primary.dark}
                                    variant="h5"
                                    fontWeight="500"
                                    sx={{
                                      "&:hover": {
                                        color: palette.primary.light,
                                        cursor: "pointer",
                                      },
                                    }}
                                  >
                                    {comment.author_name}
                                  </Typography>
                                  <p className="text-[12px]">2m</p>
                                </div>
                                <div className="ml-2 mt-2">
                                  {comment.content}
                                </div>
                              </div>
                            </div>
                          </Box>
                        ))}

                        <div className="flex items-center">
                          <div>
                            <UserImage image={userPicturePath} size={40} />
                          </div>
                          <InputBase
                            placeholder={`Comment as ${user_name}...`}
                            onChange={(e) =>
                              setTextComment((prev) =>
                                prev.map((textComment) => {
                                  if (textComment.id == comment._id) {
                                    return {
                                      ...textComment,
                                      content: e.target.value,
                                      parentComment: comment._id,
                                    };
                                  }
                                  return textComment;
                                })
                              )
                            }
                            value={textComment?.content}
                            sx={{
                              width: "85%",
                              backgroundColor: palette.neutral.light,
                              borderRadius: "2rem",
                              padding: "1rem 2rem",
                            }}
                            className="mx-2"
                          />
                          <Button
                            className="flex justify-between my-3 items-center"
                            sx={{
                              "&:hover": {
                                backgroundColor: palette.primary.main,
                                cursor: "pointer",
                              },
                            }}
                            onClick={() => handleComment(comment._id)}
                          >
                            <ShareIcon
                              color={`${
                                palette.mode === "light" ? "#858585" : "#ffffff"
                              }`}
                            />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Box>
            ))}

            <div className="flex">
              <div>
                <UserImage image={userPicturePath} size={60} />
              </div>
              <InputBase
                placeholder={`Comment as ${user_name}...`}
                onChange={(e) =>
                  setTextComment((prev) =>
                    prev.map((text) => {
                      if (text.id == 0) {
                        return {
                          ...text,
                          content: e.target.value,
                          parentComment: "",
                        };
                      }
                      return text;
                    })
                  )
                }
                value={textComment?.content}
                sx={{
                  width: "85%",
                  backgroundColor: palette.neutral.light,
                  borderRadius: "2rem",
                  padding: "1rem 2rem",
                }}
                className="mx-2"
              />
              <Button
                className="flex justify-between my-3 items-center"
                sx={{
                  "&:hover": {
                    backgroundColor: palette.primary.main,
                    cursor: "pointer",
                  },
                }}
                onClick={() => handleComment(0)}
              >
                <ShareIcon
                  color={`${palette.mode === "light" ? "#858585" : "#ffffff"}`}
                />
              </Button>
            </div>
          </Box>
        </div>
      </Dialog>

      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <UserImage image={userPicturePath} size="55px" />
          <div className="flex items-start flex-col ml-2">
            <Typography
              color={palette.primary.dark}
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
            <div className="flex items-center">
              <p className="mr-2 text-[12px]">{createdAt}</p>
              {isPublished ? (
                <PublicIcon
                  color={`${palette.mode === "light" ? "#858585" : "#ffffff"}`}
                />
              ) : (
                <PrivateIcon
                  color={`${palette.mode === "light" ? "#858585" : "#ffffff"}`}
                />
              )}
            </div>
          </div>
        </div>
        <Button>
          <MoreIcon
            color={`${palette.mode === "light" ? "#000000" : "#ffffff"}`}
          />
        </Button>
      </div>

      <div className="my-4">
        {share_from_user_id && (
          <div className="flex items-center">
            <ShareSharp />
            <div
              className={`ml-6 ${
                palette.mode === "dark" ? "text-white" : "text-[#858585]"
              }`}
            >
              Post shared by{" "}
              {
                <Typography
                  color={palette.primary.dark}
                  variant="h5"
                  fontWeight="500"
                  sx={{
                    "&:hover": {
                      color: palette.primary.light,
                      cursor: "pointer",
                    },
                  }}
                >
                  {share_from_user_name}
                </Typography>
              }
            </div>
          </div>
        )}
        {description.length > 500 ? (
          <div>
            {more ? (
              <div>
                {description.substring(0, 500)}
                <Button onClick={() => setMore(!more)}>...See more</Button>
              </div>
            ) : (
              <div>
                {description}
                <Button onClick={() => setMore(!more)}>Collapse</Button>
              </div>
            )}
          </div>
        ) : (
          description
        )}

      </div>
      <h1>
        {" "}
        <LocationOnIcon />
        {location}
      </h1>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`${picturePath}`}
        />
      )}
      <div>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Button onClick={handleClickOpenLike}>
              <LikeIcon width={"24px"} height={"24px"} color="#1976d2" />
              <p
                className={`text-[${
                  palette.mode === "light" ? "#858585" : "#ffffff"
                }] pt-2 ml-1`}
              >
                {like}
              </p>
            </Button>
          </div>
          <div className="flex">
            <Button onClick={handleClickOpen}>
              <p
                className={`text-[${
                  palette.mode === "light" ? "#858585" : "#ffffff"
                }] mr-1`}
              >
                {comments}
              </p>
              <p
                className={`text-[${
                  palette.mode === "light" ? "#858585" : "#ffffff"
                }] mr-1`}
              >
                comments
              </p>
            </Button>
            <Button onClick={handleClickOpenShare}>
              <p
                className={`text-[${
                  palette.mode === "light" ? "#858585" : "#ffffff"
                }] mr-1`}
              >
                {share}
              </p>
              <p
                className={`text-[${
                  palette.mode === "light" ? "#858585" : "#ffffff"
                }]`}
              >
                shares
              </p>
            </Button>
          </div>
        </div>
        <div className="w-[100%] h-[1px] bg-[#cccccc] mt-2"></div>
        <div className="flex justify-between items-center">
          <Button
            className={`flex justify-between my-3 items-center w-1/3`}
            sx={{
              "&:hover": {
                backgroundColor: palette.primary.main,
                cursor: "pointer",
              },
            }}
            onClick={patchLike}
          >
            <LikeIcon
              width={"32px"}
              height={"32px"}
              color={`${
                isLike
                  ? "#1976d2"
                  : palette.mode === "light"
                  ? "#858585"
                  : "#ffffff"
              }`}
            />
            <p
              className={`ml-6 mt-1 ${
                isLike
                  ? "text-[#1976d2]"
                  : palette.mode === "dark"
                  ? "text-white"
                  : "text-[#858585]"
              }`}
            >
              Like
            </p>
          </Button>
          <Button
            className="flex justify-between my-3 items-center w-1/3"
            sx={{
              "&:hover": {
                backgroundColor: palette.primary.main,
                cursor: "pointer",
              },
            }}
            onClick={handleClickOpen}
          >
            <CommentIcon
              color={`${palette.mode === "light" ? "#858585" : "#ffffff"}`}
            />
            <p
              className={`ml-6 mt-1 ${
                palette.mode === "dark" ? "text-white" : "text-[#858585]"
              }`}
            >
              Comment
            </p>
          </Button>
          <Button
            className="flex justify-between my-3 items-center w-1/3"
            sx={{
              "&:hover": {
                backgroundColor: palette.primary.main,
                cursor: "pointer",
              },
            }}
            onClick={sharePost}
          >
            <ShareIcon
              color={`${palette.mode === "light" ? "#858585" : "#ffffff"}`}
            />
            <p
              className={`ml-6 mt-1 ${
                palette.mode === "dark" ? "text-white" : "text-[#858585]"
              }`}
            >
              Share
            </p>
          </Button>
        </div>
        <div className="w-[100%] h-[1px] bg-[#cccccc]"></div>
      </div>
    </div>
  );
};

export default Post;
