import { useMemo, useState } from 'react';
import { Drumstick, Leaf, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { TopNav } from '../components/TopNav';
import { CategoryBadge } from '../components/CategoryBadge';
import { CountdownTimer } from '../components/CountdownTimer';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { useAppState } from '../state/AppState';

export default function NGOFoodListPage() {
  const [sortBy, setSortBy] = useState('nearest');
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const { donations, profile, acceptDonation } = useAppState();

  const pendingPosts = useMemo(
    () =>
      donations.filter(
        (post) => post.status === 'pending' && !dismissedIds.includes(post.id),
      ),
    [dismissedIds, donations],
  );

  const sortedPosts = [...pendingPosts].sort((a, b) => {
    if (sortBy === 'nearest') {
      return (a.distance || 0) - (b.distance || 0);
    }

    const priority = { red: 3, yellow: 2, green: 1 };
    return priority[b.category] - priority[a.category];
  });

  const ngoName = profile.organization || 'Hope Foundation';

  const handleAccept = (postId: string) => {
    acceptDonation(postId, ngoName);
    toast.success('Food accepted and assigned for volunteer pickup.');
  };

  const handleDecline = (postId: string) => {
    setDismissedIds((current) => [...current, postId]);
    toast.info('Donation hidden from your NGO queue.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nearby Food Donations</h1>
          <p className="text-gray-600">Accept food donations from nearby donors</p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <span className="font-medium text-gray-700">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nearest">Nearest First</SelectItem>
                  <SelectItem value="priority">Highest Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.foodName}</h3>
                    <CategoryBadge category={post.category} />
                  </div>
                  <CountdownTimer targetTime={post.safeUntil} />
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    {post.isVeg ? (
                      <Leaf className="w-4 h-4 text-green-600" />
                    ) : (
                      <Drumstick className="w-4 h-4 text-red-600" />
                    )}
                    <span>{post.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {post.location} - {post.distance} km away
                    </span>
                  </div>

                  <div className="text-gray-600">
                    <span className="font-medium">Quantity:</span> {post.quantity}
                  </div>

                  <div className="text-gray-600">
                    <span className="font-medium">Donor:</span> {post.donorName}
                  </div>

                  <div className="text-gray-600">
                    <span className="font-medium">Cooked:</span>{' '}
                    {new Date(post.cookedTime).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleAccept(post.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    Accept
                  </Button>
                  <Button onClick={() => handleDecline(post.id)} variant="outline" className="flex-1">
                    Decline
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedPosts.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-600">No pending food donations at the moment</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
