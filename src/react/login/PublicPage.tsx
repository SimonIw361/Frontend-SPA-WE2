import  LoginButton  from "./components/LoginButton";

export function PublicPage(){
    return <div id="LandingPage">
            Public Page
            <br />
            Diesen Bereich kann jeder sehen.
            <br />
            <LoginButton />
        </div>;
}