import { CheckCircle, MapPin, Navigation } from 'lucide-react';
import { toast } from 'sonner';
import { TopNav } from '../components/TopNav';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { useAppState } from '../state/AppState';

export default function VolunteerPickupPage() {
  const { donations, updateDonationStatus } = useAppState();
  const assignedPickup = donations.find(
    (post) => post.status === 'accepted' || post.status === 'pickedup',
  );

  if (!assignedPickup) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopNav />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-600 text-lg">No pickups assigned at the moment</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentStatus = assignedPickup.status === 'pickedup' ? 'pickedup' : 'assigned';
  const statusSteps = [
    { id: 'assigned', label: 'Assigned', progress: 0 },
    { id: 'pickedup', label: 'Picked Up', progress: 50 },
    { id: 'delivered', label: 'Delivered', progress: 100 },
  ];
  const currentStepIndex =
    assignedPickup.status === 'delivered'
      ? 2
      : statusSteps.findIndex((step) => step.id === currentStatus);
  const progressValue = statusSteps[currentStepIndex].progress;

  const handleConfirmPickup = () => {
    updateDonationStatus(assignedPickup.id, 'pickedup');
    toast.success('Pickup confirmed. Head to the NGO delivery point.');
  };

  const handleConfirmDelivery = () => {
    updateDonationStatus(assignedPickup.id, 'delivered');
    toast.success('Delivery completed successfully.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Volunteer Pickup</h1>
          <p className="text-gray-600">Manage your assigned pickup and delivery</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Delivery Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={progressValue} className="h-3" />
              <div className="flex justify-between">
                {statusSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center ${
                      index <= currentStepIndex ? 'text-green-600' : 'text-gray-400'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                        index <= currentStepIndex ? 'bg-green-600 text-white' : 'bg-gray-200'
                      }`}
                    >
                      {index < currentStepIndex ? <CheckCircle className="w-5 h-5" /> : index + 1}
                    </div>
                    <span className="text-sm font-medium">{step.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-600" />
                Pickup Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600">Donor</div>
                  <div className="font-semibold">{assignedPickup.donorName}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Address</div>
                  <div className="font-semibold">{assignedPickup.location}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Food Item</div>
                  <div className="font-semibold">{assignedPickup.foodName}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Quantity</div>
                  <div className="font-semibold">{assignedPickup.quantity}</div>
                </div>
                <Button className="w-full" variant="outline">
                  <Navigation className="w-4 h-4 mr-2" />
                  Open in Maps
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" />
                Delivery Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600">NGO</div>
                  <div className="font-semibold">{assignedPickup.acceptedBy}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Address</div>
                  <div className="font-semibold">Central District Office</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Contact</div>
                  <div className="font-semibold">+91 98765 43210</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Estimated Distance</div>
                  <div className="font-semibold">{assignedPickup.distance} km</div>
                </div>
                <Button className="w-full" variant="outline">
                  <Navigation className="w-4 h-4 mr-2" />
                  Open in Maps
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex gap-4">
              {assignedPickup.status === 'accepted' && (
                <Button
                  onClick={handleConfirmPickup}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                >
                  Confirm Pickup
                </Button>
              )}
              {assignedPickup.status === 'pickedup' && (
                <Button
                  onClick={handleConfirmDelivery}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                >
                  Confirm Delivery
                </Button>
              )}
              {assignedPickup.status === 'delivered' && (
                <div className="flex-1 text-center">
                  <div className="text-green-600 text-lg font-semibold mb-2">
                    Delivery completed successfully.
                  </div>
                  <p className="text-gray-600">Thank you for your service.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
