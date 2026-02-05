import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  Divider,
  Grid,
  Chip
} from '@mui/material';

const Profile = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        p: 4,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start'
      }}
    >
      <Card
        elevation={1}
        sx={{
          width: '100%',
          maxWidth: 900,
          borderRadius: 2,
          backgroundColor: '#f5f7fa',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={4} alignItems="center">
            {/* LEFT: PROFILE IDENTITY */}
            <Grid item xs={12} md={3}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}
              >
                <Avatar
                  sx={{
                    width: 88,
                    height: 88,
                    mb: 1.5,
                    bgcolor: '#4f83cc',
                    fontSize: 32,
                    fontWeight: 700
                  }}
                >
                  S
                </Avatar>

                <Typography variant="h6" fontWeight={600}>
                  Sumeet
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Active Investor
                </Typography>

                <Chip
                  label="Technology Focused"
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(79,131,204,0.1)',
                    color: '#2c5aa0',
                    fontWeight: 500
                  }}
                />
              </Box>
            </Grid>

            {/* VERTICAL DIVIDER */}
            <Grid item xs={12} md={1}>
              <Divider orientation="vertical" flexItem />
            </Grid>

            {/* RIGHT: PROFILE DETAILS */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                {[
                  { label: 'Full Name', value: 'Sumit Kumar' },
                  { label: 'Email', value: 'abhishek@example.com' },
                  { label: 'Username', value: 'sumit_01' },
                  { label: 'Phone', value: '+91 98765 43210' },
                  { label: 'Account Type', value: 'Individual' },
                  { label: 'Preferred Currency', value: 'USD' }
                ].map((item) => (
                  <Grid item xs={12} sm={6} key={item.label}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ letterSpacing: 0.3 }}
                    >
                      {item.label}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ mt: 0.3, fontWeight: 500 }}
                    >
                      {item.value}
                    </Typography>
                  </Grid>
                ))}

                {/* BIO */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ letterSpacing: 0.3 }}
                  >
                    Bio
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mt: 0.5, lineHeight: 1.6 }}
                  >
                    Long-term investor focused on technology and growth stocks,
                    with an emphasis on disciplined risk management and
                    portfolio balance.
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
