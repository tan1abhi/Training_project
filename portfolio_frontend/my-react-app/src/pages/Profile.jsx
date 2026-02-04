import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  Grid,
  Divider
} from '@mui/material';

const Profile = () => {
  return (
    <Box
  sx={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    p: 3,
    backgroundColor: '#f5f7fa'
  }}
>
  <Card sx={{ maxWidth: 420, width: '100%' }} elevation={3}>
    <CardContent>
      {/* PROFILE HEADER */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Avatar
          sx={{
            width: 90,
            height: 90,
            mx: 'auto',
            mb: 2,
            bgcolor: 'primary.main',
            fontSize: 32
          }}
        >
          S
        </Avatar>

        <Typography variant="h6">
          Sumit Kumar
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Active Investor
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* PROFILE DETAILS – VERTICAL */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Full Name
          </Typography>
          <Typography variant="body1">
            Sumit Kumar
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary">
            Email
          </Typography>
          <Typography variant="body1">
            abhishek@example.com
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary">
            Username
          </Typography>
          <Typography variant="body1">
            sumit_01
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary">
            Phone
          </Typography>
          <Typography variant="body1">
            +91 98765 43210
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary">
            Account Type
          </Typography>
          <Typography variant="body1">
            Individual
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary">
            Preferred Currency
          </Typography>
          <Typography variant="body1">
            USD
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary">
            Bio
          </Typography>
          <Typography variant="body1">
            Long-term investor focused on technology and growth stocks.
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
</Box>

  );
};

export default Profile;
