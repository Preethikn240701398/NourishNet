export interface FoodPost {
  id: string;
  foodName: string;
  isVeg: boolean;
  quantity: string;
  category: 'red' | 'yellow' | 'green';
  cookedTime: string;
  safeUntil: string;
  location: string;
  donorName: string;
  distance?: number;
  status: 'pending' | 'accepted' | 'pickedup' | 'delivered';
  acceptedBy?: string;
  volunteerId?: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  organization: string;
}

export type UserRole = 'donor' | 'ngo' | 'volunteer';

export interface NGO {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
}

export interface Volunteer {
  id: string;
  name: string;
  phone: string;
}

const relativeDate = (hoursFromNow: number) => {
  const date = new Date();
  date.setHours(date.getHours() + hoursFromNow);
  return date.toISOString().slice(0, 16);
};

export const initialFoodPosts: FoodPost[] = [
  {
    id: '1',
    foodName: 'Fresh Biryani',
    isVeg: false,
    quantity: '50 servings',
    category: 'red',
    cookedTime: relativeDate(-1),
    safeUntil: relativeDate(2),
    location: 'Downtown Restaurant',
    donorName: 'Taj Restaurant',
    distance: 2.3,
    status: 'pending',
  },
  {
    id: '2',
    foodName: 'Packaged Snacks',
    isVeg: true,
    quantity: '100 packets',
    category: 'green',
    cookedTime: relativeDate(-6),
    safeUntil: relativeDate(36),
    location: 'Event Center',
    donorName: 'Tech Conference',
    distance: 5.8,
    status: 'accepted',
    acceptedBy: 'Hope Foundation',
  },
  {
    id: '3',
    foodName: 'Mixed Vegetables Curry',
    isVeg: true,
    quantity: '30 servings',
    category: 'yellow',
    cookedTime: relativeDate(-4),
    safeUntil: relativeDate(5),
    location: 'Wedding Hall',
    donorName: 'Grand Banquet',
    distance: 4.1,
    status: 'pickedup',
    acceptedBy: 'Serve India',
    volunteerId: 'V001',
  },
  {
    id: '4',
    foodName: 'Sandwiches & Wraps',
    isVeg: true,
    quantity: '40 pieces',
    category: 'red',
    cookedTime: relativeDate(-2),
    safeUntil: relativeDate(1),
    location: 'Corporate Office',
    donorName: 'Tech Corp',
    distance: 1.5,
    status: 'pending',
  },
];

export const initialNGOs: NGO[] = [
  { id: 'n1', name: 'Hope Foundation', location: 'Central District', lat: 28.6139, lng: 77.209 },
  { id: 'n2', name: 'Serve India', location: 'East Zone', lat: 28.6229, lng: 77.219 },
  { id: 'n3', name: 'Food Angels', location: 'West Block', lat: 28.6039, lng: 77.199 },
  { id: 'n4', name: 'Care & Share', location: 'North Area', lat: 28.6339, lng: 77.229 },
  { id: 'n5', name: 'Helping Hands', location: 'South District', lat: 28.5939, lng: 77.189 },
];

export const defaultProfile: UserProfile = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@email.com',
  phone: '+91 98765 43210',
  address: 'New Delhi, India',
  organization: 'FoodDonor Community',
};
