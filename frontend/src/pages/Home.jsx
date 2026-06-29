import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-gray-50">
      {/* Hero Section */}
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            Campus <span className="text-blue-600">Lost & Found</span> Portal
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Report lost or found items. Help reunite belongings with their rightful owners across the campus.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/items" 
              className="inline-flex justify-center items-center px-8 py-3.5 border border-transparent text-lg font-medium rounded-xl shadow-md text-white bg-blue-600 hover:bg-blue-700 transition transform hover:-translate-y-0.5"
            >
              Browse Items
            </Link>
            <Link 
              to="/report" 
              className="inline-flex justify-center items-center px-8 py-3.5 border-2 border-gray-200 text-lg font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition transform hover:-translate-y-0.5"
            >
              Report an Item
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-t border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {/* Stat Card 1 */}
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm transition hover:shadow-md">
              <div className="text-4xl font-bold text-blue-600 mb-2">1,248</div>
              <div className="text-gray-600 font-medium">Items Reported</div>
            </div>
            
            {/* Stat Card 2 */}
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm transition hover:shadow-md">
              <div className="text-4xl font-bold text-green-500 mb-2">892</div>
              <div className="text-gray-600 font-medium">Items Recovered</div>
            </div>
            
            {/* Stat Card 3 */}
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm transition hover:shadow-md">
              <div className="text-4xl font-bold text-blue-600 mb-2">9</div>
              <div className="text-gray-600 font-medium">Categories</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
