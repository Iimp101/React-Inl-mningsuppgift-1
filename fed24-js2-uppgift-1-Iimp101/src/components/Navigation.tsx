import React from 'react'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';

const Navigation = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="md" sticky="top">
      <Container>
        <Navbar.Brand as={NavLink} to="/">🌌 Star Wars DB</Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/films">Films</Nav.Link>
            <Nav.Link as={NavLink} to="/people">People</Nav.Link>
            <Nav.Link as={NavLink} to="/planets">Planets</Nav.Link>
            <Nav.Link as={NavLink} to="/species">Species</Nav.Link>
            <Nav.Link as={NavLink} to="/starships">Starships</Nav.Link>
            <Nav.Link as={NavLink} to="/vehicles">Vehicles</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navigation
