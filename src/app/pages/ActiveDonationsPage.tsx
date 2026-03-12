import { TopNav } from '../components/TopNav';
import { Card, CardContent } from '../components/ui/card';
import { CategoryBadge } from '../components/CategoryBadge';
import { useAppState } from '../state/AppState';

export default function ActiveDonationsPage() {
  const { donations } = useAppState();
  const activeDonations = donations.filter(
    (p) => p.status === 'accepted' || p.status === 'pickedup'
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Active Donations</h1>
          <p className="text-gray-600">View all donations currently in progress</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {activeDonations.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">{post.foodName}</h3>
                      <CategoryBadge category={post.category} />
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                          post.status === 'pickedup'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {post.status}
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
                        <span className="font-medium">Location:</span> {post.location}
                      </div>
                      <div>
                        <span className="font-medium">NGO:</span> {post.acceptedBy}
                      </div>
                      <div>
                        <span className="font-medium">Distance:</span> {post.distance} km
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {activeDonations.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-600">No active donations at the moment</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
