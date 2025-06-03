import { Component } from "react";
import { Button } from "react-bootstrap";
import { connect, type ConnectedProps } from "react-redux";
import { getShowLoginDialogAction } from "../state/AuthenticationAction";

// verwendete Quellen: Folien und Videos von den Vorlesungen
// Quelle zur Definition von Props Typ: https://react-redux.js.org/using-react-redux/usage-with-typescript

interface Props extends PropsFromRedux {
}

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
        return <Button variant="primary" onClick={this.showLoginDialog}>Login</Button>
    }
}

const connector = connect();

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(LoginButton);