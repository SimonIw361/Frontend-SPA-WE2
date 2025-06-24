import { useState, type ChangeEvent, type MouseEvent } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../RootStore";
import { login, logout, showLoginDialog, hideLoginDialog } from "../state/AuthenticationSlice";
import { useNavigate } from "react-router-dom";

// verwendete Quellen: Folien und Videos von den Vorlesungen
// Button https://react-bootstrap.netlify.app/docs/components/buttons/
// Modal Dialog https://react-bootstrap.netlify.app/docs/components/modal/
// Quelle fuer Arrow Functions: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
// Quelle zu Typescript in React: https://react-redux.js.org/using-react-redux/usage-with-typescript
// Quelle zu Hooks: https://react-redux.js.org/api/hooks
// Quelle zu useState: https://react.dev/reference/react/useState
// Quelle zu useNavigate: https://medium.com/@bobjunior542/using-usenavigate-in-react-router-6-a-complete-guide-46f51403f430
// Typen fuer Events TypeScript https://nishanthan-k.medium.com/typescript-event-types-and-event-handling-in-react-a-complete-guide-for-beginners-22293ff4b8a0

/* Quellen fuer die benutzen Icons:
    https://www.flaticon.com/de/kostenlose-icons/avatar-benutzer
    https://www.flaticon.com/de/kostenlose-icons/mannlicher-avatar
*/

export function UserSessionWidget() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>(); //mit dispatch werden Actions ueber Reducer/Slice an den Store geschickt
    const { user, error, loginPending, showLoginDialogBool } = useSelector((state: RootState) => state.authentication);
    const [userID, setUserID] = useState("");
    const [password, setPassword] = useState("");

    const handleShow = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        dispatch(showLoginDialog());
    }

    const handleClose = () => {
        dispatch(hideLoginDialog());
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        let t = e.target;
        let name = t.name;
        let value = t.value;
        switch (name) {
            case "userID":
                setUserID(value);
                break;
            case "password":
                setPassword(value);
                break;
            default:
                console.log("Error: Fehler beim Aendern von Login State in handleChange")
        }
    }

    const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        await dispatch(login({ userID: userID, password: password }));
        navigate("/");
        setUserID("");
        setPassword("");
    }

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    }

    const canLogin = () => {
        if (password.trim() === "" || userID.trim() === "") {
            return false;
        }
        else {
            return true;
        }
    }

    let showError: boolean = false;
    if (error !== null) { //dann Fehler bei Login, falsche User ID/Password
        showError = true;
    }
    else {
        showError = false;
    }

    let userIdForm;
    let paswordForm;
    if (loginPending) { //wenn pending kann in forms nicht mehr eingetragen werden
        userIdForm = <Form.Control id="LoginDialogUserIDText" type="text" placeholder="User ID" name="userID" onChange={handleChange} value={userID} readOnly />
        paswordForm = <Form.Control id="LoginDialogPasswordText" type="password" placeholder="Password" name="password" onChange={handleChange} value={password} readOnly />
    }
    else {
        userIdForm = <Form.Control id="LoginDialogUserIDText" type="text" placeholder="User ID" name="userID" onChange={handleChange} value={userID} />
        paswordForm = <Form.Control id="LoginDialogPasswordText" type="password" placeholder="Password" name="password" onChange={handleChange} value={password} />
    }

    let widget;
    if (user.userID === null) { //wenn User eingeloggt ist soll anderes Widget dargestellt (kein Login Button)
        widget = <Button id="OpenLoginDialogButton" onClick={handleShow}><img src="/UserBildPublic.png" alt="Bild User ausgeloggt" /></Button>
    }
    else {
        widget = <Button id="LogoutButton" variant="primary" onClick={handleLogout}><img src="/UserBildPrivate.png" alt="Bild User eingeloggt" /></Button>
    }

    let performLoginButton;
    if (canLogin()) { //Login Button kann nur gedrueckt werden, wenn Felder nicht leer sind
        performLoginButton = <Button id="PerformLoginButton" variant="primary" type="submit" onClick={handleSubmit}>Login</Button>;
    }
    else {
        performLoginButton = <Button id="PerformLoginButton" variant="primary" type="submit" disabled>Login</Button>;
    }

    return <div>
        {widget}
        <Modal show={showLoginDialogBool} id="LoginDialog" onHide={handleClose} >
            <Modal.Header closeButton>
                <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">{userIdForm}</Form.Group>
                    <Form.Group className="mb-3">{paswordForm}</Form.Group>
                    {showError && <div><Form.Label id="textLoginUngueltig" style={{ color: "red" }}>User ID oder Password falsch</Form.Label><br /></div>}
                    {loginPending && <div><Spinner animation="border" variant="primary" /><br /></div>}
                    {performLoginButton}
                </Form>
            </Modal.Body>
        </Modal>
    </div>

}
