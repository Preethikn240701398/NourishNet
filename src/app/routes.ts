import { createBrowserRouter } from 'react-router';
import HomePage from './pages/HomePage';
import RoleSelectionPage from './pages/RoleSelectionPage';
import DonorDashboardPage from './pages/DonorDashboardPage';
import PostFoodPage from './pages/PostFoodPage';
import NGOFoodListPage from './pages/NGOFoodListPage';
import MapPage from './pages/MapPage';
import VolunteerPickupPage from './pages/VolunteerPickupPage';
import TrackingPage from './pages/TrackingPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ActiveDonationsPage from './pages/ActiveDonationsPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: HomePage,
  },
  {
    path: '/role-selection',
    Component: RoleSelectionPage,
  },
  {
    path: '/donor-dashboard',
    Component: DonorDashboardPage,
  },
  {
    path: '/post-food',
    Component: PostFoodPage,
  },
  {
    path: '/ngo-food-list',
    Component: NGOFoodListPage,
  },
  {
    path: '/map',
    Component: MapPage,
  },
  {
    path: '/volunteer-pickup',
    Component: VolunteerPickupPage,
  },
  {
    path: '/tracking/:id',
    Component: TrackingPage,
  },
  {
    path: '/analytics',
    Component: AnalyticsPage,
  },
  {
    path: '/active-donations',
    Component: ActiveDonationsPage,
  },
  {
    path: '/history',
    Component: HistoryPage,
  },
  {
    path: '/profile',
    Component: ProfilePage,
  },
]);
