import { useState, type ChangeEvent, type MouseEvent} from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import {  useDispatch, useSelector} from "react-redux";
import type { AppDispatch, RootState } from "../RootStore";
import {login, logout, showLoginDialog, hideLoginDialog} from "./state/AuthenticationSlice";

// verwendete Quellen: Folien und Videos von den Vorlesungen
// Quelle fuer Arrow Functions(dadurch wird this automatisch gebunden): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
// Quelle zur Definition von Props Typ: https://react-redux.js.org/using-react-redux/usage-with-typescript
// https://react-redux.js.org/using-react-redux/connect-mapstate
// https://react-redux.js.org/using-react-redux/connect-mapdispatch

export const UserSessionWidget = () => {
    const [userID, setUserID] = useState("");
    const [password, setPassword] = useState("");

    //useEffect benutzen, wenn Action ausgeführt werden soll sobald sich Wert von bestimmter Variable aendert

    const dispatch = useDispatch<AppDispatch>();
    const {user, error, loginPending, showLoginDialogBool} = useSelector(
        (state: RootState) => state.authentication
    )

    const handleShow = (e: MouseEvent) => {
        e.preventDefault();
        dispatch(showLoginDialog());
    }
    
    const handleClose = () => {
        dispatch(hideLoginDialog());
    }
    
    const handleChange = (e: ChangeEvent) => {
        e.preventDefault(); //notwendig??, kann ggf weggelassen werden
        let t = e.target as HTMLInputElement;
        let name = t.name;
        let value = t.value;
        switch(name){
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
    
    const handleSubmit = async (e: MouseEvent) => {
        e.preventDefault();
    
        //Warnung ignorieren, await muss da stehen, geht sonst nicht richtig
        await dispatch(login({userID: userID, password: password}));
        if(user === null){
            setUserID("");
            setPassword("");
        }
    }
    
    const handleLogout = () => {
        dispatch(logout());
    }
    
    const canLogin = () =>{
        if(password === "" || userID === ""){
            return false;
        }
        else {
            return true;
        }
    }

    
        let showDialog: boolean = showLoginDialogBool; //bestimmt, ob LoginDialog angezeigt wird
        if (showDialog === undefined) {
            showDialog = false;
        }

        let showError: boolean = false;
        if(error === "Authentication failed"){ //dann Fehler bei Login, falsche User ID/Password
            showError = true;
        }
        else {
            showError = false;
        }

        let pending: boolean = loginPending; //Ladesymbol wird dargestellt
        if(loginPending === undefined){
            pending = false;
        }
        
        let userIdForm;
        let paswordForm;
        if(pending){ //wenn pending kann in forms nicht mehr eingetragen werden
            userIdForm = <Form.Control id="LoginDialogUserIDText" type="text" placeholder="User ID" name="userID" onChange={handleChange} value={userID} readOnly/>
            paswordForm= <Form.Control id="LoginDialogPasswordText" type="password" placeholder="Password" name="password" onChange={handleChange} value={password} readOnly/>
        }
        else {
            userIdForm = <Form.Control id="LoginDialogUserIDText" type="text" placeholder="User ID" name="userID" onChange={handleChange} value={userID}/>
            paswordForm= <Form.Control id="LoginDialogPasswordText" type="password" placeholder="Password" name="password" onChange={handleChange} value={password}/>
        }

        let widget;
        if(user === null || user === undefined){ //wenn User eingeloggt ist soll anderes Widget dargestellt (kein Login Button)
            widget = <Button id="OpenLoginDialogButton" variant="primary" onClick={handleShow}>Login</Button>
        }
        else {
            widget = <Button id="LogoutButton" variant="primary" onClick={handleLogout}>Logout</Button>//TODO das noch aendern, sollte eigentlich icon sein
        }

        let performLoginButton;
        if(canLogin()){ //Login Button kann nur gedrueckt werden, wenn Felder nicht leer sind
            performLoginButton = <Button id="PerformLoginButton" variant="primary" type="submit" onClick={handleSubmit}>Login</Button>;
        }
        else{
            performLoginButton = <Button id="PerformLoginButton" variant="primary" type="submit" disabled>Login</Button>;
        }

        return <div>
            {widget}
            <Modal show={showDialog} id="LoginDialog" onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">{userIdForm}</Form.Group>
                        <Form.Group className="mb-3">{paswordForm}</Form.Group>
                        {showError && <div><Form.Label id="textLoginUngueltig" style={{color: "red"}}>User ID oder Password falsch</Form.Label><br /></div>}
                        {pending && <div><Spinner animation="border" variant="primary"/><br /></div>}
                        {performLoginButton}
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    
}
