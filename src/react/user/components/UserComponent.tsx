import { Button, Card, ListGroup } from "react-bootstrap";
import type { User } from "./UserPage";

// verwendete Quellen: Folien und Videos von den Vorlesungen
// Quelle zu List Group: https://react-bootstrap.netlify.app/docs/components/list-group/
// Quelle zu Cards: https://react-bootstrap.netlify.app/docs/components/cards/
// Quelle Props in Funktion: https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components

type UserComponentProps = {
    user: User
}

export function UserComponent({ user }: UserComponentProps) {

    //evtl auch noch card.Body hinzufuegen, ist dann noch bisschen abgetrennter
    return <Card id={"UserItem" + user.userID} key={"UserItem" + user.userID} style={{ minWidth: "200px" }}>
        <Card.Header><b>{user.firstName} {user.lastName}</b></Card.Header>
        <ListGroup>
            <ListGroup.Item className="listUserID" ><span>UserID:</span> <span>{user.userID}</span></ListGroup.Item>
            <ListGroup.Item className="listUserFirstName"><span>FirstName:</span> <span>{user.firstName}</span></ListGroup.Item>
            <ListGroup.Item className="listUserLastName"><span>LastName:</span> <span>{user.lastName}</span></ListGroup.Item>
        </ListGroup>
        <Card.Footer className="listFooterButtons"><Button id={"UserItemEditButton" + user.userID} className="EditButton" variant="warning">Edit</Button><Button id={"UserItemDeleteButton" + user.userID} className="DeleteButton" variant="danger">Delete</Button></Card.Footer>
    </Card>
}