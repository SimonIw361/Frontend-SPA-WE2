import { Button, Card, ListGroup, Modal } from "react-bootstrap";
import type { DegreeCourse } from "../DegreeCoursePage";
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
    const { user, accessToken } = useSelector((state: RootState) => state.authentication);
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
        navigate("/degreeCourse/editDegreeCourse");
    }

    const handleCreateDegreeCourseApplication = () => {
        dispatch(hideDegreeCourseEditAlertSuccess());
        dispatch(setSelectedDegreeCourse(studiengang));
        navigate("/degreeCourseApplication/newDegreeCourseApplication");
    }

    let deleteButton = <Button id="DeleteDialogConfirmButton" className="DeleteButton" variant="danger" onClick={handleDelete}>Delete</Button>

    let header;
    if (studiengang.shortName == "") {
        header = <Card.Header><b>{studiengang.name}</b></Card.Header>
    } else {
        header = <Card.Header><b>{studiengang.shortName}: {studiengang.name}</b></Card.Header>
    }

    let editButtonComponent;
    let deleteButtonComponent;
    if (user.isAdministrator) {
        deleteButtonComponent = <Button id={"DegreeCourseItemDeleteButton" + studiengang.id} className="DeleteButton" variant="danger" onClick={handleOpenDeleteDialog}>Delete</Button>;
        editButtonComponent = <Button id={"DegreeCourseItemEditButton" + studiengang.id} className="EditButton" variant="warning" onClick={handleEditDegreeCourse}>Edit</Button>;
    } else {
        editButtonComponent = <div></div>;
        deleteButtonComponent = <div></div>;
    }

    if (accessToken !== null) {
        return <div><Card id={"DegreeCourseItem" + studiengang.id} style={{ minWidth: "200px" }}>
            {header}
            <ListGroup>
                <ListGroup.Item id="UniversityName" className="listUniversityName" ><span>Universität:</span> <span>{studiengang.universityName}</span></ListGroup.Item>
                <ListGroup.Item id="DepartmentName" className="listDepartmentName"><span>Fachbereich:</span> <span>{studiengang.departmentName}</span></ListGroup.Item>
                <ListGroup.Item id="Name" className="listName"><span>Studiengang:</span> <span>{studiengang.name}</span></ListGroup.Item>
            </ListGroup>
            <Card.Footer className="listFooterButtons">
                {editButtonComponent}
                {deleteButtonComponent}
                <Button id={"CreateDegreeCourseApplicationForDegreeCourse" + studiengang.id} variant="success" onClick={handleCreateDegreeCourseApplication}>Create Application</Button>
            </Card.Footer>
        </Card>
            <Modal show={showDeleteDialog} id={"DeleteDialogDegreeCourse" + studiengang.id} onHide={handleCloseDeleteDialog} >
                <Modal.Header closeButton>
                    <Modal.Title>Studiengang {studiengang.shortName}: {studiengang.name} löschen?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>Soll Studiengang {studiengang.shortName}: {studiengang.name} gelöscht werden?</div>
                </Modal.Body>
                <Modal.Footer>
                    <Button id="DeleteDialogCancelButton" className="EditButton" variant="secondary" onClick={handleCloseDeleteDialog}>Cancel</Button>
                    {deleteButton}
                </Modal.Footer>
            </Modal>
        </div>;
    }
}