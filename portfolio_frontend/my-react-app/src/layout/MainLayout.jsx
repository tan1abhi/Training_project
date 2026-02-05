import { Box } from '@mui/material';
import TopBar from '../components/TopBar';
import SideNav from '../components/SideNav';

const MainLayout = ({ children }) => {
  const drawerWidth = 0;
  const appBarHeight = 64;

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
      }}
    >
      
      <TopBar />

      
      <SideNav />

     
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${drawerWidth}px`,
          mt: `${appBarHeight}px`,
          height: `calc(100vh - ${appBarHeight}px)`,
          width: `calc(100vw - ${drawerWidth}px)`,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        
        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
