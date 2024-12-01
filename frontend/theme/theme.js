import { Box, Button, CircularProgress, Container, TextField, ThemeProvider, Typography, createTheme } from '@mui/material';

import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';

// Your theme definition
const theme = createTheme({
  palette: {
    mode: 'dark', // Dark mode theme
    primary: {
      main: '#1db954', // Spotify Green or any other green shade
    },
    secondary: {
      main: '#03DAC6', // Secondary light green or teal
    },
    background: {
      default: '#121212', // Dark background
      paper: '#1c1c1c', // Dark paper background for cards
    },
    text: {
      primary: '#ffffff', // White text for dark mode
      secondary: '#b0b0b0', // Light gray text for secondary content
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif', // Choose a modern font
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Disable uppercased text for buttons
          borderRadius: '8px', // Round corners
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#2c3e50', // Darker AppBar background
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px', // Round card corners
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)', // Soft shadow effect
        },
      },
    },
  },
});

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      // Use FormData to send the data as form-urlencoded
      const formData = new URLSearchParams();
      formData.append('username', email); // Use 'username' instead of 'email'
      formData.append('password', password);

      const response = await axios.post('http://localhost:8001/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // Sending form data
        },
      });

      // Log the response to check the returned data
      console.log('Response:', response.data);

      // Ensure the response contains the access_token
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        router.push('/menu'); // Redirect to the menu page after successful login
      } else {
        setError('Invalid credentials or server error. Please try again.');
      }
    } catch (err) {
      // Detailed error logging
      console.error('Login Error:', err.response ? err.response.data : err.message);
      setError('Invalid credentials or server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}> {/* Wrap the component with ThemeProvider */}
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: 'background.paper',
            boxShadow: 3,
            borderRadius: 2,
            p: 4,
            mt: 8,
          }}
        >
          <Typography variant="h5" component="h1" sx={{ mb: 3, fontWeight: 'bold' }}>
            Login
          </Typography>

          <form onSubmit={handleLogin} style={{ width: '100%' }}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <Typography color="error" variant="body2" sx={{ mt: 1 }}>{error}</Typography>}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
          </form>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link href="/register" passHref>
                <Button variant="text" sx={{ color: '#1976d2' }}>
                  Register
                </Button>
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default LoginPage;