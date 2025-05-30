import { Component, type ChangeEvent, type MouseEvent} from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { bindActionCreators, type Dispatch, type UnknownAction } from "redux";
import { authenticateUser, getHideLoginDialogAction, getShowLoginDialogAction } from "./state/AuthenticationAction";

type Props = {
    showLoginDialog: boolean,
    showLoginDialogAction: () => void,
    hideLoginDialogAction: () => void,
    authenticateUser: (username:string, password: string) => void,
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
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        //setup();
    }

    // setup() {
    //     document.addEventListener("DOMContentLoaded", () => {
    //         let id = document.getElementById("LoginDialogUserIDText")?.addEventListener("change", (e) => {
    //             e.target.value
    //         })
    //     })
    // }

    handleShow(e: MouseEvent) {
        e.preventDefault();
        //this.setState({show: true});
        const { showLoginDialogAction } = this.props;
        showLoginDialogAction();
    }

    handleClose() {
        //this.setState({show: false});
        const { hideLoginDialogAction } = this.props;
        hideLoginDialogAction();
    }

    handleChange(e: ChangeEvent) {
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

    handleSubmit(e: MouseEvent) {
        e.preventDefault();
        const {username, password} = this.state;
        const {authenticateUser} = this.props;
        //console.log("handleSubmit" + username + " " + password)
        authenticateUser(username, password); //eigentlich await, auf Fertigstellung muss hier aber nicht gewartet werden, mit zurueckgegebenen Wert wird ja eh nichts mehr gemacht
    }

    render() {

        let showDialog = this.props.authenticationReducer.showLoginDialog;
        if (showDialog === undefined) {
            showDialog = false;
        }

        return <div>
            <Button variant="primary" onClick={this.handleShow}>
                Login
            </Button>

            <Modal show={showDialog} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>User ID</Form.Label>
                            <Form.Control id="LoginDialogUserIDText" type="text" placeholder="User ID" name="userID" onChange={this.handleChange}/>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control id="LoginDialogPasswordText" type="password" placeholder="Password" name="password" onChange={this.handleChange}/>
                        </Form.Group>
                        <Button id="PerformLoginButton" variant="primary" type="submit" onClick={this.handleSubmit}>Login</Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
        </div>
    }
}

const mapDispatchToProps = (dispatch: Dispatch<UnknownAction>) => bindActionCreators({
    showLoginDialogAction: getShowLoginDialogAction,
    hideLoginDialogAction: getHideLoginDialogAction,
    authenticateUser: authenticateUser
}, dispatch)

const ConnectedUserSessionWidget = connect(mapStateToProps, mapDispatchToProps)(UserSessionWidget);

export default ConnectedUserSessionWidget;