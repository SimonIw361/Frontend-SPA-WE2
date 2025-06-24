import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../RootStore";
import { useEffect, useState } from "react";
import { Alert, Button, ListGroup } from "react-bootstrap";
import { Unauthorized } from "../../components/Pages";
import { useNavigate } from "react-router-dom";
import { UserComponent } from "./UserComponent";
import "../../../styles/User.css"
import { USER_URL } from "../../../config/config";
import { hideUserEditAlertSuccess } from "../state/UserSlice";

// verwendete Quellen: Folien und Videos von den Vorlesungen
// Quelle useState typisieren: https://stackoverflow.com/questions/53650468/set-types-on-usestate-react-hook-with-typescript
// Quelle useEffect: https://www.w3schools.com/react/react_useeffect.asp
// Quelle zu useNavigate: https://medium.com/@bobjunior542/using-usenavigate-in-react-router-6-a-complete-guide-46f51403f430
// Quelle asynchroner Aufruf in useEffect: https://stackoverflow.com/questions/53332321/react-hook-warnings-for-async-function-in-useeffect-useeffect-function-must-ret
// Quelle async in useEffect: https://devtrium.com/posts/async-functions-useeffect

export type User = {
    userID: string,
    firstName?: string,
    lastName?: string
    isAdministrator: boolean
}

export function UserPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [users, setUsers] = useState<User[]>([]); //lokaler State vom Typ User[]
    const { user, accessToken } = useSelector((state: RootState) => state.authentication);
    const {showUserEditAlertSuccessBool} = useSelector((state: RootState) => state.user);

    const requestOptions = {
        method: 'GET',
        headers: { "Authorization": "Basic " + accessToken }
    }

    useEffect(() => { //wird einmal am Anfang beim Laden der Seite aufgerufen
        getAllUser();
    },[])

    const getAllUser = async () => {
        try {
            let response = await fetch(USER_URL, requestOptions);
            if (response.ok) {
                const data: User[] = await response.json();
                setUsers(data);
            } else {
                console.log("Error " + response.status + " " + response.statusText + ": Fehler beim Abfragen aller User auf UserPage");
            }
        }
        catch (err) {
            console.log("Error bei Anfrage an Backend: " + err)
        }
    }

    const handleNewUser = () => {
        dispatch(hideUserEditAlertSuccess());
        navigate("/users/newUser");
    }
    
    if (accessToken !== null && user.isAdministrator) {
        try {
            //Success Alert ist hier eingebunden, Einblenden/Ausblenden davon wird durch Redux Store gesteuert
            //show wird in UserEditPage aufgerufen, hide wird bei Verlassen der UserPage aufgerufen
            return <div id="UserManagementPage">
                <Alert show={showUserEditAlertSuccessBool} id="AlertEditSuccess" variant="success" onClose={() => dispatch(hideUserEditAlertSuccess())} dismissible>
                    User wurde erfolgreich bearbeitet
                </Alert>
                <div id="UserUeberschrift" className="ueberschrift">
                    <span id="UserUeberschriftText">User-Liste</span>
                    <Button id="UserManagementPageCreateUserButton" variant="primary" onClick={handleNewUser}>User anlegen</Button>
                </div>
                <ListGroup id="UserManagementPageListComponent" horizontal>
                    {users.map(user => (
                        <UserComponent user={user} key={"UserItem" + user.userID} userAktualisieren={getAllUser} /> //getAllUser wird uebergeben, damit diese zum Aktualisieren der UserListe aufgerufen werden kann
                    ))}
                </ListGroup>
            </div>
        }
        catch (err) {
            return <Unauthorized />; //tritt auf wenn Token ungueltig ist, bei map wird dann Fehler geworfen
        }
    } else {
        return <Unauthorized />;
    }
}