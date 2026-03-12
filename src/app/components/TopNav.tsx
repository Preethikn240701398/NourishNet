import { Home, MapPin, History, Map as MapIcon, User } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useAppState } from '../state/AppState';

export function TopNav() {
  const location = useLocation();
  const { currentRole } = useAppState();

  const roleLabel = {
    donor: 'Donor',
    ngo: 'NGO',
    volunteer: 'Volunteer',
  }[currentRole];

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/active-donations', label: 'Active Donations', icon: MapPin },
    { path: '/history', label: 'History', icon: History },
    { path: '/map', label: 'Map', icon: MapIcon },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">FD</span>
            </div>
            <div>
              <div className="font-semibold text-lg leading-none">FoodDonor</div>
              <div className="text-xs text-gray-500">{roleLabel} workspace</div>
            </div>
          </div>
          
          <div className="flex gap-1">
            {navItems.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-green-50 text-green-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
