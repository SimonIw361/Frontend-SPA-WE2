import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { TopMenu } from "./TopMenu";
import { ActivityBar } from "./ActivityBar";
import { AppRoutes } from "../routes/AppRoutes";
import { store } from "./RootStore";

// verwendete Quellen: Folien und Videos von den Vorlesungen
// Quellen zu configureStore: https://redux.js.org/introduction/why-rtk-is-redux-today

const storeMain = store;

export function App() {
    return <BrowserRouter>
    <Provider store={storeMain}>
      <TopMenu />
      <div id="inhalt">
        <ActivityBar />
        <AppRoutes />
      </div>
    </Provider>
  </BrowserRouter>
}