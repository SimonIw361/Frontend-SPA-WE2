import { useSelector } from "react-redux";
import type { RootState } from "../../components/RootStore";
import { useEffect, useState } from "react";
import {ListGroup } from "react-bootstrap";
import { Unauthorized } from "../../components/Pages";
import { UserComponent } from "./UserComponent";

// verwendete Quellen: Folien und Videos von den Vorlesungen
// Quelle useState typisieren: https://stackoverflow.com/questions/53650468/set-types-on-usestate-react-hook-with-typescript
// Quelle useEffect: https://www.w3schools.com/react/react_useeffect.asp
// Quelle asynchroner Aufruf in useEffect: https://stackoverflow.com/questions/53332321/react-hook-warnings-for-async-function-in-useeffect-useeffect-function-must-ret

export type User = {
    userID: string,
    firstName?: string,
    lastName?: string
    isAdministrator: boolean
}

export function UserPage() {
    const [users, setUsers] = useState<User[]>([]); //lokaler State vom Typ User[]
    const { accessToken } = useSelector((state: RootState) => state.authentication);

    const requestOptions = {
        method: 'GET',
        headers: { "Authorization": "Basic " + accessToken }
    }

    useEffect(() => {
        const fetchUserData = async () => {
            let response = await fetch('https://localhost:443/api/users', requestOptions);
            const data: User[] = await response.json();
            console.log(response);
            console.log(data);
            setUsers(data);
        };

        fetchUserData();
    }, []) //muss aufgerufen werden, wenn zur User Liste zurueck gegangen wird

    try {
        return <div id="UserManagementPage">
            <div id="UserUeberschrift" className="ueberschrift">User-Liste</div>
            <ListGroup id="UserListe" horizontal>
                {users.map(user => (
                    <UserComponent user={user}/> //evtl noch mehr fuer onClick uebergeben bei edit und delete
                ))}
            </ListGroup>
        </div>
    }
    catch (err) {
        //tritt auf wenn Token ungueltig ist, bei map wird dann Fehler geworfen
        return <Unauthorized />;
    }
}