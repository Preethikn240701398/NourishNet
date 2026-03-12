import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  defaultProfile,
  initialFoodPosts,
  initialNGOs,
  type FoodPost,
  type NGO,
  type UserProfile,
  type UserRole,
} from '../data/mockData';

interface NotificationItem {
  id: string;
  message: string;
  time: string;
  type: 'urgent' | 'warning' | 'success';
}

interface AppStateValue {
  donations: FoodPost[];
  ngos: NGO[];
  profile: UserProfile;
  currentRole: UserRole;
  notifications: NotificationItem[];
  stats: {
    totalDonationsToday: number;
    activePickups: number;
    completedDeliveries: number;
    highPriorityAlerts: number;
  };
  analytics: {
    totalFoodSaved: number;
    mealsDistributed: number;
    averagePickupTime: number;
    categoryDistribution: Array<{ name: string; value: number; fill: string }>;
    activeNGOsByZone: Array<{ zone: string; count: number }>;
  };
  setCurrentRole: (role: UserRole) => void;
  saveProfile: (profile: UserProfile) => void;
  addDonation: (donation: Omit<FoodPost, 'id' | 'donorName' | 'status' | 'distance'>) => FoodPost;
  acceptDonation: (id: string, ngoName: string) => void;
  updateDonationStatus: (id: string, status: FoodPost['status']) => void;
}

const STORAGE_KEY = 'nourish-net-state-v1';

const AppStateContext = createContext<AppStateValue | null>(null);

function timeAgo(dateString: string) {
  const diffMinutes = Math.max(0, Math.round((Date.now() - new Date(dateString).getTime()) / 60000));
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  const hours = Math.floor(diffMinutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.floor(hours / 24)} day ago`;
}

function inferZone(address: string) {
  const value = address.toLowerCase();
  if (value.includes('north')) return 'North';
  if (value.includes('south')) return 'South';
  if (value.includes('east')) return 'East';
  if (value.includes('west')) return 'West';
  return 'Central';
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [donations, setDonations] = useState<FoodPost[]>(initialFoodPosts);
  const [ngos] = useState<NGO[]>(initialNGOs);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [currentRole, setCurrentRole] = useState<UserRole>('donor');

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as {
        donations?: FoodPost[];
        profile?: UserProfile;
        currentRole?: UserRole;
      };

      if (parsed.donations) {
        setDonations(parsed.donations);
      }
      if (parsed.profile) {
        setProfile(parsed.profile);
      }
      if (parsed.currentRole) {
        setCurrentRole(parsed.currentRole);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ donations, profile, currentRole }),
    );
  }, [donations, profile, currentRole]);

  const notifications = useMemo<NotificationItem[]>(() => {
    return [...donations]
      .sort((a, b) => new Date(b.cookedTime).getTime() - new Date(a.cookedTime).getTime())
      .slice(0, 4)
      .map((donation) => {
        const urgent =
          donation.category === 'red' && donation.status === 'pending';
        const type =
          donation.status === 'delivered'
            ? 'success'
            : urgent
            ? 'urgent'
            : 'warning';

        let message = `${donation.foodName} is pending review`;
        if (donation.status === 'accepted') {
          message = `${donation.foodName} accepted by ${donation.acceptedBy}`;
        } else if (donation.status === 'pickedup') {
          message = `${donation.foodName} picked up by volunteer`;
        } else if (donation.status === 'delivered') {
          message = `${donation.foodName} delivered successfully`;
        }

        return {
          id: donation.id,
          message,
          time: timeAgo(donation.cookedTime),
          type,
        };
      });
  }, [donations]);

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    return {
      totalDonationsToday: donations.filter(
        (donation) => new Date(donation.cookedTime).toDateString() === today,
      ).length,
      activePickups: donations.filter(
        (donation) => donation.status === 'accepted' || donation.status === 'pickedup',
      ).length,
      completedDeliveries: donations.filter((donation) => donation.status === 'delivered')
        .length,
      highPriorityAlerts: donations.filter(
        (donation) => donation.category === 'red' && donation.status === 'pending',
      ).length,
    };
  }, [donations]);

  const analytics = useMemo(() => {
    const categoryCounts = {
      red: donations.filter((donation) => donation.category === 'red').length,
      yellow: donations.filter((donation) => donation.category === 'yellow').length,
      green: donations.filter((donation) => donation.category === 'green').length,
    };
    const total = Math.max(donations.length, 1);
    const zoneCounts = ngos.reduce<Record<string, number>>((acc, ngo) => {
      const zone = inferZone(ngo.location);
      acc[zone] = (acc[zone] ?? 0) + 1;
      return acc;
    }, {});

    return {
      totalFoodSaved: donations.length * 18,
      mealsDistributed: donations.reduce((sum, donation) => {
        const numericPart = Number.parseInt(donation.quantity, 10);
        return sum + (Number.isNaN(numericPart) ? 20 : numericPart);
      }, 0),
      averagePickupTime: donations.length ? 32 : 0,
      categoryDistribution: [
        { name: 'High Priority', value: Math.round((categoryCounts.red / total) * 100), fill: '#ef4444' },
        { name: 'Medium Priority', value: Math.round((categoryCounts.yellow / total) * 100), fill: '#eab308' },
        { name: 'Low Priority', value: Math.round((categoryCounts.green / total) * 100), fill: '#22c55e' },
      ],
      activeNGOsByZone: Object.entries(zoneCounts).map(([zone, count]) => ({ zone, count })),
    };
  }, [donations, ngos]);

  const saveProfile = (nextProfile: UserProfile) => {
    const previousDonorLabel =
      profile.organization || `${profile.firstName} ${profile.lastName}`.trim();
    const nextDonorLabel =
      nextProfile.organization || `${nextProfile.firstName} ${nextProfile.lastName}`.trim();

    setDonations((current) =>
      current.map((donation) =>
        donation.donorName === previousDonorLabel
          ? {
              ...donation,
              donorName: nextDonorLabel,
            }
          : donation,
      ),
    );
    setProfile(nextProfile);
  };

  const addDonation: AppStateValue['addDonation'] = (donation) => {
    const created: FoodPost = {
      ...donation,
      id: crypto.randomUUID(),
      donorName: profile.organization || `${profile.firstName} ${profile.lastName}`.trim(),
      status: 'pending',
      distance: Number((Math.random() * 8 + 1).toFixed(1)),
    };

    setDonations((current) => [created, ...current]);
    return created;
  };

  const acceptDonation = (id: string, ngoName: string) => {
    setDonations((current) =>
      current.map((donation) =>
        donation.id === id
          ? {
              ...donation,
              status: 'accepted',
              acceptedBy: ngoName,
              volunteerId: 'V001',
            }
          : donation,
      ),
    );
  };

  const updateDonationStatus = (id: string, status: FoodPost['status']) => {
    setDonations((current) =>
      current.map((donation) =>
        donation.id === id
          ? {
              ...donation,
              status,
            }
          : donation,
      ),
    );
  };

  const value = {
    donations,
    ngos,
    profile,
    currentRole,
    notifications,
    stats,
    analytics,
    setCurrentRole,
    saveProfile,
    addDonation,
    acceptDonation,
    updateDonationStatus,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const value = useContext(AppStateContext);
  if (!value) {
    throw new Error('useAppState must be used within AppStateProvider');
  }

  return value;
}
