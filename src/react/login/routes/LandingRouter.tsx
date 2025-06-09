import type { RootState } from '../../RootStore'
import { PrivatePage } from '../components/PrivatePage';
import { PublicPage } from '../components/PublicPage';
import { useSelector } from 'react-redux';

// verwendete Quellen: Folien und Videos von den Vorlesungen

export function LandingPage() {
    const user = useSelector((state: RootState) => state.authentication.user);
    let workspace;
    if (user) {
        workspace = <PrivatePage />
    }
    else {
        workspace = <PublicPage />
    }

    return <div>{workspace}</div>
    //return <Routes><Route path="/" element={<LandingPage />}></Route></Routes>
}
