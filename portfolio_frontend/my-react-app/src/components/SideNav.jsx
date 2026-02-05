import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Typography,
  Box,
  Avatar
} from '@mui/material';

import { Link } from 'react-router-dom';

const drawerWidth = '10vw';

const SideNav = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          top: '10vh',
          height: '90vh',
          borderRight: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        },
      }}
    >
      <List sx={{ px: 1 }}>
        {/* Primary Navigation */}
        {[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Risk Engine', to: '/risk-engine' },
          { label: 'Browse', to: '/browse-stocks' },
          { label: 'my space', to: '/balance' },
        ].map((item) => (
          <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={Link}
              to={item.to}
              sx={{
                borderRadius: 1,
                px: 2,
                py: 1,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                '&.Mui-selected, &.Mui-selected:hover': {
                  backgroundColor: 'action.selected',
                },
              }}
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 1 }} />

      {/* Push profile to bottom */}
      <Box sx={{ flexGrow: 1 }} />

      <Box
  sx={{
    px: 2,
    pb: 1,
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
  }}
>
  <Avatar
    sx={{
      width: 32,
      height: 32,
      bgcolor: 'primary.main',
      fontSize: 14,
      flexShrink: 0,
    }}
  >
    S
  </Avatar>

  <ListItem disablePadding sx={{ width: '100%' }}>
    <ListItemButton
      component={Link}
      to="/profile"
      sx={{
        borderRadius: 1,
        px: 2,
        py: 1,
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
    >
      <ListItemText
        primary="Profile"
        primaryTypographyProps={{
          fontSize: 14,
          fontWeight: 500,
        }}
      />
    </ListItemButton>
  </ListItem>
</Box>
{/* User Profile Section */}
    </Drawer>

  );
};

export default SideNav;