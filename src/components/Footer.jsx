import React from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  ShieldCheck,
  FileText,
  HelpCircle,
} from "lucide-react";

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src="/logo.png" alt="YugalMeet" className="h-10 w-10" />
              <span className="text-lg font-bold text-gray-900">
                Yugal<span className="text-pink-500">Meet</span>
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              YugalMeet helps you connect with genuine people and build
              meaningful relationships in a safe and trusted environment.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/features" className="hover:text-pink-500">Features</a></li>
              <li><a href="/safety" className="hover:text-pink-500">Safety</a></li>
              <li><a href="/download" className="hover:text-pink-500">Download App</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <HelpCircle size={14} /> Help Center
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck size={14} /> Safety Tips
              </li>
              <li className="flex items-center gap-2">
                <FileText size={14} /> Privacy Policy
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Follow Us</h4>
            <div className="flex gap-4 text-gray-600">
              <a href="#" className="hover:text-pink-500"><Facebook size={18} /></a>
              <a href="#" className="hover:text-pink-500"><Instagram size={18} /></a>
              <a href="#" className="hover:text-pink-500"><Twitter size={18} /></a>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} YugalMeet. All rights reserved.
          </p>

          <p className="text-xs text-gray-400">
            Founded by <span className="font-medium text-gray-600">Abhaya Bikram Shahi</span> • v1.0.1
          </p>

        </div>

      </div>
    </footer>
  );
}

export default Footer;
