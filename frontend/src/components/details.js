import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, User, Info, Activity } from 'lucide-react';

const LandingPage = () => {
  // List of famous quotes
  const quotes = [
    "Consistency is the key to success.",
    "Fitness is not about being better than someone else. It's about being better than you used to be.",
    "The only bad workout is the one that didn’t happen.",
    "Success is the sum of small efforts, repeated day in and day out.",
    "Don’t limit your challenges. Challenge your limits."
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black text-white">
      {/* Static Background Image */}
      <motion.img
        src="https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg"
        alt="Fitness"
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />

      {/* Overlay for better visibility */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* Main Content */}
      <main className="relative container mx-auto px-6 py-12 text-center">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <h2 className="text-4xl font-bold">
            Welcome to <span className="text-teal-400">Fitness Streak</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Embark on your fitness journey with exciting challenges, real-time tracking, and
            personalized features to keep you motivated. Achieve consistency and earn rewards as you
            progress.
          </p>
          <Link to="/signup">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-md hover:from-purple-700 hover:to-pink-700"
            >
              Get Started <ArrowRight className="w-5 h-5 inline ml-2" />
            </motion.button>
          </Link>
        </motion.div>

  

        {/* Features Section */}
        <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <FeatureCard
            icon={<User className="w-8 h-8 text-blue-500" />}
            title="User-Friendly Interface"
            description="An intuitive design ensures smooth navigation and a hassle-free experience for all users."
          />
          <FeatureCard
            icon={<Info className="w-8 h-8 text-green-500" />}
            title="Detailed Insights"
            description="Track your progress with in-depth analytics and personalized recommendations."
          />
          <FeatureCard
            icon={<Activity className="w-8 h-8 text-yellow-500" />}
            title="Exciting Challenges"
            description="Join or create challenges, upload proofs, and earn rewards as you achieve milestones."
          />
        </section>
      {/* Animated Quotes Section */}
      <div className="mt-16">
          {quotes.map((quote, index) => (
            <motion.div
              key={index}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              transition={{ type: "spring", stiffness: 50, delay: index * 0.5 }}
              className="text-xl font-semibold text-teal-400 mt-4"
            >
              "{quote}"
            </motion.div>
          ))}
        </div>
        {/* Consistency Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0 bg-gray-900 p-8 rounded-lg shadow-lg border border-gray-700"
        >
          {/* Left Side: FeatureCard with Image */}
          <div className="relative w-full lg:w-1/2 flex justify-center items-center">
            <img
              src="https://i.pinimg.com/736x/e8/62/37/e862372912b1ffb3d97ddcc41ff43a5e.jpg"
              alt="Ankit Baiyanpuria Before and After"
              className="w-full lg:w-3/4 max-w-xs lg:max-w-sm rounded-lg shadow-lg border-4 border-teal-500 hover:scale-125 relative z-10 opacity-90"
            />
            <div className="absolute top-2 left-2 p-4 bg-gradient-to-r from-purple-600 text-white px-4 py-1 rounded-md text-sm shadow-md">
              Before and After
            </div>
          </div>

          {/* Right Side: Text */}
          <div className="text-left space-y-4 lg:w-1/2">
            <h3 className="text-4xl font-semibold text-yellow-400">
              Consistency is the Key to Transformation
            </h3>
            <p className="text-gray-300 font-semibold">
              Witness the transformation of dedication and consistency. <span
                className="text-teal-400 font-semibold"
              >
                Fitness Streak
              </span>{' '}
              motivates you to stay consistent with daily challenges and earn rewards along the way.
            </p>
            <p className="text-gray-300 font-semibold text-base">
              Like Ankit Baiyanpuria's inspiring journey, our platform encourages you to create your
              own success story. Track your progress, join challenges, and make fitness a rewarding
              habit.
            </p>
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-800 text-white font-medium rounded-md hover:from-green-600 hover:to-blue-600 my-5 mx-[25%] w-[50%]"
              >
                Join Now
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </main>

      <footer className="mt-16 py-4 bg-gray-800 text-gray-400 text-center relative">
        <p>
          &copy; {new Date().getFullYear()} Fitness Streak. Built with passion and code. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, className = "" }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`bg-gray-800 p-6 rounded-lg shadow-lg text-left space-y-4 ${className}`}
  >
    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-700">
      {icon}
    </div>
    <h4 className="text-xl font-semibold">{title}</h4>
    <p className="text-gray-400">{description}</p>
  </motion.div>
);

export default LandingPage;
