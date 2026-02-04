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
    backgroundColor: '#f3f4f6', // softer neutral
  }}
>
  <Card
    elevation={2}
    sx={{
      maxWidth: 440,
      width: '100%',
      borderRadius: 3,
    }}
  >
    <CardContent sx={{ p: 4 }}>
      {/* PROFILE HEADER */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Avatar
          sx={{
            width: 96,
            height: 96,
            mx: 'auto',
            mb: 2,
            bgcolor: 'primary.main',
            fontSize: 34,
          }}
        >
          S
        </Avatar>

        <Typography variant="h6" fontWeight={600}>
          Sumit Kumar
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          Active Investor
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* PROFILE DETAILS */}
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {[
          { label: 'Full Name', value: 'Sumit Kumar' },
          { label: 'Email', value: 'abhishek@example.com' },
          { label: 'Username', value: 'sumit_01' },
          { label: 'Phone', value: '+91 98765 43210' },
          { label: 'Account Type', value: 'Individual' },
          { label: 'Preferred Currency', value: 'USD' },
          {
            label: 'Bio',
            value:
              'Long-term investor focused on technology and growth stocks.',
          },
        ].map((item) => (
          <Box
            key={item.label}
            sx={{
              py: 1.5,
              borderBottom: '1px solid',
              borderColor: 'divider',
              '&:last-of-type': {
                borderBottom: 'none',
              },
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ letterSpacing: 0.3 }}
            >
              {item.label}
            </Typography>

            <Typography
              variant="body1"
              sx={{ mt: 0.5, lineHeight: 1.5 }}
            >
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </CardContent>
  </Card>
</Box>


  );
};

export default Profile;
