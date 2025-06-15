import { useSelector } from "react-redux";
import type { RootState } from "../../components/RootStore";

// verwendete Quellen: Folien und Videos von den Vorlesungen

export function PrivatePage() {
    const user = useSelector(
        (state: RootState) => state.authentication.user
    )

    let name: string;
    if (user.userID !== null) {
        name = ", " + user.userID;
    }
    else {
        name = "";
    }
    return <div id="StartPage">
        <div id="teil1Private">
            <p className="ueberschrift">Hallo{name}!</p>
            <p className="text">Du kannst sofort anfangen dich für einen Studiengang zu bewerben.</p>
        </div>

    </div>;
}
