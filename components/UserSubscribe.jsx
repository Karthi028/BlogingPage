import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";


const UserSubscribe = ({ bloggerId,clerkUserId }) => {

  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const queryClient = useQueryClient();

  // Fetch the current user's subscriptions
  const { data: subscriptions, isLoading, isError } = useQuery({
    queryKey: ['subscriptions', isSignedIn ? user.id : null],
    queryFn: async () => {
      const token = await getToken();
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/subscriptions`, {
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
      await axios.post(`${import.meta.env.VITE_API_URL}/users/subscribe/${bloggerId}`, {}, {
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
      await axios.post(`${import.meta.env.VITE_API_URL}/users/unsubscribe/${bloggerId}`, {}, {
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
  if (user.id === clerkUserId ) {
    return null;
  }

  // Safely check if the user is subscribed after all necessary data is loaded.
  const isSubscribed = Array.isArray(subscriptions) && subscriptions.some(sub => sub._id === bloggerId);

  if (isSubscribed) {
    return (
      <button
        onClick={() => unsubscribeMutation.mutate()}
        disabled={unsubscribeMutation.isPending}
        className="p-1 rounded-xl bg-gradient-to-r from-red-400 to-red-600 text-white font-medium text-sm disabled:bg-red-300"
      >
        {unsubscribeMutation.isPending ? "Unsubscribing..." : "Unsubscribe"}
      </button>
    );
  } else {
    return (
      <button
        onClick={() => subscribeMutation.mutate()}
        disabled={subscribeMutation.isPending}
        className="p-1 rounded-xl bg-gradient-to-r from-blue-700 to-purple-800 text-white text-sm font-medium disabled:bg-lime-300"
      >
        {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
      </button>
    );
  }
};

export default UserSubscribe;
