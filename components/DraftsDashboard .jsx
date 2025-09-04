import { useAuth, useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router";

const DraftsDashboard = () => {
    const { getToken } = useAuth();
    const { isLoaded, isSignedIn } = useUser();

    const { data: drafts, isLoading, isError, error } = useQuery({
        queryKey: ['userDrafts'],
        queryFn: async () => {
            const token = await getToken();
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/Dposts/drafts`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        },
    });

    console.log(drafts);

    if (!isLoaded) {
        return <div className="">Loading...</div>;
    }

    if (isLoaded && !isSignedIn) {
        return <div className="">You should login!</div>;
    }


    if (isLoading) {
        return <div>Loading drafts...</div>;
    }

    if (isError) {
        return <div>Error fetching drafts: {error.message}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Your Saved Drafts</h1>
            {drafts?.length === 0 ? (
                <p>You have no saved drafts....</p>
            ) : (
                <ul className="space-y-4">
                    {drafts?.map((draft) => (
                        <li key={draft._id} className="p-4 border rounded shadow-sm flex justify-between items-center">
                            <div>
                                <Link to={`/contentwrite?draftId=${draft._id}`} className="text-xl font-semibold hover:underline">
                                    {draft.title || 'Untitled Draft'}
                                </Link>
                                <p className="text-sm text-gray-500">Last saved: {new Date(draft.updatedAt).toLocaleDateString()}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default DraftsDashboard 