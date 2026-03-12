import { TopNav } from '../components/TopNav';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TrendingUp, Users, Clock, Package } from 'lucide-react';
import { useAppState } from '../state/AppState';

export default function AnalyticsPage() {
  const { analytics } = useAppState();
  const stats = [
    {
      label: 'Total Food Saved',
      value: `${analytics.totalFoodSaved} kg`,
      icon: Package,
      color: 'text-green-600 bg-green-100',
    },
    {
      label: 'Meals Distributed',
      value: analytics.mealsDistributed.toLocaleString(),
      icon: Users,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      label: 'Avg Pickup Time',
      value: `${analytics.averagePickupTime} mins`,
      icon: Clock,
      color: 'text-purple-600 bg-purple-100',
    },
    {
      label: 'Active NGOs',
      value: analytics.activeNGOsByZone.reduce((sum, z) => sum + z.count, 0),
      icon: TrendingUp,
      color: 'text-orange-600 bg-orange-100',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Reports</h1>
          <p className="text-gray-600">Monitor your impact and track platform statistics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Distribution Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Category-wise Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.categoryDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {analytics.categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Active NGOs by Zone Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Active NGOs by Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.activeNGOsByZone}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="zone" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#22c55e" name="NGO Count" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Impact Summary */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Impact Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {analytics.totalFoodSaved} kg
                </div>
                <div className="text-gray-600">Food Saved from Waste</div>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {analytics.mealsDistributed.toLocaleString()}
                </div>
                <div className="text-gray-600">Meals Provided</div>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {analytics.activeNGOsByZone.reduce((sum, z) => sum + z.count, 0)}
                </div>
                <div className="text-gray-600">Partner NGOs</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
