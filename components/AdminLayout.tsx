import React from 'react';
import { Container, Navbar, Nav, NavDropdown, Row, Col } from 'react-bootstrap';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    return (
        <Container fluid style={{ minHeight: '100vh' }}>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Navbar.Brand href="#home">Admin Panel</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="#dashboard">Dashboard</Nav.Link>
                        <Nav.Link href="#users">Users</Nav.Link>
                        <Nav.Link href="#settings">Settings</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <Row>
                <Col md={2} className="bg-light">
                    <Nav className="flex-column">
                        <Nav.Link href="#user-management">User Management</Nav.Link>
                        <Nav.Link href="#system-settings">System Settings</Nav.Link>
                        <Nav.Link href="#notifications">Notifications</Nav.Link>
                    </Nav>
                </Col>
                <Col md={10} style={{ padding: '24px' }}>
                    {children}
                </Col>
            </Row>
        </Container>
    );
};

export default AdminLayout;