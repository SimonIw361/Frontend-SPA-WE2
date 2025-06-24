import { Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { LoginButton } from "../login/components/LoginButton"

export function UeberUns(){
    return <div id="ueberuns">
        <div className="ueberschrift">Über Uns</div>
        <div className="text">Die BHT ist eine sehr bekannte Hochschule in Berlin.</div>
    </div>;
}

export function Kontakt(){
    return <div id="kontakt">
        <div className="ueberschrift">Kontakt</div>
        <div className="text">Sie haben Fragen?<br /> Schreiben Sie gerne an siiw1213@bht-berlin.de</div>
    </div>;
}

export function Impressum(){
    return <div id="impressum">
        <div className="ueberschrift">Impressum</div>
        <div className="text">BHT - Berliner Hochschule für Technik</div>
    </div>;
}

export function PageNotFound(){
    const navigate = useNavigate();

    return <div id="pagenotfound">
        <div className="ueberschrift">404 Page Not Found</div>
        <div className="text">Diese Seite existiert nicht.</div>
        <Button id="404Startseite" variant="secondary" onClick={() => navigate("/")} style={{marginTop: "20px"}}>Startseite</Button>
    </div>;

}

export function Unauthorized(){
    return <div id="unauthorized">
        <div className="ueberschrift">401 Unauthorized</div>
        <div className="text">Ihre Session ist abgelaufen. Bitte loggen Sie sich erneut ein.</div>
        <LoginButton />
    </div>;
}