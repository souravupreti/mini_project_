import React from 'react';
import { Button } from 'your-button-library'; // Change to your actual button import
import { User, BarChart, Dumbbell, ShoppingBag, BookOpen } from 'lucide-react';

const LeftSidebarItem = ({ icon, label }) => (
  <Button variant="ghost" className="w-full justify-start text-white hover:bg-teal-600">
    {icon}
    <span className="ml-2">{label}</span>
  </Button>
);

const LeftSidebar = () => {
  return (
    <div className="w-64 bg-gradient-to-br from-gray-900 to-violet-900 p-4 shadow-md h-screen text-white">
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      <nav className="space-y-2">
        <LeftSidebarItem icon={<User className="h-5 w-5" />} label="Profile" />
        <LeftSidebarItem icon={<BarChart className="h-5 w-5" />} label="Progress" />
        <LeftSidebarItem icon={<Dumbbell className="h-5 w-5" />} label="Trainer" />
        <LeftSidebarItem icon={<ShoppingBag className="h-5 w-5" />} label="Products" />
        <LeftSidebarItem icon={<BookOpen className="h-5 w-5" />} label="Resources" />
      </nav>
    </div>
  );
};

export default LeftSidebar;
