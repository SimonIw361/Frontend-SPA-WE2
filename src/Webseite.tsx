//import { Component} from 'react' //useState
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { Component } from 'react'
import './App.css'
import { PublicPage } from './react/login/PublicPage'
import { PrivatePage } from './react/user/PrivatePage'
import { TopMenu } from './react/TopMenu'
import { connect} from 'react-redux'

type Props = {
  user?: any,
  authenticationReducer?: any
}

const mapStateToProps = (state: any) => {
  return state;
}

class Webseite extends Component<Props> {
  render() {

    const user = this.props.authenticationReducer.user;

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

export default connect(mapStateToProps)(Webseite);
