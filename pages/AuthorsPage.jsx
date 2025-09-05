import { useState } from "react"
import Postlists from "../components/Postlists"
import Sidemenu from "../components/Sidemenu"
import { Link, useSearchParams } from "react-router";
import AuthorsPostAnalytics from "../components/AuthorsPostAnalytics";
import axios from "axios";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/clerk-react";
import UserSubscribe from "../components/UserSubscribe";


const fetchPosts = async (pageParam, searchParams) => {

    const searchParamsObj = Object.fromEntries([...searchParams]);

    const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
        params: { page: pageParam, limit: 1000, ...searchParamsObj }
    });
    return res.data;
}

const AuthorsPage = () => {
    const [open, setopen] = useState(false);
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [newBio, setNewBio] = useState('');
    const queryClient = useQueryClient();
    const [showSubscriptions, setShowSubscriptions] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const { user } = useUser();
    const { getToken, isLoaded, isSignedIn } = useAuth();
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ['posts', searchParams.toString()],
        queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam, searchParams),
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => lastPage.hasMore ? pages.length + 1 : undefined,
    })

    const { data: subscriptions, status: subscriptionsStatus } = useQuery({
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

    const updateBioMutation = useMutation({
        mutationFn: async (updatedBio) => {
            const token = await getToken();
            return axios.put(`${import.meta.env.VITE_API_URL}/users/bio`,
                { bio: updatedBio },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['posts', searchParams.toString()]);
            setIsEditingBio(false);
        },
        onError: (error) => {
            console.error("Failed to update bio:", error);
        }
    });

    const handleSaveBio = () => {
        if (newBio.length > 0) {
            updateBioMutation.mutate(newBio);
        }
    };

    const allPosts = data?.pages?.flatMap((page) => page.posts) || [];
    const isMyDashboard = user?.username === searchParams.get('author');
    const subscribe = user?.username !== searchParams.get('author');

    if (status === "loading") return 'Loading...'

    if (status === "error") return 'An error has occurred';

    const ShowStats = allPosts[0]?.user.username === user?.username;

    return (
        <div className="">
            <h1 className="mb-5 text-2xl text-gray-500 font-semibold">Bloging is So Fun!!!</h1>
            <button className="md:hidden font-bold text-sm text-white px-4 py-2 rounded-2xl mb-4 bg-gradient-to-r from-lime-300 to-lime-500" onClick={() => setopen(prev => !prev)}>{open ? "Close" : "Filter or Search"}</button>
            <div className="flex flex-col-reverse md:flex-row gap-8">
                <div className="">
                    <Postlists />
                </div>
                <div className={`${open ? "block" : 'hidden'} md:block`}>
                    <div className="flex items-center gap-3 px-4">
                        {allPosts[0]?.user.img ? <img
                            src={allPosts[0].user.img}
                            className="w-12 h-12 rounded-full object-cover"
                            w="40"
                            h="40"
                        /> : user?.imageUrl && <img
                            src={user.imageUrl}
                            className="w-12 h-12 rounded-full object-cover"
                            w="40"
                            h="40"
                        />}
                        <h1 className="text-lime-500 font-serif text-4xl font-bold">{allPosts[0]?.user.username || user?.username}</h1>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 px-4 mb-1">
                        {isMyDashboard && isEditingBio ? (
                            <textarea
                                value={newBio}
                                onChange={(e) => setNewBio(e.target.value)}
                                className="w-full h-24 p-2 border rounded-md"
                                placeholder="Edit your bio..."
                            />
                        ) : (
                            <p>
                                {allPosts[0]?.user?.bio || "Nor is there anyone who loves, pursues, or desires pain itself, because it is pain..."}
                            </p>
                        )}
                    </p>
                    {isMyDashboard && (
                        <div className="px-4 mt-2">
                            {isEditingBio ? (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSaveBio}
                                        disabled={updateBioMutation.isLoading}
                                        className="px-1 py-1 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-lime-300 to-lime-500 hover:opacity-80 transition-opacity duration-300"
                                    >
                                        {updateBioMutation.isLoading ? "Saving..." : "Save Bio"}
                                    </button>
                                    <button
                                        onClick={() => setIsEditingBio(false)}
                                        className="px-1 py-1 text-sm font-semibold rounded-lg text-gray-500 bg-gray-200 hover:bg-gray-300 transition-colors duration-300"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => {
                                        setIsEditingBio(true);
                                        setNewBio(allPosts[0]?.user?.bio || '');
                                    }}
                                    className="px-1 py-1 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-violet-300 to-violet-500 hover:opacity-80 transition-opacity duration-300"
                                >
                                    Edit Bio
                                </button>
                            )}
                        </div>
                    )}
                    {subscribe && <div className="px-4 mt-2 mb-2"><UserSubscribe bloggerId={allPosts[0]?.user?._id} clerkUserId={allPosts[0]?.user?.clerkUserId} /></div>}
                    {ShowStats && <AuthorsPostAnalytics posts={allPosts} />}
                    {isMyDashboard && (
                        <div className="mt-4 px-4">
                            <button
                                onClick={() => setShowSubscriptions(prev => !prev)}
                                className="w-full text-sm font-semibold text-white px-4 py-2 rounded-lg bg-gradient-to-r from-violet-300 to-violet-500 hover:opacity-80 transition-opacity duration-300"
                            >
                                {showSubscriptions ? "Hide Subscriptions" : "Show Subscriptions"}
                            </button>

                            {showSubscriptions && subscriptionsStatus === 'loading' && <p>Loading subscriptions...</p>}
                            {showSubscriptions && subscriptionsStatus === 'success' && (
                                <div className="mt-1 mb-4 rounded-2xl p-2 ">
                                    <h3 className="text-lg font-bold mb-2"><span className="text-indigo-300">Sub</span><span className="text-indigo-400">scr</span><span className="text-indigo-500">ibed </span><span className="text-indigo-600">Auth</span><span className="text-indigo-700">ors</span></h3>
                                    {subscriptions.length > 0 ? (
                                        <ul className="list-disc ml-2 marker:text-lime-500 ">
                                            {subscriptions.map(author => (
                                                <li key={author._id} className="mb-1">
                                                    <Link to={`/authorsPage?author=${author.username}`} className="text-blue-400 font-bold hover:underline">
                                                        {author.username}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500">You are not subscribed to any authors.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                    <Sidemenu />
                </div>
            </div>
        </div>
    )
}

export default AuthorsPage