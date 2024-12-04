// import React from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Activity, Calendar, User } from 'lucide-react';
// import HomeRight from './right'; // Adjust the import path if necessary

// const HomePage = () => {
//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Main content area */}
//          {/* Header */}
//          <Header isLoggedIn={isLoggedIn} onLogout={onLogout} />
//       <div className="flex-1 p-8 overflow-y-auto">
//         <h1 className="text-3xl font-bold mb-6">Welcome to Your Fitness Journey</h1>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center">
//                 <Activity className="mr-2 h-5 w-5" />
//                 Today's Activity
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p>You've taken 8,234 steps today!</p>
//               <p>Calories burned: 320</p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center">
//                 <Calendar className="mr-2 h-5 w-5" />
//                 Upcoming Workouts
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <ul className="list-disc list-inside">
//                 <li>HIIT Session - Tomorrow, 7:00 AM</li>
//                 <li>Yoga Class - Friday, 6:00 PM</li>
//               </ul>
//             </CardContent>
//           </Card>
//         </div>

//         <Card className="mb-8">
//           <CardHeader>
//             <CardTitle className="flex items-center">
//               <User className="mr-2 h-5 w-5" />
//               Your Progress
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="mb-2">You're making great progress! Here's a summary:</p>
//             <ul className="list-disc list-inside">
//               <li>Weight loss: 2.5 kg this month</li>
//               <li>Strength increase: 10% in bench press</li>
//               <li>Cardio improvement: 2 minutes faster 5k time</li>
//             </ul>
//           </CardContent>
//         </Card>

//         <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out">
//           Start Today's Workout
//         </Button>
//       </div>

//       {/* Right sidebar */}
//       <HomeRight />
//     </div>
//   );
// };

// export default HomePage;
