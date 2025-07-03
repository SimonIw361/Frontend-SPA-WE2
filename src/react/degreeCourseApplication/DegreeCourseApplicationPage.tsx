import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../RootStore";
import { useEffect, useState } from "react";
import { Alert, Button, ListGroup } from "react-bootstrap";
import { Unauthorized } from "../components/Pages";
import "../../styles/DegreeCourseApplication.css"
import { DEGREE_COURSE_APPLICATION_URL, DEGREE_COURSE_MY_APPLICATION_URL} from "../../config/config";
import { hideDegreeCourseApplicationEditAlertSuccess, setSelectedDegreeCourseApplication } from "./state/DegreeCourseApplicationSlice";
import { DegreeCourseApplicationComponent } from "./components/DegreeCourseApplicationComponent";
import { useNavigate } from "react-router-dom";

// verwendete Quellen: Folien und Videos von den Vorlesungen
// Quelle useState typisieren: https://stackoverflow.com/questions/53650468/set-types-on-usestate-react-hook-with-typescript
// Quelle useEffect: https://www.w3schools.com/react/react_useeffect.asp
// Quelle zu useNavigate: https://medium.com/@bobjunior542/using-usenavigate-in-react-router-6-a-complete-guide-46f51403f430
// Quelle asynchroner Aufruf in useEffect: https://stackoverflow.com/questions/53332321/react-hook-warnings-for-async-function-in-useeffect-useeffect-function-must-ret
// Quelle async in useEffect: https://devtrium.com/posts/async-functions-useeffect

export type DegreeCourseApplication = {
    id: string
    applicantUserID: string,
    degreeCourseID: string,
    targetPeriodYear: number,
    targetPeriodShortName: string
}

export function DegreeCourseApplicationPage() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [bewerbungen, setBewerbungen] = useState<DegreeCourseApplication[]>([]); //lokaler State vom Typ DegreeCourse[]
    const { user, accessToken } = useSelector((state: RootState) => state.authentication);
    const {showDegreeCourseApplicationEditAlertSuccessBool} = useSelector((state: RootState) => state.degreeCourseApplication);

    const requestOptions = {
        method: 'GET',
        headers: { "Authorization": "Basic " + accessToken }
    }

    useEffect(() => { //wird einmal am Anfang beim Laden der Seite aufgerufen
        dispatch(setSelectedDegreeCourseApplication(null));
        getAllBewerbungen();
    },[])

    const getAllBewerbungen = async () => {
        let url;
        if(user.isAdministrator){ //wenn nicht Admin nur seine eigenen Bewerbungen sehen (andere URL nehmen)
            url = DEGREE_COURSE_APPLICATION_URL
        } else {
            url = DEGREE_COURSE_MY_APPLICATION_URL;
        }
        try {
            let response = await fetch(url, requestOptions);
            if (response.ok) {
                const data: DegreeCourseApplication[] = await response.json();
                setBewerbungen(data);
            } else {
                console.log("Error " + response.status + " " + response.statusText + ": Fehler beim Abfragen aller Bewerbungen auf DegreeCourseApplicationPage");
            }
        }
        catch (err) {
            console.log("Error bei Anfrage an Backend: " + err)
        }
    }

    const handleNewDegreeCourseApplication = () => {
        dispatch(hideDegreeCourseApplicationEditAlertSuccess());
        navigate("/degreeCourseApplication/newDegreeCourseApplication");
    }
    
    if (accessToken !== null) {
        try {
            //Success Alert ist hier eingebunden, Einblenden/Ausblenden davon wird durch Redux Store gesteuert
            //show wird in DegreeCourseEditPage aufgerufen, hide wird bei Verlassen der DegreeCoursePage aufgerufen
            return <div id="DegreeCourseApplicationManagementPage">
                <Alert show={showDegreeCourseApplicationEditAlertSuccessBool} id="AlertDegreeCourseEditSuccess" variant="success" onClose={() => dispatch(hideDegreeCourseApplicationEditAlertSuccess())} dismissible>
                    Bewerbung wurde erfolgreich bearbeitet
                </Alert>
                <div id="DegreeCourseApplicationUeberschrift" className="ueberschrift">
                    <span id="DegreeCourseApplicationUeberschriftText">Studiengangbewerbung-Liste</span>
                    <span><Button id="DegreeCourseManagementPageCreateDegreeCourseButton" variant="primary" onClick={handleNewDegreeCourseApplication}>Bewerbung anlegen</Button></span>
                </div>
                <ListGroup id="DegreeCourseApplicationManagementPageListComponent" horizontal>
                    {bewerbungen.map(bewerbung => (
                        <DegreeCourseApplicationComponent bewerbung={bewerbung} key={"DegreeCourseItem" + bewerbung.id} degreeCourseApplicationAktualisieren={getAllBewerbungen} /> //getAllStudiengaenge wird uebergeben, damit diese zum Aktualisieren der DegreeCourseListe aufgerufen werden kann
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