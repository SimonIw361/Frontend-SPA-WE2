import type { RootState } from '../../components/RootStore'
import { PrivatePage } from '../components/PrivatePage';
import { PublicPage } from '../components/PublicPage';
import { useSelector } from 'react-redux';

// verwendete Quellen: Folien und Videos von den Vorlesungen

export function LandingPage() {
    const user = useSelector((state: RootState) => state.authentication.user);
    
    if (user.userID) {
        return <PrivatePage />;
    }
    else {
        return <PublicPage />;
    }
}
