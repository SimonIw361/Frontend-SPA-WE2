import { useEffect, useState, type ChangeEvent, type MouseEvent } from "react";
import { Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import type { RootState } from "../../../RootStore";
import { useNavigate } from "react-router-dom";
import { PageNotFound} from "../../components/Pages";
import "../../../styles/DegreeCourse.css"
import { DEGREE_COURSE_APPLICATION_URL } from "../../../config/config";

// verwendete Quellen: Folien und Videos von den Vorlesungen
// Quelle Form: https://react-bootstrap.netlify.app/docs/forms/form-control/
// Quelle Radios/Check https://react-bootstrap.netlify.app/docs/forms/checks-radios/

export type DegreeCourseApplicationEdit = {
    id?: string
    applicantUserID?: string,
    degreeCourseID?: string,
    targetPeriodYear?: string,
    targetPeriodShortName?: string
}

export function NewDegreeCourseApplicationPage() {
    const navigate = useNavigate();
    const { user, accessToken } = useSelector((state: RootState) => state.authentication);
    const { selectedDegreeCourse } = useSelector((state: RootState) => state.degreeCourse);
    const [applicantUserID, setApplicantUserID] = useState("");
    const [degreeCourseName, setDegreeCourseName] = useState("");
    const [targetPeriodYear, setTargetPeriodYear] = useState("");
    const [targetPeriodShortName, setTargetPeriodShortName] = useState("");
    const [errorAnzeigen, setErrorAnzeigen] = useState(false);
    let errorText: string = "Es konnte keine neue Bewerbung angelegt werden.";

    useEffect(() => {
        if (selectedDegreeCourse !== null) {
            if (selectedDegreeCourse.shortName == "") {
                setDegreeCourseName(selectedDegreeCourse.name)
            } else {
                setDegreeCourseName(selectedDegreeCourse.shortName + ": " + selectedDegreeCourse.name)
            }
        } else {
            setDegreeCourseName("");
        }

        if (user.userID !== null) {
            if (!user.isAdministrator) {
                setApplicantUserID(user.userID);
            }
        }
    }, []);

    const showBewerbungListe = () => {
        navigate("/degreeCourseApplication");
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
        if (selectedDegreeCourse == null) {
            return <PageNotFound />
        }

        let body: DegreeCourseApplicationEdit ={
            "degreeCourseID": selectedDegreeCourse.id,
            "targetPeriodYear": targetPeriodYear,
            "targetPeriodShortName": targetPeriodShortName
        }
        if(user.isAdministrator){
            body.applicantUserID = applicantUserID;
        }

        const requestOptions = {
            method: 'POST',
            headers: {
                "Authorization": "Basic " + accessToken,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }

        try {
            let response = await fetch(DEGREE_COURSE_APPLICATION_URL, requestOptions);
            await response.json();
            if (response.ok) {
                navigate("/degreeCourse");
            } else {
                setErrorAnzeigen(true);
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

    if (accessToken !== null) {
        return <div id="DegreeCourseApplicationManagementPageCreateComponent">
            <div id="NewDegreeCourseApplicationUeberschrift" className="ueberschrift">
                <span id="NewDegreeCourseApplicationUeberschriftText">Studiengangsbewerbung anlegen</span>
            </div>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Studiengang</Form.Label>
                    <Form.Control id="CreateDegreeCourseApplicationEditDegreeCourse" type="text" placeholder="Studiengang" name="degreeCourseName" value={degreeCourseName} isValid={degreeCourseName.length !== 0} isInvalid={!(degreeCourseName.length !== 0)} disabled readOnly />
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
                    <Form.Control id="CreateDegreeCourseApplicationEditTargetPeriodName" as="select" name="targetPeriodShortName" defaultValue={""} onChange={handleChange} isValid={targetPeriodShortName.length !== 0} isInvalid={!(targetPeriodShortName.length !== 0)} >
                        <option value="">Bitte Semester auswählen</option>
                        <option value="WiSe">Wintersemester</option>
                        <option value="SoSe">Sommersemester</option>
                    </Form.Control>
                </Form.Group>
                {errorAnzeigen && <div style={{ color: "rgb(255,0,0)" }}>{errorText}</div>}
                <div id="NewDegreeCourseButtons">
                    {anlegenButton}
                    <Button id="OpenDegreeCourseManagementPageListComponentButton" className="EditButton" variant="secondary" onClick={showBewerbungListe}>Cancel</Button>
                </div>
            </Form>
        </div>;
    }

}