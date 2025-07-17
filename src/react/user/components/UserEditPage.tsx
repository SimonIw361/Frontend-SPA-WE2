import {useState, type ChangeEvent, type MouseEvent } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../RootStore";
import { useNavigate } from "react-router-dom";
import { PageNotFound, Unauthorized } from "../../components/Pages";
import "../../../styles/User.css"
import { USER_URL } from "../../../config/config";
import {showUserEditAlertSuccess } from "../state/UserSlice";

// verwendete Quellen: Folien und Videos von den Vorlesungen
// Quelle Form: https://react-bootstrap.netlify.app/docs/forms/form-control/
// Quelle Radios/Check https://react-bootstrap.netlify.app/docs/forms/checks-radios/
// Quelle zu fetch Anfrage https://developer.mozilla.org/de/docs/Web/API/Fetch_API/Using_Fetch

//Typ fuer eingegebene Werte bei einem User der bearbeitet wird
type UserEdit = {
    firstName?: string,
    lastName?: string
    isAdministrator?: boolean
    password?: string
}

export function UserEditPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { user, accessToken } = useSelector((state: RootState) => state.authentication);
    const { selectedUser } = useSelector((state: RootState) => state.user);
    
    if (accessToken === null && !user.isAdministrator) { // verhindern das man ohne Login auf Seite zugreifen kann
        return <Unauthorized />;
    }
    if (selectedUser === null) { //kein User ausgewaehlt, irgendein Fehler im Code!!
        console.log("Error: UserEditPage soll aufgerufen werden, selectedUser ist aber null " + selectedUser);
        return <PageNotFound />;
    }

    const [userID] = useState(selectedUser.userID);
    const [firstName, setFirstName] = useState(selectedUser.firstName);
    const [lastName, setLastName] = useState(selectedUser.lastName);
    const [password, setPassword] = useState("");
    const [isAdmin, setIsAdmin] = useState(selectedUser.isAdministrator);
    const [errorAnzeigen, setErrorAnzeigen] = useState(false);
    let errorText: string = "Der User konnte nicht bearbeitet werden.";

    const showUserListe = () => {
        navigate("/user")
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        let t = e.target;
        let name = t.name;
        let value = t.value;
        switch (name) {
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

    const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        let body: UserEdit = {
            "firstName": firstName,
            "lastName": lastName,
            "isAdministrator": isAdmin
        };
        if (password.length > 0) { //Password wird nur mit geaendert, wenn es nicht leer ist
            body.password = password;
        }
        let requestOptions = {
            method: 'PUT',
            headers: {
                "Authorization": "Bearer " + accessToken,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }

        try {
            let response = await fetch(USER_URL + "/" + selectedUser.userID, requestOptions);
            await response.json();
            console.log(response.status)
            if (response.ok) {
                dispatch(showUserEditAlertSuccess());
                navigate("/user");
            } else {
                setErrorAnzeigen(true); //passiert nie, man kann keine ungueltigen Werte eingeben (wenn ungueltig werden alte Werte genommen)
            }
        }
        catch (err) {
            console.log("Error bei Anfrage an Backend: " + err)
        }
    }

    if (accessToken !== null && user.isAdministrator) {
        return <div id="UserManagementPageEditComponent">
            <div id="UserEditUeberschrift" className="ueberschrift">
                <span id="UserEditUeberschriftText">User bearbeiten: {selectedUser.firstName} {selectedUser.lastName}</span>
            </div>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>User ID</Form.Label>
                    <Form.Control id="EditUserComponentEditUserID" type="text" placeholder="User ID" name="userID" value={userID} onChange={handleChange} readOnly disabled />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Vorname</Form.Label>
                    <Form.Control id="EditUserComponentEditFirstName" type="text" placeholder="Vorname" name="vorname" value={firstName} onChange={handleChange} isValid={true} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Nachname</Form.Label>
                    <Form.Control id="EditUserComponentEditLastName" type="text" placeholder="Nachname" name="nachname" value={lastName} onChange={handleChange} isValid={true} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control id="EditUserComponentEditPassword" type="password" placeholder="Password" name="password" value={password} onChange={handleChange} isValid={true} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Check id="EditUserComponentEditIsAdministrator" type="checkbox" label="Administrator-Rechte" name="isAdmin" checked={isAdmin} onChange={handleChange} isValid={true} />
                </Form.Group>
                {errorAnzeigen && <div style={{ color: "rgb(255,0,0)" }}>{errorText}</div>}
                <div id="EditUserButtons">
                    <Button id="EditUserComponentSaveUserButton" variant="success" type="submit" onClick={handleSubmit}>Speichern</Button>
                    <Button id="OpenUserManagementPageListComponentButton" className="EditButton" variant="secondary" onClick={showUserListe}>Cancel</Button>
                </div>
            </Form>
        </div>;
    } else {
        return <Unauthorized />;
    }
}
