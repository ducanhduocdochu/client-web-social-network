import { Box } from "@mui/material";

const UserImage = ({ image, size }) => {
  return (
    <Box width={size} height={size} style={{ overflow: "hidden", borderRadius: "50%" }}>
      <img
        className={`w-full h-full`}
        style={{ objectFit: "cover" }}
        alt="user"
        src={`${image}`}
      />
    </Box>
  );
};

export default UserImage;
