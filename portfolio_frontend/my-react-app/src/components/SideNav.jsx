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
import { Link, useLocation } from 'react-router-dom';

const drawerWidth = 220;

const navItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Risk Engine', to: '/risk-engine' },
  { label: 'Browse', to: '/browse-stocks' },
  { label: 'My Space', to: '/balance' }, 
  { label: 'Profile', to: '/profile' }
];

const SideNav = () => {
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          top: '72px',
          height: 'calc(100vh - 72px)',
          borderRight: '1px solid',
          borderColor: 'divider',

          
          backgroundColor: '#f3f7fd'
        }
      }}
    >
     
      <Box sx={{ px: 2, pt: 2 }}>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            letterSpacing: 0.6,
            fontWeight: 600,
            textTransform: 'uppercase'
          }}
        >
          Navigation
        </Typography>
      </Box>

      <List sx={{ px: 1.5, mt: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;

          return (
            <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                to={item.to}
                sx={{
                  borderRadius: 2,
                  px: 2,
                  py: 1,

                 
                  backgroundColor: isActive
                    ? 'rgba(79,131,204,0.15)'
                    : 'transparent',

                  borderLeft: isActive
                    ? '3px solid #4f83cc'
                    : '3px solid transparent',

                  '&:hover': {
                    backgroundColor: 'rgba(79,131,204,0.12)'
                  }
                }}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#2c5aa0' : 'text.primary'
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ my: 2 }} />

      
      <Box sx={{ flexGrow: 1 }} />

     
      <Box
        sx={{
          px: 2,
          pb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5
        }}
      >
        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: '#4f83cc',
            fontSize: 14,
            fontWeight: 600
          }}
        >
          S
        </Avatar>

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body2" fontWeight={600}>
            Summet
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Active Investor
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default SideNav;
