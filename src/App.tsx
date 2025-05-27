//import { Component} from 'react' //useState
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { Component } from 'react'
import './App.css'
import { PublicPage } from './react/components/PublicPage'
import { PrivatePage } from './react/components/PrivatePage'
import { TopMenu } from './react/components/TopMenu'
import { connect } from 'react-redux'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

type Props = {
  user: any
}

const mapStateToProps = (state: any) => {
  return state;
}



//export function App(){
class App extends Component<Props> {
  render() {

    const user = this.props.user;

    let workspace;
    if(user){
      workspace = <PrivatePage />
    }
    else {
      workspace = <PublicPage />
    }

    return(
      <div id="LandingPage">
        <TopMenu />
        {workspace}
      </div>
    )
  }
  
}

export default connect(mapStateToProps)(App);
