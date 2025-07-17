import { useState, type ChangeEvent, type MouseEvent } from "react";
import { Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import type { RootState } from "../../../RootStore";
import { useNavigate } from "react-router-dom";
import { Unauthorized } from "../../components/Pages";
import "../../../styles/DegreeCourse.css"
import { DEGREE_COURSE_URL} from "../../../config/config";

// verwendete Quellen: Folien und Videos von den Vorlesungen
// Quelle Form: https://react-bootstrap.netlify.app/docs/forms/form-control/
// Quelle Radios/Check https://react-bootstrap.netlify.app/docs/forms/checks-radios/

export function NewDegreeCoursePage() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [shortName, setShortName] = useState("");
    const [universityName, setUniversityName] = useState("");
    const [universityShortName, setUniversityShortName] = useState("");
    const [departmentName, setDepartmentName] = useState("");
    const [departmentShortName, setDepartmentShortName] = useState("");
    const { user, accessToken } = useSelector((state: RootState) => state.authentication);
    const [errorAnzeigen, setErrorAnzeigen] = useState(false);
    let errorText: string = "Es konnte kein neuer Studiengang angelegt werden.";

    const showStudiengangListe = () => {
        navigate("/degreeCourse")
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

    const handleSubmit = async (e: MouseEvent) => {
        e.preventDefault();
        const requestOptions = {
            method: 'POST',
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
            let response = await fetch(DEGREE_COURSE_URL, requestOptions);
            await response.json();
            if (response.ok) {
                navigate("/degreeCourse");
            } else {
                setErrorAnzeigen(true);
            }
        }
        catch (err) {
            console.log("Error bei Anfrage an Backend: " + err)
        }
    }

    let anlegenButton;
    if (name.length !== 0 && shortName.length !== 0 && universityName.length !== 0 && universityShortName.length !== 0 && departmentName.length !== 0 && departmentShortName.length !== 0) {
        anlegenButton = <Button id="CreateDegreeCourseComponentCreateDegreeCourseButton" variant="success" type="submit" onClick={handleSubmit}>Anlegen</Button>;
    } else {
        anlegenButton = <Button id="CreateDegreeCourseComponentCreateDegreeCourseButton" variant="success" type="submit" disabled>Anlegen</Button>;
    }

    if (accessToken !== null && user.isAdministrator) {
        return <div id="DegreeCourseManagementPageCreateComponent">
            <div id="NewDegreeCourseUeberschrift" className="ueberschrift">
                <span id="NewDegreeCourseUeberschriftText">Studiengang anlegen</span>
            </div>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Studiengang-Name</Form.Label>
                    <Form.Control id="CreateDegreeCourseComponentEditName" type="text" placeholder="Studiengang-Name" name="name" value={name} onChange={handleChange} isValid={name.length !== 0} isInvalid={!(name.length !== 0)}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Studiengang-Kurzbezeichnung</Form.Label>
                    <Form.Control id="CreateDegreeCourseComponentEditShortName" type="text" placeholder="Studiengang-Kurzbezeichnung" name="shortName" value={shortName} onChange={handleChange} isValid={shortName.length !== 0} isInvalid={!(shortName.length !== 0)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Universität-Name</Form.Label>
                    <Form.Control id="CreateDegreeCourseComponentEditUniversityName" type="text" placeholder="Universität-Name" name="universityName" value={universityName} onChange={handleChange} isValid={universityName.length !== 0} isInvalid={!(universityName.length !== 0)}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Universität-Kurzbezeichnung</Form.Label>
                    <Form.Control id="CreateDegreeCourseComponentEditUniversityShortName" type="text" placeholder="Universität-Kurzbezeichnung" name="universityShortName" value={universityShortName} onChange={handleChange} isValid={universityShortName.length !== 0} isInvalid={!(universityShortName.length !== 0)}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Fachbereich-Name</Form.Label>
                    <Form.Control id="CreateDegreeCourseComponentEditDepartmentName" type="text" placeholder="Fachbereich-Name" name="departmentName" value={departmentName} onChange={handleChange} isValid={departmentName.length !== 0} isInvalid={!(departmentName.length !== 0)}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Fachbereich-Kurzbezeichnung</Form.Label>
                    <Form.Control id="CreateDegreeCourseComponentEditDepartmentShortName" type="text" placeholder="Fachbereich-Kurzbezeichnung" name="departmentShortName" value={departmentShortName} onChange={handleChange} isValid={departmentShortName.length !== 0} isInvalid={!(departmentShortName.length !== 0)}/>
                </Form.Group>
                {errorAnzeigen && <div style={{ color: "rgb(255,0,0)" }}>{errorText}</div>}
                <div id="NewDegreeCourseButtons">
                    {anlegenButton}
                    <Button id="OpenDegreeCourseManagementPageListComponentButton" className="EditButton" variant="secondary" onClick={showStudiengangListe}>Cancel</Button>
                </div>
            </Form>
        </div>;
    } else {
        return <Unauthorized />;
    }
}