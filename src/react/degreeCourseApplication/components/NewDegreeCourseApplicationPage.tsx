import { useEffect, useState, type ChangeEvent, type MouseEvent } from "react";
import { Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import type { RootState } from "../../../RootStore";
import { useNavigate } from "react-router-dom";
import "../../../styles/DegreeCourse.css"
import { DEGREE_COURSE_APPLICATION_URL } from "../../../config/config";
import type { DegreeCourseApplicationEdit } from "./DegreeCourseApplicationEditPage";
import { getAllStudiengaenge, type DegreeCourse } from "../../degreeCourse/DegreeCoursePage";
import { Unauthorized } from "../../components/Pages";

// verwendete Quellen: Folien und Videos von den Vorlesungen
// Quelle Form: https://react-bootstrap.netlify.app/docs/forms/form-control/
// Quelle Radios/Check https://react-bootstrap.netlify.app/docs/forms/checks-radios/

export function NewDegreeCourseApplicationPage() {
    const navigate = useNavigate();
    const { user, accessToken } = useSelector((state: RootState) => state.authentication);
    const { selectedDegreeCourse } = useSelector((state: RootState) => state.degreeCourse); //wenn das nicht null ist dann ist es ueber einen Studiengang aufgerufen, sonst wurde es ueber Bewerbungsseite aufgerufen
    const [applicantUserID, setApplicantUserID] = useState("");
    const [degreeCourseName, setDegreeCourseName] = useState("");
    const [degreeCourseID, setDegreeCourseID] = useState("");
    const [targetPeriodYear, setTargetPeriodYear] = useState("");
    const [targetPeriodShortName, setTargetPeriodShortName] = useState("");
    const [errorAnzeigen, setErrorAnzeigen] = useState(false);
    const [studiengaenge, setStudiengaenge] = useState<DegreeCourse[]>();
    let errorText: string = "Es konnte keine neue Bewerbung angelegt werden.";

    useEffect(() => {
        if (selectedDegreeCourse !== null) {
            if (selectedDegreeCourse.shortName == "") {
                setDegreeCourseName(selectedDegreeCourse.name)
            } else {
                setDegreeCourseName(selectedDegreeCourse.shortName + ": " + selectedDegreeCourse.name)
            }
            setDegreeCourseID(selectedDegreeCourse.id)
        } else {
            setDegreeCourseName("");
        }

        if (user.userID !== null) {
            if (!user.isAdministrator) {
                setApplicantUserID(user.userID);
            }
        }

        studiengaengeSetzen();
    }, []);

    const studiengaengeSetzen = async () => {
        let allStudiengaenge = await getAllStudiengaenge(accessToken);
        if (allStudiengaenge) {
            setStudiengaenge(allStudiengaenge);
        }
    }

    const showBewerbungListe = () => {
        navigate("/degreeCourseApplication");
    }

    const showStudiengangListe = () => {
        navigate("/degreeCourse");
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        let t = e.target;
        let name = t.name;
        let value = t.value;
        switch (name) {
            case "applicantUserID":
                setApplicantUserID(value);
                break;
            case "degreeCourseName":
                setDegreeCourseName(value);
                setDegreeCourseID(value);
                break;
            case "targetPeriodYear":
                setTargetPeriodYear(value);
                break;
            case "targetPeriodShortName":
                setTargetPeriodShortName(value);
                break;
            default:
                console.log("Error: Fehler beim Aendern von NewDegreeCourseApplication State in handleChange");
        }
    }

    const handleSubmit = async (e: MouseEvent) => {
        e.preventDefault();

        let body: DegreeCourseApplicationEdit = {
            "degreeCourseID": degreeCourseID,
            "targetPeriodYear": targetPeriodYear,
            "targetPeriodShortName": targetPeriodShortName
        }
        if (user.isAdministrator) {
            body.applicantUserID = applicantUserID;
        }

        const requestOptions = {
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + accessToken,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }

        try {
            let response = await fetch(DEGREE_COURSE_APPLICATION_URL, requestOptions);
            await response.json();
            if (response.ok) {
                if (selectedDegreeCourse !== null) {
                    navigate("/degreeCourse");
                } else {
                    navigate("/degreeCourseApplication");
                }
            } else {
                setErrorAnzeigen(true);
                console.log("Error " + response.status + " " + response.statusText + ": Fehler beim Anlegen einer Bewerbung auf NewDegreeCourseApplicationPage");
            }
        }
        catch (err) {
            console.log("Error bei Anfrage an Backend: " + err);
        }
    }

    let anlegenButton;
    if (applicantUserID.length !== 0 && degreeCourseName.length !== 0 && targetPeriodYear.length !== 0 && targetPeriodShortName.length !== 0) {
        anlegenButton = <Button id="CreateDegreeCourseApplicationCreateButton" variant="success" type="submit" onClick={handleSubmit}>Anlegen</Button>;
    } else {
        anlegenButton = <Button id="CreateDegreeCourseApplicationCreateButton" variant="success" type="submit" disabled>Anlegen</Button>;
    }

    let formUserID;
    if (user.isAdministrator) {
        formUserID = <Form.Control id="CreateDegreeCourseApplicationEditUserID" type="text" placeholder="User-ID" name="applicantUserID" value={applicantUserID} onChange={handleChange} isValid={applicantUserID.length !== 0} isInvalid={!(applicantUserID.length !== 0)} />
    } else {
        formUserID = <Form.Control id="CreateDegreeCourseApplicationEditUserID" type="text" placeholder="User-ID" name="applicantUserID" value={applicantUserID} isValid={applicantUserID.length !== 0} isInvalid={!(applicantUserID.length !== 0)} disabled readOnly />
    }

    let auswahlStudiengang;
    let cancelButton;
    if (selectedDegreeCourse !== null) {
        auswahlStudiengang = <Form.Control id="CreateDegreeCourseApplicationEditDegreeCourse" type="text" placeholder="Studiengang" name="degreeCourseName" value={degreeCourseName} isValid={degreeCourseName.length !== 0} isInvalid={!(degreeCourseName.length !== 0)} disabled readOnly />;
        cancelButton = <Button id="OpenDegreeCourseManagementPageListComponentButton" className="EditButton" variant="secondary" onClick={showStudiengangListe}>Cancel</Button>;
    } else {
        try {
            auswahlStudiengang = <Form.Control id="CreateDegreeCourseApplicationEditDegreeCourse" as="select" name="degreeCourseName" value={degreeCourseID} onChange={handleChange} isValid={degreeCourseID.length !== 0} isInvalid={!(degreeCourseID.length !== 0)} >
                <option value="">Bitte Studiengang auswählen</option>
                {studiengaenge?.map(studiengang => (
                    <option key={studiengang.id} value={studiengang.id}>{studiengang.name} ({studiengang.shortName})</option>
                ))}
            </Form.Control>;
            cancelButton = <Button id="OpenDegreeCourseManagementPageListComponentButton" className="EditButton" variant="secondary" onClick={showBewerbungListe}>Cancel</Button>;
        }
        catch (err) {
            return <Unauthorized />; //tritt auf wenn Token ungueltig ist, bei map wird dann Fehler geworfen
        }
    }

    if (accessToken !== null) {
        return <div id="DegreeCourseApplicationManagementPageCreateComponent">
            <div id="NewDegreeCourseApplicationUeberschrift" className="ueberschrift">
                <span id="NewDegreeCourseApplicationUeberschriftText">Studiengangsbewerbung anlegen</span>
            </div>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Studiengang</Form.Label>
                    {auswahlStudiengang}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>User-ID</Form.Label>
                    {formUserID}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Jahr</Form.Label>
                    <Form.Control id="CreateDegreeCourseApplicationEditTargetPeriodYear" type="number" placeholder="Jahr" name="targetPeriodYear" value={targetPeriodYear} onChange={handleChange} isValid={targetPeriodYear.length === 4} isInvalid={!(targetPeriodYear.length === 4)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Semester</Form.Label>
                    <Form.Control id="CreateDegreeCourseApplicationEditTargetPeriodName" as="select" name="targetPeriodShortName" value={targetPeriodShortName} onChange={handleChange} isValid={targetPeriodShortName.length !== 0} isInvalid={!(targetPeriodShortName.length !== 0)} >
                        <option value="">Bitte Semester auswählen</option>
                        <option value="WiSe">Wintersemester</option>
                        <option value="SoSe">Sommersemester</option>
                    </Form.Control>
                </Form.Group>
                {errorAnzeigen && <div style={{ color: "rgb(255,0,0)" }}>{errorText}</div>}
                <div id="NewDegreeCourseButtons">
                    {anlegenButton}
                    {cancelButton}
                </div>
            </Form>
        </div>;
    } else {
        return <Unauthorized />;
    }

}