import { Component, type ChangeEvent, type MouseEvent} from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import { bindActionCreators, type Dispatch, type UnknownAction } from "redux";
import { authenticateUser, getHideLoginDialogAction, getShowLoginDialogAction, logout } from "./state/AuthenticationAction";

// verwendete Quellen: Folien und Videos von den Vorlesungen
// Quelle fuer Arrow Functions(dadurch wird this automatisch gebunden): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions

type Props = {
    showLoginDialog: boolean,
    showLoginDialogAction: () => void,
    hideLoginDialogAction: () => void,
    authenticateUser: (username:string, password: string) => void,
    logout: any
    authenticationReducer: any
};
type State = {username: string, password: string};

const mapStateToProps = (state: any) => {
    return state;
}

class UserSessionWidget extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = { 
            username: "",
            password: ""
        };
    }

    handleShow = (e: MouseEvent) => {
        e.preventDefault();
        this.props.showLoginDialogAction();
    }

    handleClose = () => {
        this.props.hideLoginDialogAction();
    }

    handleChange = (e: ChangeEvent) => {
        e.preventDefault(); //notwendig??, kann ggf weggelassen werden
        //const {name, value} = e.target.value;
        let t = e.target as HTMLInputElement;
        let name = t.name;
        let value = t.value;
        switch(name){
            case "userID":
                this.setState({"username": value});
                break;
            case "password":
                this.setState({"password": value});
                break;
            default:
                console.log("Error: Fehler beim Aendern von Login State in handleChange")
        }
    }

    handleSubmit = async (e: MouseEvent) => {
        e.preventDefault();
        const {username, password} = this.state;

        //Warnung ignorieren, await muss da stehen, geht sonst nicht richtig
        await this.props.authenticateUser(username, password); //eigentlich await, auf Fertigstellung muss hier aber nicht gewartet werden, mit zurueckgegebenen Wert wird ja eh nichts mehr gemacht
        if(this.props.authenticationReducer.user === null){
            this.setState({"username": "", "password": ""});
        }
    }

    handleLogout = () => {
        this.props.logout();
    }

    canLogin(): boolean {
        const {username, password} = this.state;
        if(password === "" || username === ""){
            return false;
        }
        else {
            return true;
        }
    }

    render() {
        let showDialog: boolean = this.props.authenticationReducer.showLoginDialog; //bestimmt, ob LoginDialog angezeigtw wird
        if (showDialog === undefined) {
            showDialog = false;
        }

        let errorText: string = this.props.authenticationReducer.error;
        let showError: boolean = false;
        if(errorText === "Authentication failed"){ //dann Fehler bei Login, falsche User ID/Password
            showError = true;
        }
        else {
            showError = false;
        }

        let pending: boolean = this.props.authenticationReducer.pending; //Ladesymbol wird dargestellt
        if(pending === undefined){
            pending = false;
        }
        
        let userIdForm;
        let paswordForm;
        if(pending){ //wenn pending kann in forms nicht mehr eingetragen werden
            userIdForm = <Form.Control id="LoginDialogUserIDText" type="text" placeholder="User ID" name="userID" onChange={this.handleChange} value={this.state.username} readOnly/>
            paswordForm= <Form.Control id="LoginDialogPasswordText" type="password" placeholder="Password" name="password" onChange={this.handleChange} value={this.state.password} readOnly/>
        }
        else {
            userIdForm = <Form.Control id="LoginDialogUserIDText" type="text" placeholder="User ID" name="userID" onChange={this.handleChange} value={this.state.username}/>
            paswordForm= <Form.Control id="LoginDialogPasswordText" type="password" placeholder="Password" name="password" onChange={this.handleChange} value={this.state.password}/>
        }

        let user = this.props.authenticationReducer.user
        let widget;
        if(user === null || user === undefined){ //wenn User eingeloggt ist soll anderes Widget dargestellt (kein Login Button)
            widget = <Button id="OpenLoginDialogButton" variant="primary" onClick={this.handleShow}>Login</Button>
        }
        else {
            widget = <Button id="LogoutButton" variant="primary" onClick={this.handleLogout}>Logout</Button>//TODO das noch aendern, sollte eigentlich icon sein
        }

        let performLoginButton;
        if(this.canLogin()){ //Login Button kann nur gedrueckt werden, wenn Felder nicht leer sind
            performLoginButton = <Button id="PerformLoginButton" variant="primary" type="submit" onClick={this.handleSubmit}>Login</Button>;
        }
        else{
            performLoginButton = <Button id="PerformLoginButton" variant="primary" type="submit" disabled>Login</Button>;
        }

        return <div>
            {widget}
            <Modal show={showDialog} id="LoginDialog" onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            {userIdForm}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            {paswordForm}
                        </Form.Group>
                        {showError && <div><Form.Label id="textLoginUngueltig" style={{color: "red"}}>User ID oder Password falsch</Form.Label><br /></div>}
                        {pending && <div><Spinner animation="border" variant="primary"/><br /></div>}
                        {performLoginButton}
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    }
}

const mapDispatchToProps = (dispatch: Dispatch<UnknownAction>) => bindActionCreators({
    showLoginDialogAction: getShowLoginDialogAction,
    hideLoginDialogAction: getHideLoginDialogAction,
    authenticateUser: authenticateUser,
    logout: logout
}, dispatch)

const ConnectedUserSessionWidget = connect(mapStateToProps, mapDispatchToProps)(UserSessionWidget);

export default ConnectedUserSessionWidget;