import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, CreditCard, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

function BuyCoins() {
  const navigate = useNavigate();
  const isOnline = useOnlineStatus();
  const [currentIndex, setCurrentIndex] = useState(0);

  const coinPackages = [
    {
      id: 1,
      coins: 50,
      price: 50,
      description: "Starter Pack"
    },
    {
      id: 2,
      coins: 150,
      price: 150,
      popular: true,
      description: "Best Value"
    },
    {
      id: 3,
      coins: 400,
      price: 400,
      description: "Pro Pack"
    },
    {
      id: 4,
      coins: 1000,
      price: 1000,
      description: "Elite Pack"
    }
  ];

  const handlePurchase = (packageId) => {
    alert(`Thank you for your interest! Payment integration coming soon.`);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? coinPackages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === coinPackages.length - 1 ? 0 : prev + 1));
  };

  // Show offline message
  if (!isOnline) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white px-4 md:ml-[70px]">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">📡</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Internet Connection</h2>
          <p className="text-gray-600">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white md:ml-[70px]">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Yugal Coins</h1>
          <p className="text-gray-600">Enhance your experience with premium features</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12">
        {/* Mobile Carousel */}
        <div className="md:hidden mb-16">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handlePrevious}
              className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors flex-shrink-0"
              aria-label="Previous"
            >
              <ChevronLeft size={24} className="text-gray-800" />
            </button>

            <div className="flex-1">
              <div className={`relative rounded-xl border transition-all duration-200 p-6 text-center ${ 
                coinPackages[currentIndex].popular
                  ? 'border-pink-300 bg-pink-50 shadow-lg'
                  : 'border-gray-200 bg-gray-50'
              }`}>
                {coinPackages[currentIndex].popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-pink-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Popular
                  </div>
                )}
                
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Sparkles size={20} className={coinPackages[currentIndex].popular ? 'text-pink-600' : 'text-gray-400'} />
                  <span className={`text-3xl font-bold ${coinPackages[currentIndex].popular ? 'text-pink-600' : 'text-gray-900'}`}>
                    {coinPackages[currentIndex].coins}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4">{coinPackages[currentIndex].description}</p>

                <div className="mb-6">
                  <div className="text-2xl font-bold text-gray-900">रु {coinPackages[currentIndex].price}</div>
                </div>

                <button
                  onClick={() => handlePurchase(coinPackages[currentIndex].id)}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors duration-200 ${
                    coinPackages[currentIndex].popular
                      ? 'bg-pink-600 text-white hover:bg-pink-700'
                      : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                  }`}
                >
                  Buy Now
                </button>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors flex-shrink-0"
              aria-label="Next"
            >
              <ChevronRight size={24} className="text-gray-800" />
            </button>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {coinPackages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentIndex ? 'bg-pink-600' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {coinPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative rounded-xl border transition-all duration-200 p-6 text-center cursor-pointer ${ 
                pkg.popular
                  ? 'border-pink-300 bg-pink-50 shadow-lg scale-105'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-pink-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Popular
                </div>
              )}
              
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles size={20} className={pkg.popular ? 'text-pink-600' : 'text-gray-400'} />
                <span className={`text-3xl font-bold ${pkg.popular ? 'text-pink-600' : 'text-gray-900'}`}>
                  {pkg.coins}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>

              <div className="mb-6">
                <div className="text-2xl font-bold text-gray-900">रु {pkg.price}</div>
              </div>

              <button
                onClick={() => handlePurchase(pkg.id)}
                className={`w-full py-3 rounded-lg font-semibold transition-colors duration-200 ${
                  pkg.popular
                    ? 'bg-pink-600 text-white hover:bg-pink-700'
                    : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                }`}
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What Can You Do With Coins?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex gap-4">
              <CreditCard className="text-pink-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-semibold text-gray-900">Boost Posts</h3>
                <p className="text-sm text-gray-600 mt-1">Increase visibility of your posts</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Sparkles className="text-pink-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-semibold text-gray-900">Send Gifts</h3>
                <p className="text-sm text-gray-600 mt-1">Show appreciation with virtual gifts</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Sparkles className="text-pink-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-semibold text-gray-900">Premium Features</h3>
                <p className="text-sm text-gray-600 mt-1">Unlock exclusive benefits</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked</h2>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="font-semibold text-gray-900 mb-2">Are coins refundable?</p>
              <p className="text-sm text-gray-600">Yes, we offer a 30-day money-back guarantee if you're not satisfied.</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="font-semibold text-gray-900 mb-2">How do I use my coins?</p>
              <p className="text-sm text-gray-600">Use coins to boost posts, send gifts, or unlock premium features throughout the app.</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="font-semibold text-gray-900 mb-2">Is it secure?</p>
              <p className="text-sm text-gray-600">All payments are processed securely with industry-standard encryption.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuyCoins;