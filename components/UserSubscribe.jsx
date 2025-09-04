import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

// Define the API URL as a constant
const API_URL = 'http://localhost:3000/api/v1';

const UserSubscribe = ({ bloggerId }) => {

  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const queryClient = useQueryClient();

  // Fetch the current user's subscriptions
  const { data: subscriptions, isLoading, isError } = useQuery({
    queryKey: ['subscriptions', isSignedIn ? user.id : null],
    queryFn: async () => {
      const token = await getToken();
      const response = await axios.get(`${API_URL}/users/subscriptions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
    enabled: isLoaded && isSignedIn 
  });

  // Mutation for subscribing to a user
  const subscribeMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      await axios.post(`${API_URL}/users/subscribe/${bloggerId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast.success("Successfully subscribed!");
    },
    onError: (err) => {
      toast.error("Failed to subscribe: " + err.message);
    }
  });

  // Mutation for unsubscribing from a user
  const unsubscribeMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      await axios.post(`${API_URL}/users/unsubscribe/${bloggerId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast.success("Successfully unsubscribed!");
    },
    onError: (err) => {
      toast.error("Failed to unsubscribe: " + err.message);
    }
  });

  // Handle loading, errors, and missing bloggerId before rendering anything.
  if (!bloggerId || !isSignedIn || isLoading || isError) {
    return null;
  }

  // Also, don't show the button on the user's own profile.
  if (user.id === bloggerId) {
    return null;
  }

  // Safely check if the user is subscribed after all necessary data is loaded.
  const isSubscribed = Array.isArray(subscriptions) && subscriptions.some(sub => sub._id === bloggerId);

  if (isSubscribed) {
    return (
      <button
        onClick={() => unsubscribeMutation.mutate()}
        disabled={unsubscribeMutation.isPending}
        className="p-1 rounded-xl bg-red-500 text-white font-medium text-sm disabled:bg-red-300"
      >
        {unsubscribeMutation.isPending ? "Unsubscribing..." : "Unsubscribe"}
      </button>
    );
  } else {
    return (
      <button
        onClick={() => subscribeMutation.mutate()}
        disabled={subscribeMutation.isPending}
        className="p-1 rounded-xl bg-lime-500 text-white text-sm font-medium disabled:bg-lime-300"
      >
        {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
      </button>
    );
  }
};

export default UserSubscribe;
