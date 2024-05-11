import { Button, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";

const AdvertWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
          Sponsored
        </Typography>
        <Typography color={medium}>Create Ad</Typography>
      </FlexBetween>

      <div className="flex items-center">
        <img
          width="40%"
          height="auto"
          alt="advert"
          src="https://res.cloudinary.com/dvubvnnt9/image/upload/v1714891039/39ducanh263post/thumb.jpg"
          style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
        />
        <Typography color={medium} m="0.5rem 0" className='pl-4'>
          Your pathway to stunning and immaculate beauty and made sure your skin
          is exfoliating skin and shining like light.
        </Typography>
      </div>
      <div className="flex items-center">
        <Typography color={main} className="pr-[46px]">MikaCosmetics</Typography>
        <Button><p color={medium}>mikacosmetics.com</p></Button>
      </div>

      <div className="flex items-center">
        <img
          width="40%"
          height="auto"
          alt="advert"
          src="https://res.cloudinary.com/dvubvnnt9/image/upload/v1714891039/39ducanh263post/thumb.jpg"
          style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
        />
        <Typography color={medium} m="0.5rem 0" className='pl-4'>
          Your pathway to stunning and immaculate beauty and made sure your skin
          is exfoliating skin and shining like light.
        </Typography>
      </div>
      <div className="flex items-center">
        <Typography color={main} className="pr-[46px]">MikaCosmetics</Typography>
        <Button><p color={medium}>mikacosmetics.com</p></Button>
      </div>
    </WidgetWrapper>
  );
};

export default AdvertWidget;
