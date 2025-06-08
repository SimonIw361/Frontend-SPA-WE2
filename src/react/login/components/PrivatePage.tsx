import { useSelector } from "react-redux";
import type { RootState } from "../../RootStore";
import {jwtDecode} from "jwt-decode";


//jwt Decode (Payload aus Token bestimmen): https://www.npmjs.com/package/jwt-decode

export function PrivatePage() {
    const accessToken = useSelector(
        (state: RootState) =>  state.authentication.accessToken
    )
    let user = jwtDecode<{userID: string}>(accessToken); //TODO any aendern

    let name;
    if(user.userID !== undefined){
        name =", " + user.userID; 
    }
    else{
        name = ""
    }
    return <div id="StartPage">
        <div id="teil1Private">
            <p className="ueberschrift">Hallo{name}!</p>
            <p className="text">Du kannst sofort anfangen dich für einen Studiengang zu bewerben.</p>
        </div>
    </div>;
}
