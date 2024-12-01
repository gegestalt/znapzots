import { AccountCircle, ExitToApp, Menu as MenuIcon, Search as SearchIcon, Settings as SettingsIcon } from "@mui/icons-material";
import { AppBar, Button, Card, CardContent, Container, Drawer, Grid, IconButton, InputAdornment, List, ListItem, ListItemText, TextField, Toolbar, Typography } from "@mui/material";
import React, { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import Flag from "react-world-flags"; // Import flag component
import { useRouter } from "next/router";

// Your theme definition
const theme = createTheme({
  palette: {
    mode: "dark", // Dark mode theme
    primary: {
      main: "#1db954", // Spotify Green or any other green shade
    },
    secondary: {
      main: "#03DAC6", // Secondary light green or teal
    },
    background: {
      default: "#121212", // Dark background
      paper: "#1c1c1c", // Dark paper background for cards
    },
    text: {
      primary: "#ffffff", // White text for dark mode
      secondary: "#b0b0b0", // Light gray text for secondary content
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif", // Choose a modern font
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", // Disable uppercased text for buttons
          borderRadius: "8px", // Round corners
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#2c3e50", // Darker AppBar background
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

const buildings = [
  {
    name: "Eiffel Tower",
    location: "Paris, France",
    countryCode: "FR", // Country code for France
    description:
      "An iconic iron lattice tower on the Champ de Mars in Paris, France.",
  },
  {
    name: "Burj Khalifa",
    location: "Dubai, UAE",
    countryCode: "AE", // Country code for UAE
    description:
      "A skyscraper in Dubai, United Arab Emirates, and currently the tallest building in the world.",
  },
  {
    name: "Atakule",
    location: "Ankara, Turkey",
    countryCode: "TR", // Country code for Australia
    description:
      "Light-filled retail mall offering boutiques, cafes, eateries & a cinema, plus an observation tower.",
  },
  {
    name: "Sydney Opera House",
    location: "Sydney, Australia",
    countryCode: "AU", // Country code for Australia
    description:
      "A multi-venue performing arts center in Sydney, New South Wales, Australia.",
  },
  {
    name: "Colosseum",
    location: "Rome, Italy",
    countryCode: "IT", // Country code for Italy
    description:
      "An ancient amphitheatre in the center of the city of Rome, Italy.",
  },
  {
    name: "Great Wall of China",
    location: "China",
    countryCode: "CN", // Country code for China
    description:
      "A series of fortifications made of various materials, generally along an east-to-west line across northern China.",
  },
];

const MenuPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCardClick = (building) => {
    router.push(`/building/${building.name}`);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSignOut = () => {
    alert("Signed out successfully!");
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
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

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Fixed Navbar */}
          <AppBar position="fixed" sx={{ top: 0, left: 0, right: 0, backgroundColor: "#2c3e50" }}>
            <Toolbar>
              <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleSidebarToggle}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" sx={{ flexGrow: 1 }} className="text-white font-semibold">
                Architectural Dashboard
              </Typography>
              <TextField
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search..."
                sx={{ marginRight: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
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

          {/* Content Section */}
          <div className="flex-1 overflow-auto pt-16 p-6">
            <Container sx={{ paddingTop: 4 }}>
              {/* Cards for displaying buildings */}
              <Grid container spacing={4}>
                {buildings.map((building, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card className="transition-all transform hover:scale-105 shadow-lg hover:shadow-xl rounded-lg overflow-hidden bg-white">
                      <CardContent>
                        <Typography variant="h6" className="font-bold text-gray-800">
                          {building.name}
                        </Typography>
                        <Typography variant="body2" className="text-gray-600 flex items-center">
                          <Flag code={building.countryCode} style={{ width: 20, height: 15, marginRight: 8 }} />
                          {building.location}
                        </Typography>
                        <Typography variant="body2" className="text-gray-500 mt-2">
                          {building.description}
                        </Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          sx={{ marginTop: 2 }}
                          onClick={() => handleCardClick(building)}
                          className="transition-colors hover:bg-blue-600"
                        >
                          Learn More
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Horizontal Line */}
              <div className="my-6 border-t border-gray-300" />

              {/* "Contact Us" Card */}
              <Grid container spacing={4} sx={{ marginTop: 4 }}>
                <Grid item xs={12} sm={6}>
                  <Card className="shadow-lg rounded-lg">
                    <CardContent>
                      <Typography variant="h6" className="font-bold text-gray-800">
                        Contact Us
                      </Typography>
                      <Typography variant="body2" className="text-gray-600 mt-2">
                        If you have any questions, feel free to reach out to us.
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ marginTop: 2 }}
                        onClick={() => router.push("/contact")}
                        className="transition-colors hover:bg-blue-600"
                      >
                        Get in Touch
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Horizontal Line */}
                <div className="my-6 border-t border-gray-300" />

                <Grid item xs={12} sm={6} className="flex justify-center">
                  <Card className="shadow-lg rounded-lg max-w-md w-full">
                    <CardContent>
                      <Typography variant="h6" className="font-bold text-gray-800">
                        Our Location
                      </Typography>
                      <div
                        style={{
                          height: "300px",
                          width: "100%",
                          borderRadius: "8px",
                          overflow: "hidden",
                        }}
                      >
                        <iframe
                          width="100%"
                          height="100%"
                          src="https://www.google.com/maps/embed/v1/view?key=YOUR_GOOGLE_MAPS_API_KEY&center=40.748817,-73.985428&zoom=16&maptype=satellite"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Container>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default MenuPage;
