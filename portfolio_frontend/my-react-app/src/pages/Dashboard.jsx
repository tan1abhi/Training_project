import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  MenuItem,
  List,
  ListItem,
  ListItemText
} from '@mui/material';

const Dashboard = () => {
  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        p: 3,
        boxSizing: 'border-box'
      }}
    >
      <Grid
        container
        spacing={3}
        sx={{ height: '100%' , width: '100%'}}
      >
        {/* LEFT SECTION — 30% */}
        <Grid item xs={12} md={4} sx={{ height: '90%' , width: '25%'}}>
          <Paper
            elevation={1}
            sx={{
              height: '100%',
              p: 2,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Filter */}
            <TextField
              select
              fullWidth
              size="small"
              label="Filter"
              sx={{ mb: 2 }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="tech">Technology</MenuItem>
              <MenuItem value="finance">Finance</MenuItem>
            </TextField>

            {/* List */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
              <List>
                <ListItem>
                  <ListItemText primary="Item 1" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Item 2" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Item 3" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Item 4" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Item 5" />
                </ListItem>
              </List>
            </Box>
          </Paper>
        </Grid>

        {/* RIGHT SECTION — 70% */}
        <Grid item xs={12} md={8} sx={{ height: '90%' , width: '65%'}}>
          <Paper
            elevation={1}
            sx={{
              height: '100%',
              width: '100%',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography variant="h5" color="text.secondary">
              Graphs Area
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
