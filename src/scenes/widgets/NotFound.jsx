import React from 'react';
import { Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFoundPage = ({text, toPath}) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <Typography variant="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1" gutterBottom>
        Sorry, the page you are looking for does not exist or has been moved.
      </Typography>
      <Button
        component={Link}
        to={toPath}
        variant="contained"
        color="primary"
        className="mt-8"
      >
        {text}
      </Button>
    </div>
  );
};

export default NotFoundPage;
