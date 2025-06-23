import { Navbar, Container, Nav } from "react-bootstrap";
import { UserSessionWidget } from "../login/components/UserSessionWidget";
import { Link } from "react-router-dom";

// verwendete Quellen: Folien und Videos von den Vorlesungen
// Quelle NavBar: https://react-bootstrap.netlify.app/docs/components/navbar/
// Quelle Navbar bootstrap: https://getbootstrap.com/docs/4.0/components/navbar/#responsive-behaviors
// Quelle https://getbootstrap.com/docs/5.3/layout/breakpoints/
// Quelle fuers Link setzen: https://www.geeksforgeeks.org/reactjs/how-to-add-navigation-links-to-the-react-bootstrap-navbar/
// Quelle Container fluid https://getbootstrap.com/docs/5.0/layout/containers/

export function TopMenu() {

    return <Navbar id="TopMenu" expand="md" className="bg-body-tertiary">
        <Container fluid>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Brand id="OpenStartPageButtonBild" as={Link} to="/" ><img src="/bht.svg" /></Navbar.Brand>
            <div id="UserSessionWidget"><UserSessionWidget></UserSessionWidget></div>
            <Navbar.Collapse>
                <Nav className="me-auto">
                    <Nav.Link id="OpenUeberUnsButton" as={Link} to="/ueberuns">Über uns</Nav.Link>
                    <Nav.Link id="OpenKontaktButton" as={Link} to="/kontakt">Kontakt</Nav.Link>
                    <Nav.Link id="OpenImpressumButton" as={Link} to="/impressum">Impressum</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>;
}
