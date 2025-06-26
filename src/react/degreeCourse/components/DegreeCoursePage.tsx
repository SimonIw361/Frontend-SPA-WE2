import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../RootStore";
import { useEffect, useState } from "react";
import { Alert, Button, ListGroup } from "react-bootstrap";
import { Unauthorized } from "../../components/Pages";
import { useNavigate } from "react-router-dom";
import { DegreeCourseComponent } from "./DegreeCourseComponent";
import "../../../styles/DegreeCourse.css"
import { DEGREE_COURSE_URL} from "../../../config/config";
import { hideDegreeCourseEditAlertSuccess } from "../state/DegreeCourseSlice";

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

export function DegreeCoursePage() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [studiengaenge, setStudiengaenge] = useState<DegreeCourse[]>([]); //lokaler State vom Typ DegreeCourse[]
    const { user, accessToken } = useSelector((state: RootState) => state.authentication);
    const {showDegreeCourseEditAlertSuccessBool} = useSelector((state: RootState) => state.degreeCourse);

    const requestOptions = {
        method: 'GET',
        headers: { "Authorization": "Basic " + accessToken }
    }

    useEffect(() => { //wird einmal am Anfang beim Laden der Seite aufgerufen
        getAllStudiengaenge();
    },[])

    const getAllStudiengaenge = async () => {
        try {
            let response = await fetch(DEGREE_COURSE_URL, requestOptions);
            if (response.ok) {
                const data: DegreeCourse[] = await response.json();
                setStudiengaenge(data);
            } else {
                console.log("Error " + response.status + " " + response.statusText + ": Fehler beim Abfragen aller Studiengaange auf DegreeCoursePage");
            }
        }
        catch (err) {
            console.log("Error bei Anfrage an Backend: " + err)
        }
    }

    const handleNewDegreeCourse = () => {
        dispatch(hideDegreeCourseEditAlertSuccess());
        navigate("/users/newDegreeCourse");
    }
    
    if (accessToken !== null && user.isAdministrator) {
        try {
            //Success Alert ist hier eingebunden, Einblenden/Ausblenden davon wird durch Redux Store gesteuert
            //show wird in UserEditPage aufgerufen, hide wird bei Verlassen der UserPage aufgerufen
            return <div id="DegreeCourseManagementPage">
                <Alert show={showDegreeCourseEditAlertSuccessBool} id="AlertEditSuccess" variant="success" onClose={() => dispatch(hideDegreeCourseEditAlertSuccess())} dismissible>
                    Studiengang wurde erfolgreich bearbeitet
                </Alert>
                <div id="UserUeberschrift" className="ueberschrift">
                    <span id="UserUeberschriftText">Studiengang-Liste</span>
                    <Button id="DegreeCourseManagementPageCreateDegreeCourseButton" variant="primary" onClick={handleNewDegreeCourse}>User anlegen</Button>
                </div>
                <ListGroup id="DegreeCourseManagementPageListComponent" horizontal>
                    {studiengaenge.map(studiengang => (
                        <DegreeCourseComponent studiengang={studiengang} key={"DegreeCourseItem" + studiengang.id} degreeCourseAktualisieren={getAllStudiengaenge} /> //getAllStudiengaenge wird uebergeben, damit diese zum Aktualisieren der UserListe aufgerufen werden kann
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