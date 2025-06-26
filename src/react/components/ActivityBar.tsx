import { Nav } from "react-bootstrap";
import { useSelector } from "react-redux";
import type { RootState } from "../../RootStore";
import { Link } from "react-router-dom";

// verwendete Quellen: Folien und Videos von den Vorlesungen
// Quelle Navbar: https://react-bootstrap.netlify.app/docs/components/navs/

/* Quellen fuer die benutzen Icons:
    https://www.flaticon.com/free-icon/home_25694?term=home&page=1&position=1&origin=search&related_id=25694
    https://www.flaticon.com/free-icon/user_456212?term=user&page=1&position=1&origin=search&related_id=456212
    https://www.flaticon.com/free-icon/form_4797927?term=application&page=1&position=10&origin=search&related_id=4797927
    https://www.flaticon.com/free-icon/mortarboard_5305730?term=degree&page=1&position=4&origin=search&related_id=5305730
*/

export function ActivityBar() {
    const user = useSelector((state: RootState) => state.authentication.user);

    let userBearbeiten;
    if (user.isAdministrator) {
        userBearbeiten = <Nav.Link as={Link} to="/user" id="OpenUserManagementPageButton"><img className="ActivityBarItemBild" src="/user.png" alt="User"/></Nav.Link>;
    }
    else {
        userBearbeiten = <div></div>;
    }

    if (user.userID !== null) {
        return <div><Nav className="flex-column" id="activityBar">
            <Nav.Link as={Link} to="/" id="OpenStartPageButton"><img className="ActivityBarItemBild" src="/home.png" alt="Home"/></Nav.Link>
            {userBearbeiten}
            <Nav.Link as={Link} to="/degreeCourse" id="OpenDegreeCourseManagementPageButton"><img className="ActivityBarItemBild" src="/studiengang.png" alt="Studiengänge"/></Nav.Link>
            <Nav.Link as={Link} to="/degreeCourseApplication" id="OpenDegreeCourseApplicationManagementPageButton"><img className="ActivityBarItemBild" src="/bewerbung.png" alt="Bewerbungen"/></Nav.Link>
        </Nav>
            <div id="hintergrundActivityBarFarbe"></div>
        </div>;
    }
    else {
        return <div></div>;
    }
}