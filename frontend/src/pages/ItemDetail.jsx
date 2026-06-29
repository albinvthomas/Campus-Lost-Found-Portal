import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api, { BASE_URL } from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const HOST_URL = BASE_URL.replace('/api', '');

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await api.get(`/items/${id}`);
        setItem(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load item details');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      setIsDeleting(true);
      try {
        await api.delete(`/items/${id}`);
        navigate('/my-reports');
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete item');
        setIsDeleting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 inline-block">
          {error || 'Item not found'}
        </div>
        <div>
          <Link to="/items" className="text-blue-600 hover:underline">
            &larr; Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user && item.userId && user._id === item.userId._id;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link to="/items" className="text-blue-600 hover:underline flex items-center text-sm font-medium">
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Browse
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="md:flex">
          {/* Image Section */}
          <div className="md:w-1/2 bg-gray-50 flex items-center justify-center min-h-[300px] border-b md:border-b-0 md:border-r border-gray-200">
            {item.image ? (
              <img 
                src={`${HOST_URL}/uploads/${item.image}`} 
                alt={item.title} 
                className="w-full h-full object-contain max-h-[500px]"
              />
            ) : (
              <div className="text-center p-10 text-gray-400">
                <svg className="mx-auto h-20 w-20 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>No image available</p>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="md:w-1/2 p-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide mb-2 ${
                  item.type === 'lost' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                }`}>
                  {item.type} Item
                </span>
                <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide mb-2 ${
                  item.status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {item.status}
                </span>
                <h1 className="text-3xl font-extrabold text-gray-900">{item.title}</h1>
              </div>
            </div>

            <div className="prose prose-sm text-gray-600 mb-8 whitespace-pre-wrap">
              <p>{item.description}</p>
            </div>

            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 mb-8">
              <div>
                <dt className="text-sm font-medium text-gray-500">Category</dt>
                <dd className="mt-1 text-sm font-semibold text-gray-900">{item.category}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Location</dt>
                <dd className="mt-1 text-sm font-semibold text-gray-900">{item.location}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Date {item.type === 'lost' ? 'Lost' : 'Found'}</dt>
                <dd className="mt-1 text-sm font-semibold text-gray-900">{new Date(item.date).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Reported By</dt>
                <dd className="mt-1 text-sm font-semibold text-gray-900">{item.userId?.name || 'Unknown'}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Reported On</dt>
                <dd className="mt-1 text-sm font-semibold text-gray-900">
                  {new Date(item.createdAt).toLocaleString()}
                </dd>
              </div>
            </dl>

            {isOwner && (
              <div className="border-t border-gray-200 pt-6 flex space-x-3">
                <button 
                  className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium shadow-sm transition"
                  onClick={() => alert('Edit functionality to be implemented')}
                >
                  Edit Report
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg font-medium shadow-sm transition disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Report'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
