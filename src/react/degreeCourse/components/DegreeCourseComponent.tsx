import { Button, Card, ListGroup, Modal } from "react-bootstrap";
import type { DegreeCourse } from "./DegreeCoursePage";
import type { AppDispatch, RootState } from "../../../RootStore";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { hideDegreeCourseEditAlertSuccess, setSelectedDegreeCourse } from "../state/DegreeCourseSlice";
import { useNavigate } from "react-router-dom";
import { DEGREE_COURSE_URL } from "../../../config/config";

// verwendete Quellen: Folien und Videos von den Vorlesungen
// Quelle zu List Group: https://react-bootstrap.netlify.app/docs/components/list-group/
// Quelle zu Cards: https://react-bootstrap.netlify.app/docs/components/cards/
// Quelle Props in Funktion: https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components

type DegreeCourseComponentProps = {
    studiengang: DegreeCourse,
    degreeCourseAktualisieren: () => void
}

export function DegreeCourseComponent({ studiengang, degreeCourseAktualisieren }: DegreeCourseComponentProps) {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { accessToken } = useSelector((state: RootState) => state.authentication);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleOpenDeleteDialog = () => {
        dispatch(hideDegreeCourseEditAlertSuccess());
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
            let response = await fetch(DEGREE_COURSE_URL + "/" + studiengang.id, requestOptions);
            if (!response.ok) {
                console.log("Error " + response.status + " " + response.statusText + ": Fehler beim Loeschen eines Studiengangs");
            }
        }
        catch (err) {
            console.log("Error bei Anfrage an Backend: " + err)
        }

        degreeCourseAktualisieren();
        handleCloseDeleteDialog();
    }

    const handleEditDegreeCourse = () => {
        dispatch(hideDegreeCourseEditAlertSuccess());
        dispatch(setSelectedDegreeCourse(studiengang));
        navigate("/users/editUser");
    }

    let deleteButton = <Button id="DeleteDialogConfirmButton" className="DeleteButton" variant="danger" onClick={handleDelete}>Delete</Button>

    return <div><Card id={"DegreeCourseItem" + studiengang.id} style={{ minWidth: "200px" }}>
        <Card.Header><b>{studiengang.shortName}: {studiengang.name}</b></Card.Header>
        <ListGroup>
            <ListGroup.Item id="University" className="listUniversity" ><span>Universität:</span> <span>{studiengang.universityName}</span></ListGroup.Item>
            <ListGroup.Item className="listUserFirstName"><span>FirstName:</span> <span>{studiengang.id}</span></ListGroup.Item>
            <ListGroup.Item className="listUserLastName"><span>LastName:</span> <span>{studiengang.id}</span></ListGroup.Item>
        </ListGroup>
        <Card.Footer className="listFooterButtons">
            <Button id={"UserItemEditButton" + studiengang.id} className="EditButton" variant="warning" onClick={handleEditDegreeCourse}>Edit</Button>
            <Button id={"UserItemDeleteButton" + studiengang.id} className="DeleteButton" variant="danger" onClick={handleOpenDeleteDialog}>Delete</Button>
        </Card.Footer>
    </Card>
        <Modal show={showDeleteDialog} id={"DeleteDialogUser" + studiengang.id} onHide={handleCloseDeleteDialog} >
            <Modal.Header closeButton>
                <Modal.Title>User {studiengang.id} löschen?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>Soll User {studiengang.id} {studiengang.id} gelöscht werden?</div>
            </Modal.Body>
            <Modal.Footer>
                <Button id="DeleteDialogCancelButton" className="EditButton" variant="secondary" onClick={handleCloseDeleteDialog}>Cancel</Button>
                {deleteButton}
            </Modal.Footer>
        </Modal>
    </div>
}