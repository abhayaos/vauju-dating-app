// ErrorBoundary.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-4">{this.state.error?.message || "Unknown error"}</p>
            <button
              onClick={() => {
                this.props.logout();
                this.props.navigate("/login");
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-full"
            >
              Go to Login
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function ErrorBoundaryWrapper(props) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  return <ErrorBoundary navigate={navigate} logout={logout} {...props} />;
}