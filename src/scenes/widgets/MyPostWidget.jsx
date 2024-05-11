import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import { showToast } from "utils/showToast";

const MyPostWidget = ({ picturePath }) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [urlImage, setUrlImage] = useState(null);
  const [isLocation, setIsLocation] = useState(false);
  const [location, setLocation] = useState("");
  const [postPr, setPostPr] = useState("");
  const { palette } = useTheme();
  const { id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;

  const handlePost = async () => {
    const response = await fetch(`http://localhost:3002/v1/api/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "client-id": id,
        authorization: token.accessToken,
      },
      body: JSON.stringify({
        content: postPr,
        location,
        video_images: [urlImage.image_url],
        isPublished: true,
      }),
    });
    const data = await response.json();
    if (data.status === 201) {
      dispatch(setPost(data.metadata));
      setImage(null);
      setPostPr("");
      setLocation("");
      setIsImage(false)
      setIsLocation(false)
      showToast("success", "Success", "Post Successful", 3000, dispatch);
    } else {
      showToast("error", "Post fail", "Post again", 3000, dispatch);
    }
  };

  const handleSubmitImage = async (acceptedFile) => {
    const formData = new FormData();
    setImage(acceptedFile);
    formData.append("file", acceptedFile);
    formData.append("type", "post");
    const response = await fetch(`http://localhost:3002/v1/api/upload/thumb`, {
      method: "POST",
      headers: { "client-id": id, authorization: token.accessToken },
      body: formData,
    });
    const data = await response.json();
    setUrlImage(data.metadata);
    if (data.status === "error") {
      setImage(null);
      showToast("error", "Upload fail", "Upload image again", 3000, dispatch);
    }
  };

  const handleDeleteImage = async () => {
    const response = await fetch(
      `http://localhost:3002/v1/api/upload/thumb?public_id=${urlImage.public_id}`,
      {
        method: "DELETE",
        headers: { "client-id": id, authorization: token.accessToken },
      }
    );
    if (response.status == 200) {
      setImage(null);
    } else {
      showToast("error", "Upload fail", "Delete image again", 3000, dispatch);
    }
  };

  return (
    <WidgetWrapper>
      <FlexBetween gap="1rem">
        <UserImage image={picturePath} size={60} />
        <InputBase
          placeholder="What's on your mind..."
          onChange={(e) => setPostPr(e.target.value)}
          value={postPr}
          sx={{
            width: "85%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
          }}
        />
      </FlexBetween>
      {isImage && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            acceptedFiles=".jpg,.jpeg,.png"
            multiple={false}
            onDrop={(acceptedFiles) => handleSubmitImage(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!image ? (
                    <p>Add Image Here</p>
                  ) : (
                    <FlexBetween>
                      <Typography>{image.name}</Typography>
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>
                {image && (
                  <IconButton onClick={handleDeleteImage} sx={{ width: "15%" }}>
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}

      {isLocation && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          <InputBase
            placeholder="Location..."
            onChange={(e) => setLocation(e.target.value)}
            value={location}
            sx={{
              width: "100%",
              // backgroundColor: palette.neutral.light,
              borderRadius: "2rem",
              padding: "1rem 2rem",
            }}
            className="h-[10px]"
          />
        </Box>
      )}

      <Divider sx={{ margin: "1.25rem 0" }} />

      <FlexBetween>
        <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Image
          </Typography>
        </FlexBetween>

        {isNonMobileScreens ? (
          <>
            <FlexBetween gap="0.25rem">
              <GifBoxOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Clip</Typography>
            </FlexBetween>

            <FlexBetween
              gap="0.25rem"
              onClick={() => setIsLocation(!isLocation)}
            >
              <AttachFileOutlined sx={{ color: mediumMain }} />
              <Typography
                color={mediumMain}
                sx={{ "&:hover": { cursor: "pointer", color: medium } }}
              >
                Location
              </Typography>
            </FlexBetween>

            <FlexBetween gap="0.25rem">
              <MicOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Audio</Typography>
            </FlexBetween>
          </>
        ) : (
          <FlexBetween gap="0.25rem">
            <MoreHorizOutlined sx={{ color: mediumMain }} />
          </FlexBetween>
        )}

        <Button
          disabled={!postPr}
          onClick={handlePost}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
            "&:hover": { cursor: "pointer", color: medium },
          }}
        >
          POST
        </Button>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MyPostWidget;
