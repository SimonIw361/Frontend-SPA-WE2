import { Component } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { UserSessionWidget } from "./login/UserSessionWidget";

// verwendete Quellen: Folien und Videos von den Vorlesungen
// Quelle NavBar: https://react-bootstrap.netlify.app/docs/components/navbar/

export class TopMenu extends Component {

    render() {
        return <div>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container fluid>
                    <Navbar.Brand ><img src="/bht.svg" /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse>
                        <Nav className="me-auto">
                            <Nav.Link href="#ueber-uns">Über uns</Nav.Link>
                            <Nav.Link href="#kontakt">Kontakt</Nav.Link>
                            <Nav.Link href="#impressum">Impressum</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                    <UserSessionWidget></UserSessionWidget>
                </Container>
            </Navbar>
        </div>;
    }
}
