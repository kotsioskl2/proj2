import React from 'react';
import Link from 'next/link';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { useSession, signIn, signOut } from 'next-auth/react'; // Import authentication hooks

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function CustomNavbar({ darkMode, toggleDarkMode }: NavbarProps) {
  const { data: session, status } = useSession(); // Get session and status
  const loadingSession = status === 'loading';

  return (
    <Navbar bg={darkMode ? 'dark' : 'light'} variant={darkMode ? 'dark' : 'light'} expand="lg">
      <Navbar.Brand href="/">Car Listings</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/listings">Listings</Nav.Link>
          {session?.user?.role === 'admin' && (
            <Nav.Link href="/admin">
              <Button>Admin</Button>
            </Nav.Link>
          )}
        </Nav>
        <Nav>
          {!session && !loadingSession && (
            <Nav.Link onClick={() => signIn()}>Admin Login</Nav.Link>
          )}
          {session?.user && (
            <>
              <span className="navbar-text">
                Welcome, {session.user.name || session.user.email}
              </span>
              <Nav.Link onClick={() => signOut()}>Logout</Nav.Link>
            </>
          )}
          <Button variant="secondary" onClick={toggleDarkMode}>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
