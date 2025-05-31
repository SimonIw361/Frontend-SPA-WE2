import { Component } from "react";
import  LoginButton  from "./components/LoginButton";


export class PublicPage extends Component {

    render() {
        return <div id="LandingPage">
            Public Page
            <br />
            Diesen Bereich kann jeder sehen.
            <br />
            <LoginButton />
        </div>;
    }
}