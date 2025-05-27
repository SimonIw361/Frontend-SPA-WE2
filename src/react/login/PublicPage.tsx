import { Component } from "react";
import  LoginButton  from "./components/LoginButton";


export class PublicPage extends Component {

    render() {
        return <div>
            Public Page
            <br />
            <br />
            <LoginButton />
        </div>;
    }
}