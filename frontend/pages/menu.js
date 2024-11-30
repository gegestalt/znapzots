import { AppBar, Button, Container, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import { ExitToApp, Home, Person } from '@mui/icons-material'; // MUI Icons
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { styled } from '@mui/system';

// Create a theme
const theme = createTheme({
  spacing: 8, // Set spacing function (in multiples of 8)
});

// Styled components for layout
const Root = styled('div')(({ theme }) => ({
  display: 'flex',
}));

const DrawerStyled = styled(Drawer)(({ theme }) => ({
  width: 240,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: 240,
  },
}));

const Content = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
}));

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Root>
          <AppBar position="fixed">
            <Toolbar>
              <Typography variant="h6">Dashboard</Typography>
              <Button color="inherit" onClick={handleSignOut} style={{ marginLeft: 'auto' }}>
                <ExitToApp /> Sign Out
              </Button>
            </Toolbar>
          </AppBar>

          <DrawerStyled variant="permanent">
            <List>
              <ListItem button component="a" href="/dashboard">
                <ListItemIcon><Home /></ListItemIcon>
                <ListItemText primary="Home" />
              </ListItem>
              <ListItem button component="a" href="/settings">
                <ListItemIcon><Person /></ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItem>
              <ListItem button component="a" href="/analytics">
                <ListItemIcon><Person /></ListItemIcon>
                <ListItemText primary="Analytics" />
              </ListItem>
              <ListItem button component="a" href="/reports">
                <ListItemIcon><Person /></ListItemIcon>
                <ListItemText primary="Reports" />
              </ListItem>
            </List>
          </DrawerStyled>

          <Content>
            <Routes>
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </Content>
        </Root>
      </Router>
    </ThemeProvider>
  );
};

const Login = ({ setUser }) => {
  const handleLogin = () => {
    // Mock login
    const mockUser = { username: 'user@example.com', token: 'some_token' };
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Login Page
      </Typography>
      <Button variant="contained" color="primary" onClick={handleLogin}>
        Login
      </Button>
    </Container>
  );
};

const Dashboard = ({ user }) => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Welcome {user ? user.username : 'Guest'}
      </Typography>
      <Typography paragraph>
        Here's your dashboard content!
      </Typography>
      <Divider />
      <div>
        <Typography variant="h6" gutterBottom>Stats</Typography>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="card" style={{ width: '30%', padding: '10px', border: '1px solid #ddd' }}>Stat 1</div>
          <div className="card" style={{ width: '30%', padding: '10px', border: '1px solid #ddd' }}>Stat 2</div>
          <div className="card" style={{ width: '30%', padding: '10px', border: '1px solid #ddd' }}>Stat 3</div>
        </div>
      </div>
    </Container>
  );
};

export default App;
