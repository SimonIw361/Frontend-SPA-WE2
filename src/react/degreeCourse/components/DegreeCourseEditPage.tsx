import { useState, type ChangeEvent, type MouseEvent } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../RootStore";
import { useNavigate } from "react-router-dom";
import { PageNotFound, Unauthorized } from "../../components/Pages";
import "../../../styles/DegreeCourse.css"
import {showDegreeCourseEditAlertSuccess } from "../state/DegreeCourseSlice";
import { DEGREE_COURSE_URL } from "../../../config/config";

// verwendete Quellen: Folien und Videos von den Vorlesungen
// Quelle Form: https://react-bootstrap.netlify.app/docs/forms/form-control/
// Quelle Radios/Check https://react-bootstrap.netlify.app/docs/forms/checks-radios/
// Quelle zu fetch Anfrage https://developer.mozilla.org/de/docs/Web/API/Fetch_API/Using_Fetch

export function DegreeCourseEditPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { user, accessToken } = useSelector((state: RootState) => state.authentication);
    const { selectedDegreeCourse } = useSelector((state: RootState) => state.degreeCourse);

    if (accessToken === null && !user.isAdministrator) { // verhindern das man ohne Login auf Seite zugreifen kann
        return <Unauthorized />;
    }
    if (selectedDegreeCourse === null) { //kein Studiengang ausgewaehlt, irgendein Fehler im Code!!
        console.log("Error: DegreeCourseEditPage soll aufgerufen werden, selectedDegreeCourse ist aber null " + selectedDegreeCourse);
        return <PageNotFound />;
    }

    const [name, setName] = useState(selectedDegreeCourse.name);
    const [shortName, setShortName] = useState(selectedDegreeCourse.shortName);
    const [universityName, setUniversityName] = useState(selectedDegreeCourse.universityName);
    const [universityShortName, setUniversityShortName] = useState(selectedDegreeCourse.universityShortName);
    const [departmentName, setDepartmentName] = useState(selectedDegreeCourse.departmentName);
    const [departmentShortName, setDepartmentShortName] = useState(selectedDegreeCourse.departmentShortName);
    const [errorAnzeigen, setErrorAnzeigen] = useState(false);
    let errorText: string = "Der Studiengang konnte nicht bearbeitet werden.";

    const showStudiengangListe = () => {
        navigate("/degreeCourse");
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        let t = e.target;
        let name = t.name;
        let value = t.value;
        switch (name) {
            case "name":
                setName(value);
                break;
            case "shortName":
                setShortName(value);
                break;
            case "universityName":
                setUniversityName(value);
                break;
            case "universityShortName":
                setUniversityShortName(value);
                break;
            case "departmentName":
                setDepartmentName(value);
                break;
            case "departmentShortName":
                setDepartmentShortName(value);
                break;
            default:
                console.log("Error: Fehler beim Aendern von NewDegreeCourse State in handleChange")
        }
    }

    const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        let requestOptions = {
            method: 'PUT',
            headers: {
                "Authorization": "Bearer " + accessToken,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "name": name,
                "shortName": shortName,
                "universityName": universityName,
                "universityShortName": universityShortName,
                "departmentName": departmentName,
                "departmentShortName": departmentShortName
            })
        }

        try {
            let response = await fetch(DEGREE_COURSE_URL + "/" + selectedDegreeCourse.id, requestOptions);
            await response.json();
            if (response.ok) {
                dispatch(showDegreeCourseEditAlertSuccess());
                navigate("/degreeCourse");
            } else {
                setErrorAnzeigen(true); //passiert nie, man kann keine ungueltigen Werte eingeben (wenn ungueltig werden alte Werte genommen)
            }
        }
        catch (err) {
            console.log("Error bei Anfrage an Backend: " + err)
        }
    }
        
    let saveButton;
    if (name.length !== 0 && shortName.length !== 0 && universityName.length !== 0 && universityShortName.length !== 0 && departmentName.length !== 0 && departmentShortName.length !== 0) {
        saveButton = <Button id="EditDegreeCourseComponentSaveDegreeCourseButton" variant="success" type="submit" onClick={handleSubmit}>Speichern</Button>;
    } else {
        saveButton = <Button id="EditDegreeCourseComponentSaveDegreeCourseButton" variant="success" type="submit" disabled>Speichern</Button>;
    }

    if (accessToken !== null && user.isAdministrator) {
        return <div id="DegreeCourseManagementPageEditComponent">
            <div id="DegreeCourseEditUeberschrift" className="ueberschrift">
                <span id="DegreeCourseEditUeberschriftText">Studiengang bearbeiten: {selectedDegreeCourse.name}</span>
            </div>
            <Form>
            <Form.Group className="mb-3">
                    <Form.Label>Studiengang-Name</Form.Label>
                    <Form.Control id="EditDegreeCourseComponentEditName" type="text" placeholder="Studiengang-Name" name="name" value={name} onChange={handleChange} isValid={name.length !== 0} isInvalid={!(name.length !== 0)}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Studiengang-Kuzbezeichnung</Form.Label>
                    <Form.Control id="EditDegreeCourseComponentEditShortName" type="text" placeholder="Studiengang-Kuzbezeichnung" name="shortName" value={shortName} onChange={handleChange} isValid={shortName.length !== 0} isInvalid={!(shortName.length !== 0)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Universität-Name</Form.Label>
                    <Form.Control id="EditDegreeCourseComponentEditUniversityName" type="text" placeholder="Universität-Name" name="universityName" value={universityName} onChange={handleChange} isValid={universityName.length !== 0} isInvalid={!(universityName.length !== 0)}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Universität-Kurzbezeichnung</Form.Label>
                    <Form.Control id="EditDegreeCourseComponentEditUniversityShortName" type="text" placeholder="Universität-Kurzbezeichnung" name="universityShortName" value={universityShortName} onChange={handleChange} isValid={universityShortName.length !== 0} isInvalid={!(universityShortName.length !== 0)}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Fachbereich-Name</Form.Label>
                    <Form.Control id="EditDegreeCourseComponentEditDepartmentName" type="text" placeholder="Fachbereich-Name" name="departmentName" value={departmentName} onChange={handleChange} isValid={departmentName.length !== 0} isInvalid={!(departmentName.length !== 0)}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Fachbereich-Kurzbezeichnung</Form.Label>
                    <Form.Control id="EditDegreeCourseComponentEditDepartmentShortName" type="text" placeholder="Fachbereich-Kurzbezeichnung" name="departmentShortName" value={departmentShortName} onChange={handleChange} isValid={departmentShortName.length !== 0} isInvalid={!(departmentShortName.length !== 0)}/>
                </Form.Group>
                {errorAnzeigen && <div style={{ color: "rgb(255,0,0)" }}>{errorText}</div>}
                <div id="EditDegreeCourseButtons">
                    {saveButton}
                    <Button id="OpenDegreeCourseManagementPageListComponentButton" className="EditButton" variant="secondary" onClick={showStudiengangListe}>Cancel</Button>
                </div>
            </Form>
        </div>;
    } else {
        return <Unauthorized />;
    }
}
