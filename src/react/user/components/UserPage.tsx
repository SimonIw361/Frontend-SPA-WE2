import { useSelector } from "react-redux";
import type { RootState } from "../../components/RootStore";
import { useEffect, useState } from "react";
import { Button, Card, ListGroup } from "react-bootstrap";
import { Unauthorized } from "../../components/Pages";

// verwendete Quellen: Folien und Videos von den Vorlesungen
//Quelle zu List Group: https://react-bootstrap.netlify.app/docs/components/list-group/
// Quelle zu Cards: https://react-bootstrap.netlify.app/docs/components/cards/

type User = {
    userID: string,
    firstName?: string,
    lastName?: string
    isAdministrator: boolean,
    Error?: string
}

export function UserPage() {
    const [users, setUsers] = useState<User[]>([]);
    const { accessToken } = useSelector((state: RootState) => state.authentication);
    const requestOptions = {
        method: 'GET',
        headers: { "Authorization": "Basic " + accessToken }
    }

    useEffect(() => {
        const fetchData = async () => {
            let response = await fetch('https://localhost:443/api/users', requestOptions);
            const data = await response.json();
            setUsers(data);
        };

        fetchData();
    }, [])
    console.log(users);
    try {

        return <div id="UserManagementPage">
            <div id="UserUeberschrift" className="ueberschrift">User-Liste</div>
            <ListGroup id="UserListe" horizontal>
                {users.map(user => (
                    <Card id={"UserItem" + user.userID} key={"UserItem" + user.userID}>
                        <Card.Header><b>{user.firstName} {user.lastName}</b></Card.Header>
                        <ListGroup >
                            <ListGroup.Item>UserID:  {user.userID}</ListGroup.Item>
                            <ListGroup.Item>FirstName: {user.firstName}</ListGroup.Item>
                            <ListGroup.Item>LastName: {user.lastName}</ListGroup.Item>
                        </ListGroup>
                        <Card.Footer><Button id={"UserItemEditButton" + user.userID} className="EditButton" variant="warning">Edit</Button><Button id={"UserItemDeleteButton" + user.userID} className="DeleteButton" variant="danger">Delete</Button></Card.Footer>
                    </Card>
                ))}
            </ListGroup>
        </div>
    }
    catch (err) {
        //tritt auf wenn Token ungueltig ist, bei map wird dann Fehler geworfen
        return <Unauthorized />;
    }

    // return <div id="UserManagementPage">
    //     <div className="ueberschrift">User-Liste</div>

    //         <ListGroup id="UserListe" horizontal>
    //         {users.map(user => (
    //             <ListGroup.Item id={"UserItem" + user.userID} key={"UserItem" + user.userID}>UserID:  {user.userID} <br />FirstName: {user.firstName} <br />LastName: {user.lastName}</ListGroup.Item>
    //         ))}
    //         </ListGroup>

    // </div>
}