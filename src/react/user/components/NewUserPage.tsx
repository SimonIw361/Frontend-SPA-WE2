import { useState, type ChangeEvent, type MouseEvent } from "react";
import { Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import type { RootState } from "../../../RootStore";
import { useNavigate } from "react-router-dom";
import { Unauthorized } from "../../components/Pages";
import "../../../styles/User.css"
import { USER_URL } from "../../../config/config";

// verwendete Quellen: Folien und Videos von den Vorlesungen
// Quelle Form: https://react-bootstrap.netlify.app/docs/forms/form-control/
// Quelle Radios/Check https://react-bootstrap.netlify.app/docs/forms/checks-radios/

export function NewUserPage() {
    const navigate = useNavigate();
    const [userID, setUserID] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const { user, accessToken } = useSelector((state: RootState) => state.authentication);
    const [errorAnzeigen, setErrorAnzeigen] = useState(false);
    let errorText: string = "Es konnte kein neuer User angelegt werden.";

    const showUserListe = () => {
        navigate("/user")
    }

    const validatePassword = () => {
        if (password.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    const validateUserID = () => {
        if (userID.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        let t = e.target;
        let name = t.name;
        let value = t.value;
        switch (name) {
            case "userID":
                setUserID(value);
                break;
            case "vorname":
                setFirstName(value);
                break;
            case "nachname":
                setLastName(value);
                break;
            case "password":
                setPassword(value);
                break;
            case "isAdmin":
                setIsAdmin(t.checked);
                break;
            default:
                console.log("Error: Fehler beim Aendern von NewUser State in handleChange")
        }
    }

    const handleSubmit = async (e: MouseEvent) => {
        e.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: {
                "Authorization": "Basic " + accessToken,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "userID": userID,
                "firstName": firstName,
                "lastName": lastName,
                "password": password,
                "isAdministrator": isAdmin
            })
        }

        try {
            let response = await fetch(USER_URL, requestOptions);
            await response.json();
            if (response.ok) {
                navigate("/user");
            } else {
                setErrorAnzeigen(true);
            }
        }
        catch (err) {
            console.log("Error bei Anfrage an Backend: " + err)
        }
    }

    let anlegenButton;
    if (validatePassword() && validateUserID()) {
        anlegenButton = <Button id="CreateUserComponentCreateUserButton" variant="success" type="submit" onClick={handleSubmit}>Anlegen</Button>;
    } else {
        anlegenButton = <Button id="CreateUserComponentCreateUserButton" variant="success" type="submit" disabled>Anlegen</Button>;
    }

    if (accessToken !== null && user.isAdministrator) {
        return <div id="UserManagementPageCreateComponent">
            <div id="NewUserUeberschrift" className="ueberschrift">
                <span id="NewUserUeberschriftText">User anlegen</span>
            </div>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>User ID</Form.Label>
                    <Form.Control id="CreateUserComponentEditUserID" type="text" placeholder="User ID" name="userID" value={userID} onChange={handleChange} isValid={validateUserID()} isInvalid={!validateUserID()} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Vorname</Form.Label>
                    <Form.Control id="CreateUserComponentEditFirstName" type="text" placeholder="Vorname" name="vorname" value={firstName} onChange={handleChange} isValid={true} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Nachname</Form.Label>
                    <Form.Control id="CreateUserComponentEditLastName" type="text" placeholder="Nachname" name="nachname" value={lastName} onChange={handleChange} isValid={true} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control id="CreateUserComponentEditPassword" type="password" placeholder="Password" name="password" value={password} onChange={handleChange} isValid={validatePassword()} isInvalid={!validatePassword()} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Check id="CreateUserComponentEditIsAdministrator" type="checkbox" label="Administrator-Rechte" name="isAdmin" checked={isAdmin} onChange={handleChange} isValid={true} />
                </Form.Group>
                {errorAnzeigen && <div style={{ color: "rgb(255,0,0)" }}>{errorText}</div>}
                <div id="NewUserButtons">
                    {anlegenButton}
                    <Button id="OpenUserManagementPageListComponentButton" className="EditButton" variant="secondary" onClick={showUserListe}>Cancel</Button>
                </div>
            </Form>
        </div>;
    } else {
        return <Unauthorized />;
    }
}