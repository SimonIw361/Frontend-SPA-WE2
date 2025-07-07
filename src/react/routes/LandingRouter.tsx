import type { RootState } from '../../RootStore'
import { PrivatePage } from '../login/components/PrivatePage';
import { PublicPage } from '../login/components/PublicPage';
import { useSelector } from 'react-redux';

export function LandingPage() {
    const user = useSelector((state: RootState) => state.authentication.user);
    
    if (user.userID) {
        return <PrivatePage />;
    }
    else {
        return <PublicPage />;
    }
}
