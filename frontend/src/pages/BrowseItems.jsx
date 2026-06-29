import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { BASE_URL } from '../api/axios';

const HOST_URL = BASE_URL.replace('/api', '');

const CATEGORIES = [
  'Electronics', 'ID/Documents', 'Clothing', 'Accessories', 
  'Books/Stationery', 'Keys', 'Wallet/Bag', 'Water Bottle', 'Other'
];

const BrowseItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [type, setType] = useState('lost');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  // Debounced search term for API call
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = { type };
        if (category) params.category = category;
        if (debouncedSearch) params.search = debouncedSearch;

        const response = await api.get('/items', { params });
        setItems(response.data);
      } catch (err) {
        setError('Failed to fetch items. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [type, category, debouncedSearch]);

  const handleTypeToggle = (newType) => {
    setType(newType);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Browse Items</h1>
        
        {/* Type Tabs */}
        <div className="inline-flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => handleTypeToggle('lost')}
            className={`px-6 py-2.5 rounded-md text-sm font-medium transition-colors ${
              type === 'lost' 
                ? 'bg-white text-gray-900 shadow' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Lost Items
          </button>
          <button
            onClick={() => handleTypeToggle('found')}
            className={`px-6 py-2.5 rounded-md text-sm font-medium transition-colors ${
              type === 'found' 
                ? 'bg-white text-gray-900 shadow' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Found Items
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="md:w-64">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Link 
              key={item._id} 
              to={`/items/${item._id}`}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col"
            >
              {/* Image */}
              <div className="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                {item.image ? (
                  <img 
                    src={`${HOST_URL}/uploads/${item.image}`} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <svg className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full shadow-sm ${
                    item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {item.status === 'active' ? 'Active' : 'Recovered'}
                  </span>
                </div>
              </div>
              
              {/* Card Body */}
              <div className="p-5 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1" title={item.title}>
                    {item.title}
                  </h3>
                  <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full whitespace-nowrap ml-2">
                    {item.category}
                  </span>
                </div>
                
                <div className="mt-auto space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{item.location}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseItems;
