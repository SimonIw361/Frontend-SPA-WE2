import { Button, Card, ListGroup, Modal } from "react-bootstrap";
import type { User } from "./UserPage";
import type { AppDispatch, RootState } from "../../components/RootStore";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { reloadUserListe, setSelectedUser } from "../state/UserSlice";
import { useNavigate } from "react-router-dom";

// verwendete Quellen: Folien und Videos von den Vorlesungen
// Quelle zu List Group: https://react-bootstrap.netlify.app/docs/components/list-group/
// Quelle zu Cards: https://react-bootstrap.netlify.app/docs/components/cards/
// Quelle Props in Funktion: https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components

type UserComponentProps = {
    user: User
}

export function UserComponent({ user }: UserComponentProps) {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { accessToken } = useSelector((state: RootState) => state.authentication);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);


    const handleOpenDeleteDialog = () => {
        deleteButton = <Button id="DeleteDialogConfirmButton" className="DeleteButton" variant="danger" onClick={handleDelete}>Delete</Button>
        setShowDeleteDialog(true);
    }

    const handleCloseDeleteDialog = () => {
        setShowDeleteDialog(false);
    }

    const handleDelete = () => {
        deleteButton = <Button id="DeleteDialogConfirmButton" className="DeleteButton" variant="danger" disabled>Delete</Button>
        const requestOptions = {
            method: 'DELETE',
            headers: {
                "Authorization": "Basic " + accessToken
            }
        }

        const fetchUserData = async () => {
            let response = await fetch('https://localhost:443/api/users/' + user.userID, requestOptions);
            if (response.ok) {
                console.log("Loeschen erfolgreicgh")
            } else {
                console.log("Loeschen nicht erfolgreicgh")
            }
        };

        fetchUserData();
        dispatch(reloadUserListe());
        handleCloseDeleteDialog();
    }

    const handleEditUser = () => {
        dispatch(setSelectedUser(user));
        navigate("/users/editUser");
    }

    let deleteButton = <Button id="DeleteDialogConfirmButton" className="DeleteButton" variant="danger" onClick={handleDelete}>Delete</Button>

    return <div><Card id={"UserItem" + user.userID} style={{ minWidth: "200px" }}>
        <Card.Header><b>{user.firstName} {user.lastName}</b></Card.Header>
        <ListGroup>
            <ListGroup.Item className="listUserID" ><span>UserID:</span> <span>{user.userID}</span></ListGroup.Item>
            <ListGroup.Item className="listUserFirstName"><span>FirstName:</span> <span>{user.firstName}</span></ListGroup.Item>
            <ListGroup.Item className="listUserLastName"><span>LastName:</span> <span>{user.lastName}</span></ListGroup.Item>
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