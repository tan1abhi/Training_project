import React from 'react';
import { Box, Card, CardContent, Avatar, Typography } from '@mui/material';

const Profile = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        p: 3,
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <Avatar
            sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
          >
            U
          </Avatar>
          <Typography variant="h5" component="div" gutterBottom>
            John Doe
          </Typography>
          <Typography variant="body2" color="text.secondary">
            john.doe@example.com
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;