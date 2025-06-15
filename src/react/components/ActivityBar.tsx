import { Nav } from "react-bootstrap";
import { useSelector } from "react-redux";
import type { RootState } from "./RootStore";
import { Link } from "react-router-dom";

// verwendete Quellen: Folien und Videos von den Vorlesungen
// Quelle Navbar: https://react-bootstrap.netlify.app/docs/components/navs/

export function ActivityBar() {
    const user = useSelector(
        (state: RootState) => state.authentication.user
    )

    let userBearbeiten;
    if(user.isAdministrator){
        userBearbeiten = <Nav.Link as={Link} to="/users" id="OpenUserManagementPageButton">User</Nav.Link>
    }
    else {
        userBearbeiten = <div></div>
    }

    if (user.userID !== null) {
        return <Nav className="flex-column" id="activityBar">
            <Nav.Link as={Link} to="/" id="OpenStartPageButton">Home</Nav.Link>
            {userBearbeiten}
            <Nav.Link>Studiengänge</Nav.Link>
            <Nav.Link>Bewerbungen</Nav.Link>
        </Nav>;
    }
    else {
        return <div></div>;
    }
}