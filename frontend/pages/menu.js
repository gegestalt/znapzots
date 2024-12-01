import { AccountCircle, ExitToApp, MailOutline, Menu, Search, Settings as SettingsIcon } from '@mui/icons-material';
import {
  AppBar,
  Button,
  Card,
  CardContent,
  Container,
  Drawer,
  Grid,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import React, { useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import Flag from 'react-world-flags';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/router';

const theme = createTheme({
  palette: {
    mode: "dark", 
    primary: {
      main: "#FF8C00", 
    },
    secondary: {
      main: "#90ee90", 
    },
    background: {
      default: "#121212",
      paper: "#1c1c1c", 
    },
    text: {
      primary: "#ffffff", 
      secondary: "#b0b0b0", 
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif", 
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", 
          borderRadius: "8px", 
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#2c3e50", 
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "8px", 
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)", 
        },
      },
    },
  },
});

const ArchitecturalDashboard = () => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for JWT token in localStorage
    const token = localStorage.getItem('access_token');

    // Verify if token exists and is valid
    if (token) {
      try {
        const decoded = jwt.decode(token);
        if (decoded && decoded.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);  // Valid token, user is authenticated
        } else {
          setIsAuthenticated(false);  // Invalid token or expired
          localStorage.removeItem('access_token');  // Clear invalid token
        }
      } catch (error) {
        setIsAuthenticated(false);
        localStorage.removeItem('access_token');  // Clear invalid token
      }
    } else {
      setIsAuthenticated(false);  // No token, not authenticated
    }
  }, []);

  useEffect(() => {
    // If not authenticated, redirect to the login page
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSignOut = () => {
    localStorage.removeItem('access_token'); // Remove token on sign-out
    alert("Signed out successfully!");
    router.push('/login'); // Redirect to login
  };

  const buildings = [
    {
      name: 'Empire State Building',
      countryCode: 'US',
      location: 'New York, USA',
      description: 'Відомий хмарочос у Нью-Йорку.',
    },
    {
      name: 'Eiffel Tower',
      countryCode: 'FR',
      location: 'Paris, France',
      description: 'Кована ґратчаста вежа в Парижі.',
    },
    {
      name: 'Burj Khalifa',
      countryCode: 'AE',
      location: 'Dubai, UAE',
      description: 'Найвища будівля в світі.',
    },
    {
      name: 'Atakule',
      countryCode: 'TR',
      location: 'Ankara, Turkey',
      description: 'Світлий торговий центр із оглядовою вежею.',
    },
    {
      name: 'Atakule',
      countryCode: 'TR',
      location: 'Ankara, Turkey',
      description: 'Світлий торговий центр із оглядовою вежею.',
    },
    {
      name: 'Atakule',
      countryCode: 'TR',
      location: 'Ankara, Turkey',
      description: 'Світлий торговий центр із оглядовою вежею.',
    },
  ];

  const handleDownload = (building) => {
    console.log(`Downloading data for: ${building.name}`);
    // Replace with actual download logic
    const downloadUrl = `/api/download/${building.name}`;
    window.open(downloadUrl, '_blank');
  };

  const handleCardClick = (building) => {
    console.log(`Learn more about: ${building.name}`);
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        {/* Only render the dashboard content if authenticated */}
        {isAuthenticated ? (
          <>
            <AppBar position="fixed">
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ marginRight: 2 }}
                  onClick={handleSidebarToggle}
                >
                  <Menu />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Вулиця Схід
                </Typography>
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 10px',
                  }}
                >
                  <Search sx={{ color: 'white', marginRight: 1 }} />
                  <InputBase
                    placeholder="Search..."
                    sx={{ color: 'inherit', width: '100%' }}
                  />
                </div>
                <IconButton color="inherit" onClick={() => router.push("/profile")}>
                  <AccountCircle />
                </IconButton>
                <IconButton color="inherit" onClick={() => router.push("/settings")}>
                  <SettingsIcon />
                </IconButton>
                <IconButton color="inherit" onClick={handleSignOut}>
                  <ExitToApp />
                </IconButton>
              </Toolbar>
            </AppBar>
            <Drawer open={sidebarOpen} onClose={handleSidebarToggle}>
              <List>
                <ListItem button onClick={() => router.push("/dashboard")}>
                  <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem button onClick={() => router.push("/profile")}>
                  <ListItemText primary="Profile" />
                </ListItem>
                <ListItem button onClick={() => router.push("/settings")}>
                  <ListItemText primary="Settings" />
                </ListItem>
                <ListItem button onClick={handleSignOut}>
                  <ListItemText primary="Sign Out" />
                </ListItem>
              </List>
            </Drawer>

            {/* Content Section */}
            <div className="content" style={{ paddingTop: 64 }}>
              <Container>
                <Grid container spacing={4}>
                  {buildings.map((building, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6">{building.name}</Typography>
                          <Typography variant="body2">
                            <Flag
                              code={building.countryCode}
                              style={{ width: 20, height: 15, marginRight: 8 }}
                            />
                            {building.location}
                          </Typography>
                          <Typography variant="body2">{building.description}</Typography>
                          <div style={{ marginTop: 16, display: 'flex', gap: 16 }}>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleCardClick(building)}
                            >
                              Learn More
                            </Button>
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={() => handleDownload(building)}
                            >
                              Download Now
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                <div style={{ marginBottom: 32 }} />

                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Contact Us</Typography>
                      <Typography variant="body2">
                        Відвідайте наш офіс або зв’яжіться з нами для отримання додаткової інформації.
                      </Typography>
                      <div style={{ marginTop: 16, height: 300, width: '100%' }}>
                        <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
                          <GoogleMap
                            mapContainerStyle={{ height: '100%', width: '100%' }}
                            center={contactLocation}
                            zoom={12}
                          >
                            <Marker position={contactLocation} />
                          </GoogleMap>
                        </LoadScript>
                      </div>
                      <div style={{ display: 'flex', marginTop: 16 }}>
                        <MailOutline sx={{ marginRight: 1 }} />
                        <Typography variant="body2">info@example.com</Typography>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              </Container>
            </div>
          </>
        ) : null}
      </div>
    </ThemeProvider>
  );
};

export default ArchitecturalDashboard;
