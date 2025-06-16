import { useSelector } from "react-redux";
import type { RootState } from "../../components/RootStore";
import { useEffect, useState } from "react";
import { Button, ListGroup } from "react-bootstrap";
import { Unauthorized } from "../../components/Pages";
import { useNavigate } from "react-router-dom";
import { UserComponent } from "./UserComponent";

// verwendete Quellen: Folien und Videos von den Vorlesungen
// Quelle useState typisieren: https://stackoverflow.com/questions/53650468/set-types-on-usestate-react-hook-with-typescript
// Quelle useEffect: https://www.w3schools.com/react/react_useeffect.asp
// Quelle zu useNavigate: https://medium.com/@bobjunior542/using-usenavigate-in-react-router-6-a-complete-guide-46f51403f430
// Quelle asynchroner Aufruf in useEffect: https://stackoverflow.com/questions/53332321/react-hook-warnings-for-async-function-in-useeffect-useeffect-function-must-ret

export type User = {
    userID: string,
    firstName?: string,
    lastName?: string
    isAdministrator: boolean
}

export function UserPage() {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]); //lokaler State vom Typ User[]
    const { user, accessToken } = useSelector((state: RootState) => state.authentication);
    const { reloadUserListe } = useSelector((state: RootState) => state.user);

    const requestOptions = {
        method: 'GET',
        headers: { "Authorization": "Basic " + accessToken }
    }

    useEffect(() => {
        const fetchUserData = async () => {
            let response = await fetch('https://localhost:443/api/users', requestOptions);
            const data: User[] = await response.json();
            setUsers(data);
        };

        fetchUserData();
    }, [reloadUserListe]) //muss aufgerufen werden, wenn zur User Liste zurueck gegangen wird

    if (accessToken !== null && user.isAdministrator) {
        try {
            return <div id="UserManagementPage">
                <div id="UserUeberschrift" className="ueberschrift">
                    <span id="UserUeberschriftText">User-Liste</span>
                    <Button id="UserManagementPageCreateButton" variant="primary" onClick={() => navigate("/users/newUser")}>User anlegen</Button>
                </div>
                <ListGroup id="UserListe" horizontal>
                    {users.map(user => (
                        <UserComponent user={user} key={"UserItem" + user.userID} />
                    ))}
                </ListGroup>
            </div>
        }
        catch (err) {
            //tritt auf wenn Token ungueltig ist, bei map wird dann Fehler geworfen
            return <Unauthorized />;
        }
    } else {
        return <Unauthorized />;
    }
}