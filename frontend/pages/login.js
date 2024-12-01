import { Box, Button, CircularProgress, Container, TextField, ThemeProvider, Typography, createTheme } from '@mui/material';

import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';

// Your theme definition
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1db954', // Spotify Green or any other green shade
    },
    secondary: {
      main: '#03DAC6',
    },
    background: {
      default: '#121212',
      paper: '#1c1c1c',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#2c3e50',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
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
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await axios.post('http://localhost:8001/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      console.log('Response:', response.data);

      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        router.push('/menu');
      } else {
        setError('Invalid credentials or server error. Please try again.');
      }
    } catch (err) {
      console.error('Login Error:', err.response ? err.response.data : err.message);
      setError('Invalid credentials or server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
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
          {/* Login text inside an outlined box with green color */}
          <Box
            sx={{
              border: '2px solid #1db954', // Green border
              borderRadius: 2, // Rounded corners
              padding: '8px 16px', // Padding inside the box
              mb: 3,
            }}
          >
            <Typography
              variant="h5"
              component="h1"
              sx={{
                color: '#1db954', // Green text color
                fontWeight: 'bold',
              }}
            >
              Login
            </Typography>
          </Box>

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
