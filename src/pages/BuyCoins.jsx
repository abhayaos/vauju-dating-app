import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, CreditCard, Shield, CheckCircle } from 'lucide-react';

function BuyCoins() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for 4 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const coinPackages = [
    {
      id: 1,
      coins: 100,
      price: 250,
      popular: false,
      savings: null
    },
    {
      id: 2,
      coins: 500,
      price: 999,
      popular: true,
      savings: "20% OFF"
    },
    {
      id: 3,
      coins: 1200,
      price: 1999,
      popular: false,
      savings: "30% OFF"
    },
    {
      id: 4,
      coins: 2500,
      price: 3499,
      popular: false,
      savings: "40% OFF"
    }
  ];

  const handlePurchase = (packageId) => {
    // In a real app, this would integrate with a payment processor
    alert(`Thank you for purchasing coin package #${packageId}! In a real app, this would redirect to a payment processor.`);
  };

  // Skeleton loading component
  const SkeletonLoader = () => (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Skeleton */}
        <div className="text-center mb-12 animate-pulse">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>

        {/* Coin Packages Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 animate-pulse">
              <div className="text-center mb-5">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
              </div>
              <div className="mb-6">
                <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded-xl"></div>
            </div>
          ))}
        </div>

        {/* Features Skeleton */}
        <div className="bg-gray-50 rounded-2xl shadow-lg p-8 mb-12 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="text-center p-4 bg-white rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5 mx-auto mt-2"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Trust Skeleton */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 animate-pulse">
          <div className="flex flex-col md:flex-row items-center">
            <div className="flex-1 mb-6 md:mb-0 md:pr-8">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
              <div className="space-y-2">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center">
                    <div className="w-5 h-5 bg-gray-200 rounded-full mr-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-yellow-500 font-bold text-lg">YC</span>
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Buy Yugal Coins</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get Yugal Coins to boost your posts, send gifts, and unlock premium features
          </p>
        </div>

        {/* Coin Packages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {coinPackages.map((pkg) => (
            <div 
              key={pkg.id}
              className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                pkg.popular 
                  ? 'border-yellow-400 transform scale-105 relative' 
                  : 'border-gray-100'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}
              <div className="p-6">
                <div className="text-center mb-5">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-yellow-600 font-bold text-xl">{pkg.coins}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{pkg.coins} Coins</h3>
                  {pkg.savings && (
                    <span className="inline-block mt-2 bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      {pkg.savings}
                    </span>
                  )}
                </div>
                
                <div className="mb-6">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-gray-900">रु {pkg.price}</span>
                    <span className="text-gray-500 text-sm">/one-time</span>
                  </div>
                </div>
                
                <button
                  onClick={() => handlePurchase(pkg.id)}
                  className={`w-full py-3 rounded-xl font-semibold transition ${
                    pkg.popular
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 shadow-md'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  Get Coins
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="bg-gray-50 rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">What You Can Do With Yugal Coins</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="text-blue-600" size={24} />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Boost Posts</h3>
              <p className="text-gray-600">
                Increase visibility of your posts to reach more users
              </p>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="text-pink-600" size={24} />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Send Gifts</h3>
              <p className="text-gray-600">
                Show appreciation to other users with virtual gifts
              </p>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-purple-600" size={24} />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Premium Features</h3>
              <p className="text-gray-600">
                Unlock exclusive features and benefits
              </p>
            </div>
          </div>
        </div>

        {/* Security & Trust */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
          <div className="flex flex-col md:flex-row items-center">
            <div className="flex-1 mb-6 md:mb-0 md:pr-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Secure & Trusted</h2>
              <p className="text-gray-600 mb-4">
                Your payments are securely processed with industry-standard encryption. 
                We never store your payment information.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2" size={20} />
                  <span className="text-gray-700">256-bit SSL encryption</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2" size={20} />
                  <span className="text-gray-700">PCI DSS compliant</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2" size={20} />
                  <span className="text-gray-700">30-day money-back guarantee</span>
                </li>
              </ul>
            </div>
            <div className="flex-1">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-center mb-4">
                  <Shield className="text-blue-600" size={48} />
                </div>
                <h3 className="text-center font-semibold text-lg text-gray-900 mb-2">
                  Money-Back Guarantee
                </h3>
                <p className="text-center text-gray-600 text-sm">
                  Not satisfied? Get a full refund within 30 days of purchase.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-10">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default BuyCoins;