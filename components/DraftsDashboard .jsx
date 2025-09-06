import { useAuth, useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import Anime from "../components/AnimeImage"

const DraftsDashboard = () => {
    const { getToken } = useAuth();
    const { isLoaded, isSignedIn } = useUser();
    const navigate = useNavigate();

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

    if (!isLoaded) {
        return <Anime />;
    }

    if (isLoaded && !isSignedIn) {
        navigate('/login');
    }


    if (isLoading) {
        return (<div className="p-4 font-bold text-center"><span className="text-purple-200">L</span>
            <span className="text-purple-300">o</span>
            <span className="text-purple-400">a</span>
            <span className="text-purple-500">d</span>
            <span className="text-purple-600">i</span>
            <span className="text-purple-700">n</span>
            <span className="text-purple-800">g</span>
            ...</div>);
    }

    if (isError) {
        return <div className="text-red-400">Error fetching drafts: {error.message}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4"><span className="text-indigo-300">Yo</span><span className="text-indigo-400">ur</span><span className="text-indigo-500"> Sav</span><span className="text-indigo-600">ed</span><span className="text-indigo-300"> Dr</span><span className="text-indigo-400">a</span><span className="text-indigo-500">f</span><span className="text-indigo-600">ts</span></h1>
            {drafts?.length === 0 ? (
                <p className="text-gray-400"><span className="text-purple-300">You</span>
                    <span className="text-purple-400"> have</span>
                    <span className="text-purple-500"> no</span>
                    <span className="text-purple-600"> Saved</span>
                    <span className="text-purple-700"> Drafts</span>
                    <span className="text-purple-800">....</span></p>
            ) : (
                <ul className="space-y-4">
                    {drafts?.map((draft) => (
                        <li key={draft._id} className="p-4 border border-indigo-200 rounded shadow-sm flex justify-between items-center hover:scale-95 transition-transform">
                            <div>
                                <Link to={`/contentwrite?draftId=${draft._id}`} className="text-xl text-blue-400 font-semibold hover:underline">
                                    {draft.title || 'Untitled Draft'}
                                </Link>
                                <p className="text-xs text-gray-500">Last saved: {new Date(draft.updatedAt).toLocaleDateString()}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default DraftsDashboard 