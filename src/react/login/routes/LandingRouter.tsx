import type { RootState } from '../../RootStore'
import { PrivatePage } from '../components/PrivatePage';
import { PublicPage } from '../components/PublicPage';
import { useSelector } from 'react-redux';


// verwendete Quellen: Folien und Videos von den Vorlesungen
// Quelle zur Definition von Props Typ: https://react-redux.js.org/using-react-redux/usage-with-typescript

export function LandingPage() {
    const user = useSelector((state: RootState) => state.authentication.user);
    let workspace;
    if (user) {
        workspace = <div><PrivatePage /></div>
    }
    else {
        workspace = <div><PublicPage /></div>
    }

    return <div style={{textAlign: "center"}}>{workspace}</div>
}
