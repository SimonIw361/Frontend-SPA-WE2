import { Component } from 'react'
import './App.css'
import { PublicPage } from './react/login/PublicPage'
import { PrivatePage } from './react/user/PrivatePage'
import { TopMenu } from './react/TopMenu'
import { connect, type ConnectedProps} from 'react-redux'
import type { RootState } from './react/store'

// verwendete Quellen: Folien und Videos von den Vorlesungen
// Quelle zur Definition von Props Typ: https://react-redux.js.org/using-react-redux/usage-with-typescript
//evtl noch zu Funktionskomponente machen??

interface Props extends PropsFromRedux {
}

const mapStateToProps = (state: RootState) => ({
  authentication: state.authentication
})

class Webseite extends Component<Props> {
  render() {

    const user = this.props.authentication.user;

    let workspace;
    if (user) {
      workspace = <PrivatePage />
    }
    else {
      workspace = <PublicPage />
    }

    return (
      <div id="LandingPage">
        <TopMenu />
        {workspace}
      </div>
    )
  }

}
const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Webseite);
