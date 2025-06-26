import { Button, Card, ListGroup, Modal } from "react-bootstrap";
import type { User } from "./UserPage";
import type { AppDispatch, RootState } from "../../../RootStore";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { hideUserEditAlertSuccess, setSelectedUser } from "../state/UserSlice";
import { useNavigate } from "react-router-dom";
import { USER_URL } from "../../../config/config";

// verwendete Quellen: Folien und Videos von den Vorlesungen
// Quelle zu List Group: https://react-bootstrap.netlify.app/docs/components/list-group/
// Quelle zu Cards: https://react-bootstrap.netlify.app/docs/components/cards/
// Quelle Props in Funktion: https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components

type UserComponentProps = {
    user: User,
    userAktualisieren: () => void
}

export function UserComponent({ user, userAktualisieren }: UserComponentProps) {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { accessToken } = useSelector((state: RootState) => state.authentication);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleOpenDeleteDialog = () => {
        dispatch(hideUserEditAlertSuccess());
        deleteButton = <Button id="DeleteDialogConfirmButton" className="DeleteButton" variant="danger" onClick={handleDelete}>Delete</Button>
        setShowDeleteDialog(true);
    }

    const handleCloseDeleteDialog = () => {
        setShowDeleteDialog(false);
    }

    const handleDelete = async () => {
        deleteButton = <Button id="DeleteDialogConfirmButton" className="DeleteButton" variant="danger" disabled>Delete</Button>
        const requestOptions = {
            method: 'DELETE',
            headers: {
                "Authorization": "Basic " + accessToken
            }
        }

        try {
            let response = await fetch(USER_URL + "/" + user.userID, requestOptions);
            if (!response.ok) {
                console.log("Error " + response.status + " " + response.statusText + ": Fehler beim Loeschen eines Users");
            }
        }
        catch (err) {
            console.log("Error bei Anfrage an Backend: " + err)
        }

        userAktualisieren();
        handleCloseDeleteDialog();
    }

    const handleEditUser = () => {
        dispatch(hideUserEditAlertSuccess());
        dispatch(setSelectedUser(user));
        navigate("/users/editUser");
    }

    let deleteButton = <Button id="DeleteDialogConfirmButton" className="DeleteButton" variant="danger" onClick={handleDelete}>Delete</Button>

    return <div><Card id={"UserItem" + user.userID} style={{ minWidth: "200px" }}>
        <Card.Header><b>{user.firstName} {user.lastName}</b></Card.Header>
        <ListGroup>
            <ListGroup.Item id="UserID" className="listUserID" ><span>UserID:</span> <span>{user.userID}</span></ListGroup.Item>
            <ListGroup.Item id="FirstName" className="listUserFirstName"><span>FirstName:</span> <span>{user.firstName}</span></ListGroup.Item>
            <ListGroup.Item id="LastName" className="listUserLastName"><span>LastName:</span> <span>{user.lastName}</span></ListGroup.Item>
        </ListGroup>
        <Card.Footer className="listFooterButtons">
            <Button id={"UserItemEditButton" + user.userID} className="EditButton" variant="warning" onClick={handleEditUser}>Edit</Button>
            <Button id={"UserItemDeleteButton" + user.userID} className="DeleteButton" variant="danger" onClick={handleOpenDeleteDialog}>Delete</Button>
        </Card.Footer>
    </Card>
        <Modal show={showDeleteDialog} id={"DeleteDialogUser" + user.userID} onHide={handleCloseDeleteDialog} >
            <Modal.Header closeButton>
                <Modal.Title>User {user.userID} löschen?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>Soll User {user.firstName} {user.lastName} gelöscht werden?</div>
            </Modal.Body>
            <Modal.Footer>
                <Button id="DeleteDialogCancelButton" className="EditButton" variant="secondary" onClick={handleCloseDeleteDialog}>Cancel</Button>
                {deleteButton}
            </Modal.Footer>
        </Modal>
    </div>
}