import { useEffect, useState, type ChangeEvent, type MouseEvent } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../RootStore";
import { useNavigate } from "react-router-dom";
import { PageNotFound, Unauthorized } from "../../components/Pages";
import "../../../styles/DegreeCourse.css"
import { showDegreeCourseApplicationEditAlertSuccess } from "../state/DegreeCourseApplicationSlice";
import { DEGREE_COURSE_APPLICATION_URL, DEGREE_COURSE_URL } from "../../../config/config";
import type { DegreeCourse } from "../../degreeCourse/components/DegreeCoursePage";

// verwendete Quellen: Folien und Videos von den Vorlesungen
// Quelle Form: https://react-bootstrap.netlify.app/docs/forms/form-control/
// Quelle Radios/Check https://react-bootstrap.netlify.app/docs/forms/checks-radios/
// Quelle zu fetch Anfrage https://developer.mozilla.org/de/docs/Web/API/Fetch_API/Using_Fetch

export type DegreeCourseApplicationEdit = {
    id?: string
    applicantUserID?: string,
    degreeCourseID?: string,
    targetPeriodYear?: string,
    targetPeriodShortName?: string
}

export function DegreeCourseApplicationEditPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { user, accessToken } = useSelector((state: RootState) => state.authentication);
    const { selectedDegreeCourseApplication } = useSelector((state: RootState) => state.degreeCourseApplication);

    if (accessToken === null && !user.isAdministrator) { //verhindern das man ohne Login auf Seite zugreifen kann
        return <Unauthorized />;
    }
    if (selectedDegreeCourseApplication === null) { //keine Bewerbung ausgewaehlt, irgendein Fehler im Code!!
        console.log("Error: DegreeCourseApplicationEditPage soll aufgerufen werden, selectedUser ist aber null " + selectedDegreeCourseApplication);
        return <PageNotFound />;
    }

    const [applicantUserID, setApplicantUserID] = useState("");
    const [degreeCourseName, setDegreeCourseName] = useState("");
    const [targetPeriodYear, setTargetPeriodYear] = useState("");
    const [targetPeriodShortName, setTargetPeriodShortName] = useState("");
    const [studiengang, setStudiengaeng] = useState<DegreeCourse>();
    const [errorAnzeigen, setErrorAnzeigen] = useState(false);
    let errorText: string = "Es konnte keine neue Bewerbung angelegt werden.";

    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            headers: {
                "Authorization": "Basic " + accessToken,
                "Content-Type": "application/json"
            }
        }

        const fetchStudiengang = async () => {//Daten fuer aktuellen Studiengang abfragen
            try {
                let response = await fetch(DEGREE_COURSE_URL + "/" + selectedDegreeCourseApplication.degreeCourseID, requestOptions);
                if (response.ok) {
                    setStudiengaeng(await response.json());
                } else {
                    //darf im Normalfall nicht passieren, passiert nur wenn Studiengang geloescht wird und Bewerbung noch existiert
                    console.log("Error " + response.status + " " + response.statusText + ": Es gibt keinen passenden Studiengang zu dieser Bewerbung");
                }
            }
            catch (err) {
                console.log("Error bei Anfrage an Backend: " + err);
            }
        }
        fetchStudiengang();
    }, [])

    useEffect(() => {
        setApplicantUserID(selectedDegreeCourseApplication.applicantUserID);
        setDegreeCourseName(studiengang?.shortName + ": " + studiengang?.name);
        setTargetPeriodYear("" + selectedDegreeCourseApplication.targetPeriodYear);
        setTargetPeriodShortName(selectedDegreeCourseApplication.targetPeriodShortName);
    }, [studiengang])

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

    const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.preventDefault();

        let body: DegreeCourseApplicationEdit = {
            "degreeCourseID": selectedDegreeCourseApplication.degreeCourseID,
            "targetPeriodYear": targetPeriodYear,
            "targetPeriodShortName": targetPeriodShortName
        }
        if (user.isAdministrator) {
            body.applicantUserID = applicantUserID;
        }

        const requestOptions = {
            method: 'PUT',
            headers: {
                "Authorization": "Basic " + accessToken,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }

        try {
            let response = await fetch(DEGREE_COURSE_APPLICATION_URL + "/" + selectedDegreeCourseApplication.id, requestOptions);
            await response.json();
            if (response.ok) {
                dispatch(showDegreeCourseApplicationEditAlertSuccess());
                navigate("/degreeCourseApplication");
            } else {
                setErrorAnzeigen(true);
                console.log("Error " + response.status + " " + response.statusText + ": Fehler beim Anlegen einer Bewerbung auf DegreeCourseApplicationEditPage");
            }
        }
        catch (err) {
            console.log("Error bei Anfrage an Backend: " + err);
        }
    }

    let saveButton;
    if (applicantUserID.length !== 0 && degreeCourseName.length !== 0 && targetPeriodYear.length !== 0 && targetPeriodShortName.length !== 0) {
        saveButton = <Button id="EditDegreeCourseApplicationSaveDegreeCourseApplictionButton" variant="success" type="submit" onClick={handleSubmit}>Speichern</Button>;
    } else {
        saveButton = <Button id="EditDegreeCourseApplicationSaveDegreeCourseApplictionButton" variant="success" type="submit" disabled>Speichern</Button>;
    }

    let formUserID;
    if (user.isAdministrator) {
        formUserID = <Form.Control id="EditDegreeCourseApplicationEditUserID" type="text" placeholder="User-ID" name="applicantUserID" value={applicantUserID} onChange={handleChange} isValid={applicantUserID.length !== 0} isInvalid={!(applicantUserID.length !== 0)} />
    } else {
        formUserID = <Form.Control id="EditDegreeCourseApplicationEditUserID" type="text" placeholder="User-ID" name="applicantUserID" value={applicantUserID} isValid={applicantUserID.length !== 0} isInvalid={!(applicantUserID.length !== 0)} disabled readOnly />
    }

    if (accessToken !== null) {
        return <div id="DegreeCourseApplicationManagementPageEditComponent">
            <div id="DegreeCourseApplicationEditUeberschrift" className="ueberschrift">
                <span id="DegreeCourseApplicationEditUeberschriftText">Bewerbung bearbeiten: {studiengang?.name}</span>
            </div>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Studiengang</Form.Label>
                    <Form.Control id="EditDegreeCourseApplicationEditDegreeCourse" type="text" placeholder="Studiengang" name="degreeCourseName" value={degreeCourseName} isValid={degreeCourseName.length !== 0} isInvalid={!(degreeCourseName.length !== 0)} disabled readOnly />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>User-ID</Form.Label>
                    {formUserID}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Jahr</Form.Label>
                    <Form.Control id="EditDegreeCourseApplicationEditTargetPeriodYear" type="number" placeholder="Jahr" name="targetPeriodYear" value={targetPeriodYear} onChange={handleChange} isValid={targetPeriodYear.length === 4} isInvalid={!(targetPeriodYear.length === 4)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Semester</Form.Label>
                    <Form.Control id="EditDegreeCourseApplicationEditTargetPeriodShortName" as="select" name="targetPeriodShortName" value={targetPeriodShortName} onChange={handleChange} isValid={targetPeriodShortName.length !== 0} isInvalid={!(targetPeriodShortName.length !== 0)} >
                        <option value="">Bitte Semester auswählen</option>
                        <option value="WiSe">Wintersemester</option>
                        <option value="SoSe">Sommersemester</option>
                    </Form.Control>
                </Form.Group>
                {errorAnzeigen && <div style={{ color: "rgb(255,0,0)" }}>{errorText}</div>}
                <div id="EditDegreeCourseApplicationButtons">
                    {saveButton}
                    <Button id="OpenDegreeCourseApplicationManagementPageListComponentButton" className="EditButton" variant="secondary" onClick={showBewerbungListe}>Cancel</Button>
                </div>
            </Form>
        </div>;
    } else {
        return <Unauthorized />;
    }
}
