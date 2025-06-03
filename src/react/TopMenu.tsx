import { Component } from "react";
import { Navbar, Container} from "react-bootstrap";
import UserSessionWidget from "./login/UserSessionWidget";

export class TopMenu extends Component {

    render() {
        return <div>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand><img src="/bht.svg"/></Navbar.Brand>
                    {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> //kann eigentlich weg, ist nur so Menu Items
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="#home">Home</Nav.Link>
                            <Nav.Link href="#link">Link</Nav.Link>
                        </Nav>
                    </Navbar.Collapse> */}
                    <UserSessionWidget></UserSessionWidget>
                </Container>
            </Navbar>
        </div>;
    }
}
