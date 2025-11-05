import React from "react";
import { Link } from "react-router-dom";
import { Users, Calendar, MapPin, Heart, MessageCircle, Star } from "lucide-react";

function Community() {
  const events = [
    {
      id: 1,
      title: "Valentine's Day Special",
      date: "Feb 14, 2024",
      location: "Online — YugalMeet Community",
      description: "Join our virtual Valentine's Day celebration with special matches and activities.",
      attendees: 120,
    },
    {
      id: 2,
      title: "Nepali New Year Celebration",
      date: "Apr 14, 2024",
      location: "Kathmandu, Nepal",
      description: "Celebrate Nepali New Year with fellow members in Kathmandu.",
      attendees: 85,
    },
  ];

  const featuredMembers = [
    {
      id: 1,
      name: "Sunita K.",
      age: 28,
      interests: ["Travel", "Photography", "Cooking"],
      online: true,
    },
    {
      id: 2,
      name: "Rajesh M.",
      age: 32,
      interests: ["Music", "Hiking", "Movies"],
      online: false,
    },
    {
      id: 3,
      name: "Priya S.",
      age: 25,
      interests: ["Dance", "Art", "Yoga"],
      online: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">YugalMeet Community</h1>
          <p className="text-xl mb-8">Connect with like-minded individuals and participate in exciting events</p>
          <div className="flex justify-center space-x-4">
            <Link to="/explore" className="bg-white text-pink-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              Find Members
            </Link>
            <Link to="/events" className="bg-transparent border-2 border-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-pink-600 transition-colors">
              View Events
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Users className="h-12 w-12 text-pink-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">10,000+</h3>
              <p className="text-gray-600">Active Members</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Heart className="h-12 w-12 text-pink-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">5,000+</h3>
              <p className="text-gray-600">Successful Matches</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Calendar className="h-12 w-12 text-pink-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">50+</h3>
              <p className="text-gray-600">Community Events</p>
            </div>
          </div>
        </div>
      </div>

      {/* Events Section */}
      <div className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Upcoming Events</h2>
            <Link to="/events" className="text-pink-600 font-semibold hover:text-pink-800">
              View All Events
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((event) => (
              <div key={event.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                  <span className="bg-pink-100 text-pink-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {event.attendees} attending
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{event.location}</span>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{event.description}</p>
                <button className="w-full bg-pink-500 text-white py-2 rounded-lg font-semibold hover:bg-pink-600 transition-colors">
                  Join Event
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Members */}
      <div className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Members</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredMembers.map((member) => (
              <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                    <div className="ml-4">
                      <h3 className="font-bold text-gray-900">{member.name}, {member.age}</h3>
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full mr-2 ${member.online ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <span className="text-sm text-gray-600">{member.online ? 'Online' : 'Offline'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {member.interests.map((interest, index) => (
                        <span key={index} className="bg-pink-100 text-pink-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-pink-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-pink-600 transition-colors">
                      <Heart className="h-4 w-4 inline mr-1" />
                      Like
                    </button>
                    <button className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors">
                      <MessageCircle className="h-4 w-4 inline mr-1" />
                      Message
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link to="/explore" className="inline-flex items-center text-pink-600 font-semibold hover:text-pink-800">
              <Users className="h-5 w-5 mr-1" />
              Discover More Members
            </Link>
          </div>
        </div>
      </div>

      {/* Community Guidelines */}
      <div className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">YugalMeet Community 💞</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-pink-50 p-6 rounded-lg">
              <Star className="h-8 w-8 text-pink-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Be Respectful</h3>
              <p className="text-gray-700">Treat all members with kindness and respect. Harassment or offensive behavior will not be tolerated.</p>
            </div>
            
            <div className="bg-pink-50 p-6 rounded-lg">
              <Heart className="h-8 w-8 text-pink-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Stay Authentic</h3>
              <p className="text-gray-700">Be genuine in your interactions. Honest profiles lead to better connections.</p>
            </div>
            
            <div className="bg-pink-50 p-6 rounded-lg">
              <MessageCircle className="h-8 w-8 text-pink-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Communicate Safely</h3>
              <p className="text-gray-700">Protect your personal information. Meet in public places for first encounters.</p>
            </div>
            
            <div className="bg-pink-50 p-6 rounded-lg">
              <Users className="h-8 w-8 text-pink-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Report Issues</h3>
              <p className="text-gray-700">Help us maintain a safe environment by reporting suspicious or inappropriate behavior.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Community;