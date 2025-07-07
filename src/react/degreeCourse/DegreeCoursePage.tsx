import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../RootStore";
import { useEffect, useState } from "react";
import { Alert, Button, ListGroup } from "react-bootstrap";
import { Unauthorized } from "../components/Pages";
import { useNavigate } from "react-router-dom";
import { DegreeCourseComponent } from "./components/DegreeCourseComponent";
import "../../styles/DegreeCourse.css"
import { DEGREE_COURSE_URL } from "../../config/config";
import { hideDegreeCourseEditAlertSuccess, setSelectedDegreeCourse } from "./state/DegreeCourseSlice";
import { setSelectedDegreeCourseApplication } from "../degreeCourseApplication/state/DegreeCourseApplicationSlice";

// verwendete Quellen: Folien und Videos von den Vorlesungen
// Quelle useState typisieren: https://stackoverflow.com/questions/53650468/set-types-on-usestate-react-hook-with-typescript
// Quelle useEffect: https://www.w3schools.com/react/react_useeffect.asp
// Quelle zu useNavigate: https://medium.com/@bobjunior542/using-usenavigate-in-react-router-6-a-complete-guide-46f51403f430
// Quelle asynchroner Aufruf in useEffect: https://stackoverflow.com/questions/53332321/react-hook-warnings-for-async-function-in-useeffect-useeffect-function-must-ret
// Quelle async in useEffect: https://devtrium.com/posts/async-functions-useeffect

export type DegreeCourse = {
    id: string
    name: string,
    shortName: string,
    universityName: string,
    universityShortName: string,
    departmentName: string,
    departmentShortName: string
}

//ruft alle Studiengaenge vom Backend ab und gibt diese als Array zurueck, wird in mehreren Komponenten verwendet
export const getAllStudiengaenge = async (token: string | null) => {
    const requestOptions = {
        method: 'GET',
        headers: { "Authorization": "Basic " + token }
    }

    try {
        let response = await fetch(DEGREE_COURSE_URL, requestOptions);
        if (response.ok) {
            const data: DegreeCourse[] = await response.json();
            return data;
        } else {
            console.log("Error " + response.status + " " + response.statusText + ": Fehler beim Abfragen aller Studiengaange auf DegreeCoursePage");
            return null;
        }
    }
    catch (err) {
        console.log("Error bei Anfrage an Backend: " + err);
        return null;
    }
}

export function DegreeCoursePage() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [studiengaenge, setStudiengaenge] = useState<DegreeCourse[]>([]); //lokaler State vom Typ DegreeCourse[]
    const { user, accessToken } = useSelector((state: RootState) => state.authentication);
    const { showDegreeCourseEditAlertSuccessBool } = useSelector((state: RootState) => state.degreeCourse);
    
    useEffect(() => { //wird einmal am Anfang beim Laden der Seite aufgerufen
        dispatch(setSelectedDegreeCourse(null));
        dispatch(setSelectedDegreeCourseApplication(null));
        studiengaengeSetzen();
    }, [])

    const studiengaengeSetzen = async () => {
        let allStudiengaenge = await getAllStudiengaenge(accessToken);
        if(allStudiengaenge){
            setStudiengaenge(allStudiengaenge);
        }
    }

    const handleNewDegreeCourse = () => {
        dispatch(hideDegreeCourseEditAlertSuccess());
        navigate("/degreeCourse/newDegreeCourse");
    }

    let newDegreeCourseButton;
    if (user.isAdministrator) {
        newDegreeCourseButton = <Button id="DegreeCourseManagementPageCreateDegreeCourseButton" variant="primary" onClick={handleNewDegreeCourse}>Studiengang anlegen</Button>;
    } else {
        newDegreeCourseButton = <div></div>
    }

    if (accessToken !== null) {
        try {
            //Success Alert ist hier eingebunden, Einblenden/Ausblenden davon wird durch Redux Store gesteuert
            //show wird in DegreeCourseEditPage aufgerufen, hide wird bei Verlassen der DegreeCoursePage aufgerufen
            return <div id="DegreeCourseManagementPage">
                <Alert show={showDegreeCourseEditAlertSuccessBool} id="AlertDegreeCourseEditSuccess" variant="success" onClose={() => dispatch(hideDegreeCourseEditAlertSuccess())} dismissible>
                    Studiengang wurde erfolgreich bearbeitet
                </Alert>
                <div id="DegreeCourseUeberschrift" className="ueberschrift">
                    <span id="DegreeCourseUeberschriftText">Studiengang-Liste</span>
                    {newDegreeCourseButton}
                </div>
                <ListGroup id="DegreeCourseManagementPageListComponent" horizontal>
                    {studiengaenge.map(studiengang => (
                        <DegreeCourseComponent studiengang={studiengang} key={"DegreeCourseItem" + studiengang.id} degreeCourseAktualisieren={studiengaengeSetzen} /> //getAllStudiengaenge wird uebergeben, damit diese zum Aktualisieren der DegreeCourseListe aufgerufen werden kann
                    ))}
                </ListGroup>
            </div>
        }
        catch (err) {
            return <Unauthorized />; //tritt auf wenn Token ungueltig ist, bei map wird dann Fehler geworfen
        }
    } else {
        return <Unauthorized />;
    }
}