import { TopNav } from '../components/TopNav';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useState } from 'react';
import { useAppState } from '../state/AppState';

export default function MapPage() {
  const [selectedCategory, setSelectedCategory] = useState<'red' | 'yellow' | 'green'>('red');
  const { ngos } = useAppState();

  // Center coordinates (e.g., Delhi)
  const centerLat = 28.6139;
  const centerLng = 77.209;

  const radiusConfig = {
    red: { radius: 2.5, color: 'rgba(239, 68, 68, 0.2)', borderColor: '#ef4444', km: '2-3 km' },
    yellow: { radius: 6, color: 'rgba(234, 179, 8, 0.2)', borderColor: '#eab308', km: '5-7 km' },
    green: { radius: 11.5, color: 'rgba(34, 197, 94, 0.2)', borderColor: '#22c55e', km: '8-15 km' },
  };

  const currentRadius = radiusConfig[selectedCategory];

  // Simple calculation to filter NGOs within radius (simplified for demo)
  const getNGOsInRadius = () => {
    return ngos.filter((ngo) => {
      const distance = Math.sqrt(
        Math.pow((ngo.lat - centerLat) * 111, 2) + Math.pow((ngo.lng - centerLng) * 111, 2)
      );
      return distance <= currentRadius.radius;
    });
  };

  const ngosInRadius = getNGOsInRadius();

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Radius Map Visualization</h1>
          <p className="text-gray-600">Dynamic matching based on food category and location</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Category Selection */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Select Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(radiusConfig).map(([category, config]) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category as 'red' | 'yellow' | 'green')}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    selectedCategory === category
                      ? `border-[${config.borderColor}] bg-opacity-20 ring-4`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{
                    backgroundColor: selectedCategory === category ? config.color : 'white',
                    borderColor: selectedCategory === category ? config.borderColor : undefined,
                    ringColor: selectedCategory === category ? config.color : undefined,
                  }}
                >
                  <div className="font-semibold capitalize">{category} Priority</div>
                  <div className="text-sm text-gray-600 mt-1">Radius: {config.km}</div>
                </button>
              ))}

              <div className="pt-4 border-t mt-4">
                <div className="text-sm font-medium text-gray-700 mb-2">NGOs in Radius:</div>
                <div className="text-2xl font-bold text-green-600">{ngosInRadius.length}</div>
              </div>
            </CardContent>
          </Card>

          {/* Map Visualization */}
          <Card className="lg:col-span-3">
            <CardContent className="p-6">
              <div className="relative w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden">
                {/* Simplified Map Visualization */}
                <svg className="w-full h-full">
                  {/* Draw radius circles */}
                  <circle
                    cx="50%"
                    cy="50%"
                    r={`${(currentRadius.radius / 15) * 40}%`}
                    fill={currentRadius.color}
                    stroke={currentRadius.borderColor}
                    strokeWidth="3"
                    strokeDasharray="10,5"
                  />

                  {/* Center marker (Donor) */}
                  <g transform="translate(50%, 50%)">
                    <circle cx="0" cy="0" r="8" fill="#dc2626" />
                    <circle cx="0" cy="0" r="12" fill="none" stroke="#dc2626" strokeWidth="2" />
                    <text x="0" y="-20" textAnchor="middle" className="text-xs font-semibold" fill="#dc2626">
                      Donor
                    </text>
                  </g>

                  {/* NGO markers */}
                  {ngosInRadius.map((ngo, index) => {
                    // Calculate position relative to center (simplified)
                    const angle = (index / ngosInRadius.length) * 2 * Math.PI;
                    const distance = Math.random() * currentRadius.radius * 3 + 10;
                    const x = 50 + Math.cos(angle) * distance;
                    const y = 50 + Math.sin(angle) * distance;

                    return (
                      <g key={ngo.id} transform={`translate(${x}%, ${y}%)`}>
                        <circle cx="0" cy="0" r="6" fill="#22c55e" />
                        <text
                          x="0"
                          y="20"
                          textAnchor="middle"
                          className="text-xs"
                          fill="#374151"
                        >
                          {ngo.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg border">
                  <div className="text-sm font-semibold mb-2">Legend</div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-600"></div>
                      <span>Donor Location</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-600"></div>
                      <span>NGO Location</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-0.5 border-t-2 border-dashed" style={{ borderColor: currentRadius.borderColor }}></div>
                      <span>Active Radius</span>
                    </div>
                  </div>
                </div>

                {/* Info Box */}
                <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg border">
                  <div className="text-sm font-semibold mb-2">Real-time Matching</div>
                  <div className="text-xs text-gray-600">
                    <div>Category: <span className="font-semibold capitalize">{selectedCategory}</span></div>
                    <div>Radius: <span className="font-semibold">{currentRadius.km}</span></div>
                    <div>Matched NGOs: <span className="font-semibold text-green-600">{ngosInRadius.length}</span></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
