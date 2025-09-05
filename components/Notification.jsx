import { useAuth, useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router";

// Define the API URL as a constant to avoid compilation errors
const API_URL = 'http://localhost:3000/api/v1';

const fetchNotifications = async (token) => {
  const response = await axios.get(`${API_URL}/users/notifications`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const NotificationBell = () => {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const [showNotifications, setShowNotifications] = useState(false);

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const token = await getToken();

      return fetchNotifications(token);
    },
    enabled: isLoaded && isSignedIn,
    staleTime: 60 * 1000 // Cache for 1 minute
  });

  if (!isSignedIn || isLoading) {
    return null; // Don't show the bell if the user is not signed in or data is loading
  }

  // Simple logic to count new posts (e.g., in the last 24 hours)
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const newNotifications = notifications?.filter(post => new Date(post.createdAt) > twentyFourHoursAgo) || [];
  const notificationCount = newNotifications.length;

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative"
      >
        <img src="/bell.png" className="w-5 sm:w-6 m-1" alt="" />
        {notificationCount > 0 && (
          <span className="absolute top-0 right-0 -mt-1 -mr-1 px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">{notificationCount}</span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-50 bg-white rounded-lg shadow-lg border-1 border-lime-400 z-1 p-4">
          <h3 className="font-bold text-lg text-gray-400 border-b pb-2 mb-2"><span className="text-lime-400">Ne</span><span className="text-lime-500">w</span><span className="text-lime-600"> Pos</span><span className="text-lime-700">ts</span></h3>
          {newNotifications.length > 0 ? (
            <ul className="space-y-2 max-h-50 overflow-y-auto">
              {newNotifications.map(post => (
                <li key={post._id} className="p-2 border border-lime-300 rounded-md hover:bg-lime-50">
                  <Link to={`/${post.slug}`} className="text-sm font-medium text-blue-400 hover:underline hover:text-indigo-400">{post.title}</Link>
                  <p className="text-xs text-blue-300"><span className="text-indigo-300">By </span>{post.user.username}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center p-4 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4" />
                <path d="M12 16h.01" />
              </svg>
              <span className="text-sm text-indigo-400">No new notifications.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
