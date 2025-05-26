import { Component } from "react";
import { Navbar, Container, Nav} from "react-bootstrap";
import UserSessionWidget from "./UserSessionWidget";

export class TopMenu extends Component {

    render() {
        return <div>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="#home"><img src="/bht.svg"/></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="#home">Home</Nav.Link>
                            <Nav.Link href="#link">Link</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                    <UserSessionWidget showLoginDialog={true} showLoginDialogAction={() => {}} hideLoginDialogAction={() => {}}></UserSessionWidget>
                </Container>
            </Navbar>
        </div>;
    }
}

//wieso muss das alles uebergeben werden bei UserSessionWidget??