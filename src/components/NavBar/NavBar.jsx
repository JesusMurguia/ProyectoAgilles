import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const NavBar = () => {
  const { user, logout } = useAuth();

  return (
    <Navbar variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Pomodoro
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="justify-content-end" style={{ width: "100%" }}>
            {user && (
              <>
                <Nav.Link onClick={logout}>Logout</Nav.Link>
              </>
            )}
            {!user && (
              <Nav.Link as={Link} to="/LogIn">
                Log In
              </Nav.Link>
            )}
            {!user && (
              <Nav.Link as={Link} to="/SignUp">
                Sign Up
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
