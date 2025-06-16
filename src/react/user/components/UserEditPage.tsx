import { useState, type ChangeEvent, type MouseEvent } from "react";
import { Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import type { RootState } from "../../components/RootStore";
import { useNavigate } from "react-router-dom";
import { Unauthorized } from "../../components/Pages";

// verwendete Quellen: Folien und Videos von den Vorlesungen
// Quelle Form: https://react-bootstrap.netlify.app/docs/forms/form-control/
// Quelle Radios/Check https://react-bootstrap.netlify.app/docs/forms/checks-radios/
// Quelle zu fetch Anfrage https://developer.mozilla.org/de/docs/Web/API/Fetch_API/Using_Fetch

export function UserEditPage() {
    const navigate = useNavigate();
    const { user, accessToken } = useSelector((state: RootState) => state.authentication);
    const { selectedUser } = useSelector((state: RootState) => state.user);

    // verhindern das man ohne Login auf Seite zugreifen kann
    if(accessToken === null && !user.isAdministrator){
        return <Unauthorized />;
    }
    if (selectedUser === null) {
        return <div>Fehler!! selectedUser ist null</div>
    }

    const [userID] = useState(selectedUser.userID);
    const [firstName, setFirstName] = useState(selectedUser.firstName);
    const [lastName, setLastName] = useState(selectedUser.lastName);
    const [password, setPassword] = useState("");
    const [isAdmin, setIsAdmin] = useState(selectedUser.isAdministrator);


    const [errorAnzeigen, setErrorAnzeigen] = useState(false);
    let errorText: string = "Der User konnte nicht bearbeitet werden.";

    const showUserListe = () => {
        navigate("/users")
    }

    const handleChange = (e: ChangeEvent) => {
        let t = e.target as HTMLInputElement;
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

    const handleSubmit = (e: MouseEvent) => {
        e.preventDefault();
        let requestOptions
        if (password.length === 0) {
            requestOptions = {
                method: 'PUT',
                headers: {
                    "Authorization": "Basic " + accessToken,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "firstName": firstName,
                    "lastName": lastName,
                    "isAdministrator": isAdmin
                })
            }
        } else {
            requestOptions = {
                method: 'PUT',
                headers: {
                    "Authorization": "Basic " + accessToken,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "firstName": firstName,
                    "lastName": lastName,
                    "password": password,
                    "isAdministrator": isAdmin
                })
            }
        }


        const fetchUserData = async () => {
            let response = await fetch('https://localhost:443/api/users/' + selectedUser.userID, requestOptions);
            await response.json();
            console.log(response)
            if (response.ok) {
                //dispatch(setSelectedUser(null));
                navigate("/users");
            } else {
                setErrorAnzeigen(true);
            }
        };

        fetchUserData();
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