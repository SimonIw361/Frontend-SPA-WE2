import { useSelector } from "react-redux";
import type { RootState } from "./RootStore";
import { Unauthorized } from "./Pages";
import { Button, Form, Modal } from "react-bootstrap";
import type { User } from "../user/components/UserPage";
import { useEffect, useState, type ChangeEvent, type MouseEvent } from "react";

//Achtung: geht nur mit meinem Server!!
//wird nicht benutzt dezeit, nur fuer Zusatz
export function ProfilPage() {
    const { user, accessToken } = useSelector((state: RootState) => state.authentication);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [showProfilBearbeiten, setShowProfilBearbeiten] = useState(false);
    const [showPasswordAendern, setShowPasswordAendern] = useState(false);
    const [firstName, setFirstName] = useState(currentUser?.firstName);
    const [lastName, setLastName] = useState(currentUser?.lastName);
    

    const [errorAnzeigen, setErrorAnzeigen] = useState(false);
    let errorText: string = "Der User konnte nicht bearbeitet werden.";

    const requestOptions = {
        method: 'GET',
        headers: {
            "Authorization": "Basic " + accessToken
        }
    }

    useEffect(() => {
        const fetchUserData = async () => {
            let response = await fetch('https://localhost:443/api/users/' + user.userID, requestOptions);
            const data = await response.json();
            setCurrentUser(data);
        };

        fetchUserData();
        
    }, [firstName, lastName]);


    const handleShowProfilBearbeiten = () => {
        setShowProfilBearbeiten(true)
        setFirstName(currentUser?.firstName);
        setLastName(currentUser?.lastName);
    }
    

    const handleChange = (e: ChangeEvent) => {
        let t = e.target as HTMLInputElement;
        let name = t.name;
        let value = t.value;
        switch (name) {
            case "firstName":
                setFirstName(value);
                break;
            case "lastName":
                setLastName(value);
                break;
            default:
                console.log("Error: Fehler beim Aendern von Login State in handleChange")
        }
    }

    const handleSubmit = (e: MouseEvent) => {
        e.preventDefault();
        const requestOptions = {
            method: 'PUT',
            headers: {
                "Authorization": "Basic " + accessToken,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "firstName": firstName,
                "lastName": lastName
            })
        }

        const fetchUserData = async () => {
            let response = await fetch('https://localhost:443/api/users/' + currentUser?.userID, requestOptions);
            await response.json();
            console.log(response)
            if (response.ok) {
                setShowProfilBearbeiten(false);
            } else {
                setErrorAnzeigen(true);
            }
        };

        fetchUserData();
        setFirstName(currentUser?.firstName);
        setLastName(currentUser?.lastName);
    }

    if (accessToken !== null && currentUser !== null) {
        return <div id="UserProfilPageComponent">
            <div className="ueberschrift">Profil</div>
            <div className="text">Hier kannst du die Daten aus deinem Profil ansehen.</div>
            <Form id="UserProfilForm">
                <Form.Group className="mb-3">
                    <Form.Label>User ID</Form.Label>
                    <Form.Control id="UserProfilComponentUserID" type="text" placeholder="User ID" name="userID" value={currentUser.userID} readOnly disabled />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Vorname</Form.Label>
                    <Form.Control id="UserProfilComponentFirstName" type="text" placeholder="Vorname" name="vorname" value={currentUser.firstName} readOnly disabled />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Nachname</Form.Label>
                    <Form.Control id="UserProfilComponentLastName" type="text" placeholder="Nachname" name="nachname" value={currentUser.lastName} readOnly disabled />
                </Form.Group>
                <div id="ProfilUserButtons">
                    <Button id="EditUserComponentSaveUserButton" variant="success" onClick={handleShowProfilBearbeiten }>Profil bearbeiten</Button>
                    <Button id="OpenUserManagementPageListComponentButton" className="EditButton" variant="warning" onClick={() => setShowPasswordAendern(true)}>Passwort ändern</Button>
                </div>
            </Form>
            <Modal show={showProfilBearbeiten} id="LoginDialog" onHide={() => setShowProfilBearbeiten(false)} >
                <Modal.Header closeButton>
                    <Modal.Title>Profil bearbeiten</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>User ID</Form.Label>
                            <Form.Control id="ProfilDialogUserID" type="text" name="userID" value={currentUser.userID} readOnly disabled />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Vorname</Form.Label>
                            <Form.Control id="ProfilDialogFirstName" type="text" placeholder="Vorname" name="firstName" onChange={handleChange} value={firstName} isValid={true} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Nachname</Form.Label>
                            <Form.Control id="ProfilDialogLastName" type="text" placeholder="Nachname" name="lastName" onChange={handleChange} value={lastName} isValid={true} />
                        </Form.Group>
                        {errorAnzeigen && <div><Form.Label id="textEditUngueltig" style={{ color: "red" }}>{errorText}</Form.Label><br /></div>}
                        <div id="ProfilEditButtons">
                            <Button id="ProfilSaveButton" variant="success" type="submit" onClick={handleSubmit}>Speichern</Button>
                            <Button id="ProfilCancelButton" variant="secondary" onClick={() => setShowProfilBearbeiten(false)}>Cancel</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            {/* //TODO: modalenDialog fuer Password aendern einfuegen */}
        </div>
    }
    else {
        return <Unauthorized />
    }
}