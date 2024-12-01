import {
  AppBar,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  InputBase,
  Toolbar,
  Typography,
} from '@mui/material';
import { Menu, Search } from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import Flag from 'react-world-flags';
import React from 'react';
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
          borderRadius: "8px", // Round card corners
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)", // Soft shadow effect
        },
      },
    },
  },
});

const ArchitecturalDashboard = () => {
  const router = useRouter();

  const buildings = [
    {
      name: 'Empire State Building',
      countryCode: 'US',
      location: 'New York, USA',
      description: 'A famous skyscraper in New York City.',
    },
    {
      name: 'Eiffel Tower',
      countryCode: 'FR',
      location: 'Paris, France',
      description: 'A wrought-iron lattice tower in Paris.',
    },
    {
      name: 'Burj Khalifa',
      countryCode: 'AE',
      location: 'Dubai, UAE',
      description: 'The tallest building in the world.',
    },
    {
      name: 'Atakule',
      countryCode: 'TR',
      location: 'Ankara, Turkey',
      description: 'Light-filled retail mall offering boutiques, cafes, eateries & a cinema, plus an observation tower.',
    },
    {
      name: 'Malware Downloader',
      description: 'Feel free to download the latest version of our malware from here.',
    },
    
  ];
  const handleDownload = (building) => {
    console.log(`Downloading data for: ${building.name}`);
    // Replace with actual download logic
    const downloadUrl = `/api/download/${building.name}`; // Adjust endpoint as needed
    window.open(downloadUrl, '_blank'); // Open download link in a new tab
  };
  
  const handleCardClick = (building) => {
    console.log(`Learn more about: ${building.name}`);
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ marginRight: 2 }}
            >
              <Menu />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Architectural Dashboard
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
          </Toolbar>
        </AppBar>

        {/* Content Section */}
        <div className="content" style={{ paddingTop: 64 }}>
          <Container>
            {/* Cards for displaying buildings */}
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
          {/* Buttons */}
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

            
            <Grid container spacing={4} sx={{ marginTop: 4 }}>
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Contact Us</Typography>
                    <Typography variant="body2">
                      If you have any questions, feel free to reach out to us.
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ marginTop: 2 }}
                      onClick={() => router.push('/contact')}
                    >
                      Get in Touch
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Our Location</Typography>
                    <iframe
                      width="100%"
                      height="300"
                      src="https://www.google.com/maps/embed/v1/view?key=YOUR_GOOGLE_MAPS_API_KEY&center=40.748817,-73.985428&zoom=16&maptype=satellite"
                      allowFullScreen
                    ></iframe>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default ArchitecturalDashboard;
