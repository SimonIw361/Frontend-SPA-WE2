import { Navbar, Container, Nav } from "react-bootstrap";
import { UserSessionWidget } from "./login/components/UserSessionWidget";

// verwendete Quellen: Folien und Videos von den Vorlesungen
// Quelle NavBar: https://react-bootstrap.netlify.app/docs/components/navbar/
// Quelle Navbar bootstrap: https://getbootstrap.com/docs/4.0/components/navbar/#responsive-behaviors
// Quelle https://getbootstrap.com/docs/5.3/layout/breakpoints/

export function TopMenu() {

    return <Navbar id="TopMenu" expand="md" className="bg-body-tertiary">
        <Container fluid>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Brand id="BHTLogoTopMenu"><img src="/bht.svg" /></Navbar.Brand>
            <div id="UserSessionWidget"><UserSessionWidget></UserSessionWidget></div>
            <Navbar.Collapse>
                <Nav className="me-auto">
                    <Nav.Link >Über uns</Nav.Link>
                    <Nav.Link >Kontakt</Nav.Link>
                    <Nav.Link>Impressum</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>;
}
