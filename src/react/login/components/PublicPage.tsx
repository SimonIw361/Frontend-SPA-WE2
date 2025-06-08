import { LoginButton } from "./LoginButton";

export function PublicPage() {
    return <div id="LandingPage">
        <div id="teil1Public">
            <p className="ueberschrift">Studieren an der BHT Berlin</p>
            <p className="text">Die Webseite um sich für alle Studiengänge an der BHT zu bewerben. Es gibt eine große Auswahl an Studiengaengen.</p>
            <LoginButton />
        </div>
        <div id="teil2Public">
            <p className="ueberschrift">Die Webseite der BHT</p>
            <p>Loggen Sie sich ein, um Bewerbungen für Studiengänge anzulegen und zu bearbeiten.</p>
        </div>
    </div>;
}