import { Button, Card, ListGroup, Modal } from "react-bootstrap";
import type { AppDispatch, RootState } from "../../../RootStore";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { DEGREE_COURSE_APPLICATION_URL, DEGREE_COURSE_URL } from "../../../config/config";
import type { DegreeCourseApplication } from "./DegreeCourseApplicationPage";
import { hideDegreeCourseApplicationEditAlertSuccess } from "../state/DegreeCourseApplicationSlice";
import type { DegreeCourse } from "../../degreeCourse/components/DegreeCoursePage";

// verwendete Quellen: Folien und Videos von den Vorlesungen
// Quelle zu List Group: https://react-bootstrap.netlify.app/docs/components/list-group/
// Quelle zu Cards: https://react-bootstrap.netlify.app/docs/components/cards/
// Quelle Props in Funktion: https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components

type DegreeCourseApplicationComponentProps = {
    bewerbung: DegreeCourseApplication,
    degreeCourseApplicationAktualisieren: () => void
}

export function DegreeCourseApplicationComponent({ bewerbung, degreeCourseApplicationAktualisieren }: DegreeCourseApplicationComponentProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { user, accessToken } = useSelector((state: RootState) => state.authentication);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [studiengang, setStudiengaeng] = useState<DegreeCourse>();//TODO Typ hinschreiben!!

    useEffect(() => {
        const fetchStudiengang = async () => {
            const requestOptions = {
                method: 'GET',
                headers: {
                    "Authorization": "Basic " + accessToken
                }
            }
    
            try {
                let response = await fetch(DEGREE_COURSE_URL + "/" + bewerbung.degreeCourseID, requestOptions);
                if (!response.ok) {
                    console.log("Error " + response.status + " " + response.statusText + ": Fehler beim Abfragen eines Studiengangs");
                } else {
                    setStudiengaeng(await response.json());
                }
            }
            catch (err) {
                console.log("Error bei Anfrage an Backend: " + err)
            }
        }

        fetchStudiengang();
    }, [])
    if(studiengang == undefined){
        return;
    }

    const handleOpenDeleteDialog = () => {
        dispatch(hideDegreeCourseApplicationEditAlertSuccess());
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
            let response = await fetch(DEGREE_COURSE_APPLICATION_URL + "/" + bewerbung.id, requestOptions);
            if (!response.ok) {
                console.log("Error " + response.status + " " + response.statusText + ": Fehler beim Loeschen eines Studiengangs");
            }
        }
        catch (err) {
            console.log("Error bei Anfrage an Backend: " + err)
        }

        degreeCourseApplicationAktualisieren();
        handleCloseDeleteDialog();
    }

    let deleteButton = <Button id="DeleteDialogConfirmButton" className="DeleteButton" variant="danger" onClick={handleDelete}>Delete</Button>

    //falls edit machen hier auch noch Buttons hinzufuegen
    let deleteButtonComponent;
    if (user.isAdministrator) {
        deleteButtonComponent = <Button id={"DegreeCourseApplicationItemDeleteButton" + bewerbung.id} className="EditButton" variant="danger" onClick={handleOpenDeleteDialog}>Delete</Button>;
    } else {
        deleteButtonComponent = <div></div>;
    }

    if (accessToken !== null) {
        return <div><Card id={"DegreeCourseApplicationItem" + bewerbung.id} style={{ minWidth: "200px" }}>
            <Card.Header><b>{user.userID}: {studiengang?.universityShortName}{bewerbung.targetPeriodYear} {bewerbung.targetPeriodShortName}</b></Card.Header>
            <ListGroup>
                <ListGroup.Item id="ApplicantUserID" className="listApplicantUserID" ><span>User:</span> <span>{bewerbung.applicantUserID}</span></ListGroup.Item>
                <ListGroup.Item id="DegreeCourseName" className="listDegreeCourseName"><span>Studiengang:</span> <span>{studiengang.name}</span></ListGroup.Item>
                <ListGroup.Item id="TargetPeriodYear" className="listTargetPeriodYear"><span>Bewerbungsjahr:</span> <span>{bewerbung.targetPeriodYear}</span></ListGroup.Item>
                <ListGroup.Item id="TargetPeriodShortName" className="listTargetPeriodShortName"><span>Bewerbungssemester:</span> <span>{bewerbung.targetPeriodShortName}</span></ListGroup.Item>
                <ListGroup.Item id="UniversityShortName" className="listUniversityShortName"><span>Universität:</span> <span>{studiengang.universityShortName}</span></ListGroup.Item>
                <ListGroup.Item id="DepartmentShortName" className="listDepartmentShortName"><span>Fachbereich:</span> <span>{studiengang.departmentShortName}</span></ListGroup.Item>
            </ListGroup>
            <Card.Footer className="listFooterButtons">
                {deleteButtonComponent}
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