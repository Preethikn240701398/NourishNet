import { TopNav } from '../components/TopNav';
import { Card, CardContent } from '../components/ui/card';
import { CategoryBadge } from '../components/CategoryBadge';
import { CheckCircle } from 'lucide-react';
import { useAppState } from '../state/AppState';

export default function HistoryPage() {
  const { donations } = useAppState();
  const completedDonations = donations.filter((p) => p.status === 'delivered');

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Donation History</h1>
          <p className="text-gray-600">View all completed donations</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {completedDonations.map((post) => (
            <Card key={post.id} className="border-green-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <h3 className="text-xl font-semibold text-gray-900">{post.foodName}</h3>
                      <CategoryBadge category={post.category} />
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                        Delivered
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Donor:</span> {post.donorName}
                      </div>
                      <div>
                        <span className="font-medium">Quantity:</span> {post.quantity}
                      </div>
                      <div>
                        <span className="font-medium">NGO:</span> {post.acceptedBy}
                      </div>
                      <div>
                        <span className="font-medium">Distance:</span> {post.distance} km
                      </div>
                      <div>
                        <span className="font-medium">Volunteer:</span> {post.volunteerId || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {completedDonations.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-600">No completed donations yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
