import React, { useState } from 'react';
import { AlertTriangle, Recycle, Users, ArrowLeft, BarChart3, Award, User, UserCheck, Trash2, MapPin, Navigation, Clock } from 'lucide-react';

// User data interface
interface UserData {
  id: string;
  name: string;
  points: number;
  wasteHistory: {
    date: string;
    type: 'biodegradable' | 'non-biodegradable' | 'hazardous';
    weight: number;
    pointsEarned: number;
  }[];
}

// Bin location interface
interface BinLocation {
  id: string;
  name: string;
  address: string;
  status: 'empty' | 'filling' | 'full';
  lastEmptied: string;
  wasteType: 'biodegradable' | 'non-biodegradable' | 'hazardous' | 'mixed';
  coordinates: {
    lat: number;
    lng: number;
  };
  estimatedTimeToFill: number; // in hours
}

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'user' | 'corporation'>('landing');
  const [alerts, setAlerts] = useState<string[]>([]);
  const [userPoints, setUserPoints] = useState<number>(120);
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [showRouteOptimization, setShowRouteOptimization] = useState<boolean>(false);
  const [optimizedRoute, setOptimizedRoute] = useState<BinLocation[]>([]);

  // Sample user data
  const [usersData, setUsersData] = useState<UserData[]>([
    {
      id: 'user-a',
      name: 'User A',
      points: 120,
      wasteHistory: [
        { date: '2025-01-15', type: 'biodegradable', weight: 5.2, pointsEarned: 26 },
        { date: '2025-01-22', type: 'non-biodegradable', weight: 3.8, pointsEarned: 38 },
        { date: '2025-02-05', type: 'biodegradable', weight: 4.5, pointsEarned: 22 },
        { date: '2025-02-18', type: 'hazardous', weight: 1.2, pointsEarned: 34 }
      ]
    },
    {
      id: 'user-b',
      name: 'User B',
      points: 85,
      wasteHistory: [
        { date: '2025-01-10', type: 'non-biodegradable', weight: 2.7, pointsEarned: 27 },
        { date: '2025-01-25', type: 'biodegradable', weight: 6.1, pointsEarned: 30 },
        { date: '2025-02-08', type: 'hazardous', weight: 0.8, pointsEarned: 28 }
      ]
    },
    {
      id: 'user-c',
      name: 'User C',
      points: 210,
      wasteHistory: [
        { date: '2025-01-05', type: 'biodegradable', weight: 8.3, pointsEarned: 41 },
        { date: '2025-01-18', type: 'non-biodegradable', weight: 4.2, pointsEarned: 42 },
        { date: '2025-01-30', type: 'biodegradable', weight: 7.5, pointsEarned: 37 },
        { date: '2025-02-12', type: 'non-biodegradable', weight: 3.9, pointsEarned: 39 },
        { date: '2025-02-25', type: 'hazardous', weight: 1.8, pointsEarned: 51 }
      ]
    }
  ]);

  // Sample bin locations
  const [binLocations, setBinLocations] = useState<BinLocation[]>([
    {
      id: 'bin-1',
      name: 'Downtown Bin 1',
      address: '123 Main St, Downtown',
      status: 'full',
      lastEmptied: '2025-02-20',
      wasteType: 'mixed',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      estimatedTimeToFill: 0
    },
    {
      id: 'bin-2',
      name: 'Residential Area Bin 3',
      address: '456 Oak Ave, Residential District',
      status: 'full',
      lastEmptied: '2025-02-22',
      wasteType: 'biodegradable',
      coordinates: { lat: 40.7282, lng: -73.9942 },
      estimatedTimeToFill: 0
    },
    {
      id: 'bin-3',
      name: 'Business District Bin 2',
      address: '789 Commerce Blvd, Business District',
      status: 'filling',
      lastEmptied: '2025-02-23',
      wasteType: 'non-biodegradable',
      coordinates: { lat: 40.7112, lng: -74.0123 },
      estimatedTimeToFill: 12
    },
    {
      id: 'bin-4',
      name: 'Park Area Bin 5',
      address: '321 Park Lane, Central Park',
      status: 'filling',
      lastEmptied: '2025-02-21',
      wasteType: 'biodegradable',
      coordinates: { lat: 40.7831, lng: -73.9712 },
      estimatedTimeToFill: 24
    },
    {
      id: 'bin-5',
      name: 'School Zone Bin 4',
      address: '654 Education St, School District',
      status: 'full',
      lastEmptied: '2025-02-19',
      wasteType: 'mixed',
      coordinates: { lat: 40.7489, lng: -73.9680 },
      estimatedTimeToFill: 0
    },
    {
      id: 'bin-6',
      name: 'Shopping Mall Bin 7',
      address: '987 Retail Ave, Shopping District',
      status: 'filling',
      lastEmptied: '2025-02-22',
      wasteType: 'non-biodegradable',
      coordinates: { lat: 40.7549, lng: -73.9840 },
      estimatedTimeToFill: 8
    }
  ]);

  const showPage = (type: 'landing' | 'user' | 'corporation') => {
    setCurrentView(type);
  };

  const goBack = () => {
    showPage('landing');
  };

  const sendAlert = (message: string) => {
    setAlerts([...alerts, message]);
   
    // Update a random bin to full status when an alert is sent
    if (message.includes('Bin is full')) {
      const updatedBins = [...binLocations];
      const randomIndex = Math.floor(Math.random() * updatedBins.length);
     
      if (updatedBins[randomIndex].status !== 'full') {
        updatedBins[randomIndex] = {
          ...updatedBins[randomIndex],
          status: 'full',
          estimatedTimeToFill: 0
        };
        setBinLocations(updatedBins);
      }
    }
  };

  const recycleWaste = (type: 'biodegradable' | 'non-biodegradable' | 'hazardous', weight: number) => {
    // Calculate points based on waste type and weight
    let pointsEarned = 0;
   
    switch(type) {
      case 'biodegradable':
        pointsEarned = Math.round(weight * 5); // 5 points per kg
        break;
      case 'non-biodegradable':
        pointsEarned = Math.round(weight * 10); // 10 points per kg
        break;
      case 'hazardous':
        pointsEarned = Math.round(weight * 25); // 25 points per kg
        break;
    }
   
    // Update user points
    const newPoints = userPoints + pointsEarned;
    setUserPoints(newPoints);
   
    // Update the first user's data (assuming current user is User A)
    const updatedUsers = [...usersData];
    const userIndex = 0; // User A
   
    updatedUsers[userIndex] = {
      ...updatedUsers[userIndex],
      points: updatedUsers[userIndex].points + pointsEarned,
      wasteHistory: [
        ...updatedUsers[userIndex].wasteHistory,
        {
          date: new Date().toISOString().split('T')[0],
          type,
          weight,
          pointsEarned
        }
      ]
    };
   
    setUsersData(updatedUsers);
   
    // Show confirmation message
    sendAlert(`Successfully recycled ${weight}kg of ${type} waste. Earned ${pointsEarned} points!`);
  };

  const optimizeRoute = () => {
    // Filter only full bins
    const fullBins = binLocations.filter(bin => bin.status === 'full');
   
    // Simple optimization algorithm (in a real app, this would use a proper routing algorithm)
    // For this demo, we'll just sort by most recently filled (assuming those are most urgent)
    const sortedBins = [...fullBins].sort((a, b) => {
      return new Date(b.lastEmptied).getTime() - new Date(a.lastEmptied).getTime();
    });
   
    setOptimizedRoute(sortedBins);
    setShowRouteOptimization(true);
  };

  const emptyBin = (binId: string) => {
    // Update bin status to empty
    const updatedBins = binLocations.map(bin => {
      if (bin.id === binId) {
        return {
          ...bin,
          status: 'empty' as const,
          lastEmptied: new Date().toISOString().split('T')[0],
          estimatedTimeToFill: Math.floor(Math.random() * 48) + 24 // Random time between 24-72 hours
        };
      }
      return bin;
    });
   
    setBinLocations(updatedBins);
   
    // Update optimized route by removing the emptied bin
    const updatedRoute = optimizedRoute.filter(bin => bin.id !== binId);
    setOptimizedRoute(updatedRoute);
   
    // If all bins in route are emptied, hide the route optimization view
    if (updatedRoute.length === 0) {
      setShowRouteOptimization(false);
    }
   
    // Show confirmation
    sendAlert(`Bin ${binId} has been emptied successfully!`);
  };

  return (
    <div className="min-h-screen w-full">
      {/* Landing Page */}
      {currentView === 'landing' && (
        <div
          className="min-h-screen flex flex-col items-center justify-center p-4 text-white"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: 'rgba(0,0,0,0.7)',
            backgroundBlendMode: 'overlay'
          }}
        >
          <div className="max-w-3xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-8">Welcome to Smart Waste Management</h1>
            <p className="text-xl mb-8">Helping communities manage waste efficiently and sustainably</p>
           
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => showPage('user')}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Users size={24} />
                I am a User
              </button>
              <button
                onClick={() => showPage('corporation')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Recycle size={24} />
                I am a Waste Management Team
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Section */}
      {currentView === 'user' && (
        <div className="min-h-screen flex flex-col items-center p-4">
          <div
            className="w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden"
            style={{
              backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url("https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800">User Dashboard</h2>
                <button
                  onClick={goBack}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <ArrowLeft size={18} />
                  Back
                </button>
              </div>
             
              {/* Reward Points Section */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-lg shadow-md mb-8 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                      <Award size={24} />
                      Recycling Rewards
                    </h3>
                    <p className="opacity-90">Earn points by recycling waste properly</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{userPoints}</div>
                    <div className="text-sm opacity-90">Total Points</div>
                  </div>
                </div>
              </div>
             
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">Report Issues</h3>
                  <div className="space-y-4">
                    <button
                      onClick={() => sendAlert('Bin is full!')}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <AlertTriangle size={20} />
                      Notify Bin Full
                    </button>
                    <button
                      onClick={() => sendAlert('Waste dumped improperly!')}
                      className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <AlertTriangle size={20} />
                      Report Illegal Dumping
                    </button>
                  </div>
                </div>
               
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">Waste Management Tips</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>Separate recyclables from general waste</li>
                    <li>Compost food scraps when possible</li>
                    <li>Reduce single-use plastics</li>
                    <li>Properly dispose of hazardous materials</li>
                    <li>Report overflowing bins promptly</li>
                  </ul>
                </div>
              </div>
             
              {/* Recycle Waste Section */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Recycle Waste & Earn Points</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-800 mb-2">Biodegradable</h4>
                    <p className="text-sm text-gray-600 mb-3">5 points per kg</p>
                    <button
                      onClick={() => recycleWaste('biodegradable', 5.0)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2"
                    >
                      <Recycle size={16} />
                      Recycle (5kg)
                    </button>
                  </div>
                 
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-medium text-yellow-800 mb-2">Non-Biodegradable</h4>
                    <p className="text-sm text-gray-600 mb-3">10 points per kg</p>
                    <button
                      onClick={() => recycleWaste('non-biodegradable', 3.5)}
                      className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2"
                    >
                      <Recycle size={16} />
                      Recycle (3.5kg)
                    </button>
                  </div>
                 
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-medium text-red-800 mb-2">Hazardous</h4>
                    <p className="text-sm text-gray-600 mb-3">25 points per kg</p>
                    <button
                      onClick={() => recycleWaste('hazardous', 1.0)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2"
                    >
                      <Recycle size={16} />
                      Recycle (1kg)
                    </button>
                  </div>
                </div>
              </div>
             
              {/* Rewards History */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <Award size={20} className="text-green-600" />
                  Recycling History & Rewards
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waste Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight (kg)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points Earned</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {usersData[0].wasteHistory.map((entry, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{entry.type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.weight}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">+{entry.pointsEarned}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Corporation Section */}
      {currentView === 'corporation' && (
        <div className="min-h-screen flex flex-col items-center p-4">
          <div
            className="w-full max-w-5xl bg-white rounded-lg shadow-xl overflow-hidden"
            style={{
              backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url("https://images.unsplash.com/photo-1528323273322-d81458248d40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Waste Management Dashboard</h2>
                <button
                  onClick={goBack}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <ArrowLeft size={18} />
                  Back
                </button>
              </div>
             
              {/* Bin Status and Route Optimization */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <MapPin size={20} className="text-blue-500" />
                    Bin Status & Route Optimization
                  </h3>
                 
                  <div className="flex gap-2">
                    <button
                      onClick={optimizeRoute}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center gap-2"
                    >
                      <Navigation size={16} />
                      Optimize Collection Route
                    </button>
                   
                    {showRouteOptimization && (
                      <button
                        onClick={() => setShowRouteOptimization(false)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md flex items-center gap-2"
                      >
                        <ArrowLeft size={16} />
                        Back to Bin Status
                      </button>
                    )}
                  </div>
                </div>
               
                {!showRouteOptimization ? (
                  // Bin Status View
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bin Location</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waste Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Emptied</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Time to Fill</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {binLocations.map(bin => (
                          <tr key={bin.id} className={bin.status === 'full' ? 'bg-red-50' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bin.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bin.address}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                ${bin.status === 'full' ? 'bg-red-100 text-red-800' :
                                  bin.status === 'filling' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'}`}>
                                {bin.status.charAt(0).toUpperCase() + bin.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{bin.wasteType}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bin.lastEmptied}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {bin.status === 'full' ? 'Immediate collection needed' : `${bin.estimatedTimeToFill} hours`}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  // Route Optimization View
                  <div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                        <Navigation size={18} />
                        Optimized Collection Route
                      </h4>
                      <p className="text-sm text-gray-600">
                        The following route has been optimized to efficiently collect waste from all full bins.
                        Follow the sequence below for the most efficient collection path.
                      </p>
                    </div>
                   
                    {optimizedRoute.length > 0 ? (
                      <div className="space-y-4">
                        {optimizedRoute.map((bin, index) => (
                          <div key={bin.id} className="bg-white border border-gray-200 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                                {index + 1}
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-900">{bin.name}</h5>
                                <p className="text-sm text-gray-500">{bin.address}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                                    {bin.status.toUpperCase()}
                                  </span>
                                  <span className="text-xs text-gray-500 capitalize">
                                    {bin.wasteType} waste
                                  </span>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => emptyBin(bin.id)}
                              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md flex items-center gap-2"
                            >
                              <Recycle size={16} />
                              Mark as Emptied
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Recycle size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">No full bins to collect! All bins are currently being monitored.</p>
                      </div>
                    )}
                   
                    <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                        <Clock size={18} className="text-blue-500" />
                        Estimated Collection Time
                      </h4>
                      <p className="text-sm text-gray-600">
                        Total bins to collect: <span className="font-medium">{optimizedRoute.length}</span><br />
                        Estimated time per bin: <span className="font-medium">15 minutes</span><br />
                        Total estimated time: <span className="font-medium">{optimizedRoute.length * 15} minutes</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
             
              {/* User Selection */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <User size={20} className="text-blue-500" />
                  User Data Access
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setSelectedUser('all')}
                    className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                      selectedUser === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Users size={16} />
                    All Users
                  </button>
                  {usersData.map(user => (
                    <button
                      key={user.id}
                      onClick={() => setSelectedUser(user.id)}
                      className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                        selectedUser === user.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <UserCheck size={16} />
                      {user.name}
                    </button>
                  ))}
                </div>
              </div>
             
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                    <AlertTriangle size={20} className="text-red-500" />
                    Alerts
                  </h3>
                  <div className="space-y-2">
                    {alerts.length > 0 ? (
                      alerts.map((alert, index) => (
                        <div key={index} className="p-3 bg-red-100 text-red-800 rounded-md">
                          {alert}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No alerts yet.</p>
                    )}
                  </div>
                </div>
               
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                    <BarChart3 size={20} className="text-blue-500" />
                    Waste Distribution {selectedUser !== 'all' && `- ${usersData.find(u => u.id === selectedUser)?.name}`}
                  </h3>
                  <div className="h-64 flex items-center justify-center">
                    <WasteChart />
                  </div>
                </div>
              </div>
             
              {/* User Recycling Data */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <Trash2 size={20} className="text-blue-500" />
                  User Recycling Data
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Points</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Biodegradable (kg)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Non-Biodegradable (kg)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hazardous (kg)</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {usersData
                        .filter(user => selectedUser === 'all' || user.id === selectedUser)
                        .map(user => {
                          // Calculate total weights by type
                          const biodegradable = user.wasteHistory
                            .filter(entry => entry.type === 'biodegradable')
                            .reduce((sum, entry) => sum + entry.weight, 0);
                           
                          const nonBiodegradable = user.wasteHistory
                            .filter(entry => entry.type === 'non-biodegradable')
                            .reduce((sum, entry) => sum + entry.weight, 0);
                           
                          const hazardous = user.wasteHistory
                            .filter(entry => entry.type === 'hazardous')
                            .reduce((sum, entry) => sum + entry.weight, 0);
                         
                          return (
                            <tr key={user.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">{user.points}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{biodegradable.toFixed(1)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{nonBiodegradable.toFixed(1)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hazardous.toFixed(1)}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
             
              {/* User Recycling History */}
              {selectedUser !== 'all' && (
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    Recycling History - {usersData.find(u => u.id === selectedUser)?.name}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waste Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight (kg)</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points Earned</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {usersData
                          .find(u => u.id === selectedUser)
                          ?.wasteHistory.map((entry, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.date}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{entry.type}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.weight}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">+{entry.pointsEarned}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
             
              {/* Collection Schedule */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Collection Schedule</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Downtown</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Monday</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">8:00 AM</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">General</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Residential Area</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Wednesday</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">9:30 AM</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Recyclables</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Business District</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Friday</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">7:00 AM</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">All Types</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Waste Chart Component
function WasteChart() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center">
        <Recycle size={48} className="text-green-500 opacity-20" />
      </div>
      <div className="grid grid-cols-3 gap-4 w-full">
        <div className="flex flex-col items-center">
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div className="bg-green-500 h-4 rounded-full" style={{ width: '40%' }}></div>
          </div>
          <div className="h-32 w-full bg-green-500 rounded-t-lg flex items-end justify-center">
            <span className="text-white font-bold mb-2">40%</span>
          </div>
          <p className="mt-2 text-sm text-gray-600 text-center">Biodegradable</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div className="bg-yellow-500 h-4 rounded-full" style={{ width: '35%' }}></div>
          </div>
          <div className="h-32 w-full bg-yellow-500 rounded-t-lg flex items-end justify-center" style={{ height: 'calc(32rem * 0.35)' }}>
            <span className="text-white font-bold mb-2">35%</span>
          </div>
          <p className="mt-2 text-sm text-gray-600 text-center">Non-Biodegradable</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div className="bg-red-500 h-4 rounded-full" style={{ width: '25%' }}></div>
          </div>
          <div className="h-32 w-full bg-red-500 rounded-t-lg flex items-end justify-center" style={{ height: 'calc(32rem * 0.25)' }}>
            <span className="text-white font-bold mb-2">25%</span>
          </div>
          <p className="mt-2 text-sm text-gray-600 text-center">Hazardous</p>
        </div>
      </div>
    </div>
  );
}

export default App;
