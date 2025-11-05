import React from "react";
import { Link } from "react-router-dom";
import { Crown, Award, Star, Users, Heart, Gift } from "lucide-react";

function HallOfFame() {
  const topContributors = [
    {
      id: 1,
      name: "Mandip B.",
      username: "@mandipb",
      contributions: 1247,
      avatar: "MB",
      badge: "👑 Top Contributor",
    },
    {
      id: 2,
      name: "Anjali K.",
      username: "@anjalik",
      contributions: 982,
      avatar: "AK",
      badge: "🥈 Silver Member",
    },
    {
      id: 3,
      name: "Ramesh S.",
      username: "@rameshs",
      contributions: 876,
      avatar: "RS",
      badge: "🥉 Bronze Member",
    },
  ];

  const monthlyWinners = [
    {
      id: 1,
      name: "Sunita M.",
      username: "@sunitam",
      points: 450,
      avatar: "SM",
      prize: "🎁 Premium Subscription",
    },
    {
      id: 2,
      name: "Prakash L.",
      username: "@prakashl",
      points: 380,
      avatar: "PL",
      prize: "💝 1000 Coins",
    },
    {
      id: 3,
      name: "Nikita R.",
      username: "@nikitar",
      points: 320,
      avatar: "NR",
      prize: "🎟️ Free Event Pass",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Crown className="h-16 w-16 mx-auto mb-6 text-yellow-300" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">YugalMeet Hall of Fame</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Celebrating our most active and contributing members who make YugalMeet a vibrant community
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-6 py-3">
              <span className="font-semibold">10,000+</span> Members
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-6 py-3">
              <span className="font-semibold">50,000+</span> Connections
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-6 py-3">
              <span className="font-semibold">1,000+</span> Events
            </div>
          </div>
        </div>
      </div>

      {/* Top Contributors */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Top Contributors</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Recognizing members who actively contribute to our community through posts, events, and helping others
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topContributors.map((contributor, index) => (
              <div 
                key={contributor.id} 
                className={`bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-105 ${
                  index === 0 ? 'md:col-span-3 md:max-w-2xl mx-auto' : ''
                }`}
              >
                <div className={`p-8 ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 
                  index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400' : 
                  'bg-gradient-to-r from-amber-600 to-amber-700'
                } text-white`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-2">
                        <Crown className={`h-6 w-6 mr-2 ${
                          index === 0 ? 'text-yellow-200' : 
                          index === 1 ? 'text-gray-200' : 
                          'text-amber-200'
                        }`} />
                        <span className="font-bold text-lg">{contributor.badge}</span>
                      </div>
                      <h3 className="text-2xl font-bold">{contributor.name}</h3>
                      <p className="text-lg opacity-90">{contributor.username}</p>
                    </div>
                    <div className="text-5xl font-bold opacity-20">
                      {index === 0 ? '1st' : index === 1 ? '2nd' : '3rd'}
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center text-xl font-bold">
                        {contributor.avatar}
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <Award className="h-5 w-5 text-yellow-500 mr-1" />
                          <span className="font-bold text-gray-900">{contributor.contributions}</span>
                          <span className="text-gray-600 ml-1">contributions</span>
                        </div>
                      </div>
                    </div>
                    <Link 
                      to={`/@${contributor.username.substring(1)}`} 
                      className="bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-pink-600 transition-colors"
                    >
                      View Profile
                    </Link>
                  </div>
                  <div className="flex justify-center space-x-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Winners */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">This Month's Winners</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Congratulations to our members who achieved the highest engagement and activity levels this month
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {monthlyWinners.map((winner, index) => (
              <div 
                key={winner.id} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:scale-105"
              >
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center">
                      <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl w-16 h-16 flex items-center justify-center text-xl font-bold text-white">
                        {winner.avatar}
                      </div>
                      <div className="ml-4">
                        <h3 className="font-bold text-gray-900">{winner.name}</h3>
                        <p className="text-gray-600">{winner.username}</p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      #{index + 1}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Points</span>
                      <span className="font-bold text-gray-900">{winner.points}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-gradient-to-r from-pink-500 to-purple-600 h-2.5 rounded-full" 
                        style={{ width: `${(winner.points / 500) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <div className="flex items-center">
                      <Gift className="h-5 w-5 text-purple-500 mr-2" />
                      <span className="font-semibold text-gray-900">{winner.prize}</span>
                    </div>
                  </div>
                  
                  <Link 
                    to={`/@${winner.username.substring(1)}`} 
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all text-center block"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How to Earn Points */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How to Earn Points</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Become a Hall of Fame member by actively participating in our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <Users className="h-12 w-12 text-pink-500 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Connect</h3>
              <p className="text-gray-600 text-sm">+10 points for each new connection</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <Heart className="h-12 w-12 text-pink-500 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Engage</h3>
              <p className="text-gray-600 text-sm">+5 points for likes and comments</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <Star className="h-12 w-12 text-pink-500 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Participate</h3>
              <p className="text-gray-600 text-sm">+20 points for event attendance</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <Award className="h-12 w-12 text-pink-500 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Contribute</h3>
              <p className="text-gray-600 text-sm">+50 points for community posts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 px-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Community Today</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Start connecting, participating, and earning your place in the YugalMeet Hall of Fame
          </p>
          <Link 
            to="/register" 
            className="bg-white text-pink-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors inline-block"
          >
            Create Your Profile
          </Link>
        </div>
      </div>

      {/* Footer Note */}
      <div className="py-8 px-4 text-center">
        <p className="text-gray-600">
          YugalMeet – Vauju Khoj Abhiyan
        </p>
      </div>
    </div>
  );
}

export default HallOfFame;