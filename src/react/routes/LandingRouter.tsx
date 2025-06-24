import type { RootState } from '../../RootStore'
import { PrivatePage } from '../login/components/PrivatePage';
import { PublicPage } from '../login/components/PublicPage';
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
