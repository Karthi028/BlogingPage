import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";


const UserSubscribe = ({ bloggerId, clerkUserId }) => {

  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const queryClient = useQueryClient();

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


  if (!bloggerId || !isSignedIn || isLoading || isError) {
    return null;
  }

  if (user.id === clerkUserId) {
    return null;
  }

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
