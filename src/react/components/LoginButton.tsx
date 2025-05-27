import { Component } from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import { getShowLoginDialogAction } from "../actions/AuthenticationAction";


type Props = {
    dispatch: Function;
};

class LoginButton extends Component<Props> {

    constructor(props: Props) {
        super(props);
        this.showLoginDialog = this.showLoginDialog.bind(this);
    }

    showLoginDialog(){
        let dispatch = this.props.dispatch;
        dispatch(getShowLoginDialogAction());
    }

    render() {
        return <Button variant="light" onClick={this.showLoginDialog}>Login</Button>
    }
}

export default connect()(LoginButton)