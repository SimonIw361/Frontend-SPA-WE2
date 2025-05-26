import { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { bindActionCreators, type Dispatch, type UnknownAction } from "redux";
import { getHideLoginDialogAction, getShowLoginDialogAction } from "../actions/AuthenticationAction";

type Props = {
    showLoginDialog: boolean,
    showLoginDialogAction: Function,
    hideLoginDialogAction: Function
};
type State = {show: boolean};

const mapStateToProps = (state: any) => {
    return state;
}

class UserSessionWidget extends Component<Props, State>  {
    

    constructor(props: Props){
        super(props);
        this.state = {show: false};
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleShow(e: React.MouseEvent){
        e.preventDefault();
        //this.setState({show: true});
        const {showLoginDialogAction} = this.props;
        showLoginDialogAction();
    }

    handleClose(){
        //this.setState({show: false});
        const {hideLoginDialogAction} = this.props;
        hideLoginDialogAction();
    }

    render() {

        let showDialog = this.props.showLoginDialog;
        if(showDialog === undefined){
            showDialog = false;
        }

        return <div>
            <Button variant="primary" onClick={this.handleShow}>
                Login
            </Button>

            <Modal show={showDialog} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={this.handleClose}>
                        Login
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    }
}

const mapDispatchToProps = (dispatch: Dispatch<UnknownAction>) => bindActionCreators({
    showLoginDialogAction: getShowLoginDialogAction,
    hideLoginDialogAction: getHideLoginDialogAction
}, dispatch)

const ConnectedUserSessionWidget = connect(mapStateToProps, mapDispatchToProps)(UserSessionWidget);

export default ConnectedUserSessionWidget;