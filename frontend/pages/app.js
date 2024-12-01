import { Button, Col, Container, Nav, NavDropdown, Navbar, Row } from 'react-bootstrap';
import { FaHome, FaSignOutAlt, FaUser } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';

import Link from 'next/link';
import { ThemeProvider } from '@mui/material/styles';
import theme from '/theme/theme'; // Import the custom theme file

const Menu = () => {
  const [user, setUser] = useState(null);

  // Fetch user data (or from local storage if you store token there)
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user')); // Assuming JWT token info is stored here
    if (userData) {
      setUser(userData);
    }
  }, []);

  // Handle sign-out functionality
  const handleSignOut = () => {
    localStorage.removeItem('user');  // Remove user info from localStorage
    setUser(null);                    // Reset user state
  };

  return (
    <ThemeProvider theme={theme}> {/* Apply the custom theme */}
      <Container>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Navbar.Brand href="/dashboard">Dashboard</Navbar.Brand>
          <Nav className="ml-auto">
            <NavDropdown title={<FaUser />} id="navbar-nav-dropdown">
              <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleSignOut}>
                <FaSignOutAlt /> Sign Out
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar>

        <Row className="mt-4">
          <Col md={3} className="sidebar">
            <nav className="sidebar-nav">
              <ul>
                <li>
                  <Link href="/dashboard">
                    <a><FaHome /> Home</a>
                  </Link>
                </li>
                <li>
                  <Link href="/settings">
                    <a>Settings</a>
                  </Link>
                </li>
                <li>
                  <Link href="/analytics">
                    <a>Analytics</a>
                  </Link>
                </li>
                <li>
                  <Link href="/reports">
                    <a>Reports</a>
                  </Link>
                </li>
              </ul>
            </nav>
          </Col>
          
          <Col md={9}>
            <div className="dashboard-content">
              <h1>Welcome {user ? user.username : "Guest"}</h1>
              <p>Here's your dashboard content!</p>
              <div className="stats">
                <Row>
                  <Col md={4}><div className="card">Stat 1</div></Col>
                  <Col md={4}><div className="card">Stat 2</div></Col>
                  <Col md={4}><div className="card">Stat 3</div></Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </ThemeProvider> 
  );
};

export default Menu;
