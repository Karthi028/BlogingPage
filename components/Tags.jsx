import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";


const fetchPost = async (slug) => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${slug}`);
    return response.data;
};

const Tags = () => {
    const queryClient = useQueryClient();
    const [tags, setTags] = useState([]);
    const { isLoaded, isSignedIn, user } = useUser();
    const { slug } = useParams();
    const { getToken } = useAuth();

    const { isPending, error, data } = useQuery({
        queryKey: ['post', slug],
        queryFn: () => fetchPost(slug),
    });

    useEffect(() => {
        if (data && data.tags) {
            setTags(data.tags);
        }
    }, [data]);

    const mutation = useMutation({
        mutationFn: async (updatedTags) => {
            const token = await getToken();
            return axios.put(`${import.meta.env.VITE_API_URL}/posts/${slug}`, { tags: updatedTags }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['post', slug] });
            toast.success('Post tags updated successfully');
        },
        onError: (err) => {
            toast.error('Failed to update tags: ' + err.message);
        }
    });

    if (isPending || !isLoaded) {
        return <div className="p-4 text-center">Loading...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-500">Something went wrong: {error.message}</div>;
    }

    const isAuthor = isSignedIn && data.user && user.id === data.user.clerkUserId;
    if (!isAuthor) {
        return (<>
            {data.tags && data.tags.length > 0 && (<div className="flex flex-wrap gap-2 text-sm ">

                <div className="flex flex-wrap gap-2 text-sm">
                    {data.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="bg-lime-200 text-lime-800 px-3 py-1 rounded-full text-xs font-semibold"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

            </div>)}
        </>);
    }

    const handleTagInput = (e) => {
        const inputValue = e.target.value.trim();
        if ((e.key === 'Enter' || e.key === ',') && inputValue) {
            e.preventDefault();
            if (!tags.includes(inputValue)) {
                setTags([...tags, inputValue]);
            }
            e.target.value = '';
        }
    };

    const removeTag = (tagToRemove) => {
        const updatedTags = tags.filter(tag => tag !== tagToRemove);
        setTags(updatedTags);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate(tags);
    };

    return (
        <form onSubmit={handleSubmit} className="">
            <div className="flex flex-col w-full max-w-lg gap-2">
                <label htmlFor="tags-input" className="text-sm font-light">
                    Add tags (Press Enter or comma to add)
                </label>
                <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl border border-lime-200 shadow-md mb-2">
                    {tags.map((tag, index) => (
                        <span key={index} className="flex items-center bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded-full">
                            {tag}
                            <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="ml-1 text-gray-500 hover:text-gray-900 focus:outline-none"
                            >
                                &times;
                            </button>
                        </span>
                    ))}
                    <input
                        id="tags-input"
                        className="flex-grow p-2 outline-none rounded-xl"
                        type="text"
                        placeholder="e.g., programming, webdev"
                        onKeyDown={handleTagInput}
                        onKeyUp={(e) => e.key === ',' && (e.target.value = '')}
                    />
                </div>
            </div>
            <button
                type="submit"
                className="bg-lime-500 text-white px-4 py-2 rounded-lg font-semibold disabled:bg-gray-400"
                disabled={mutation.isPending}
            >
                {mutation.isPending ? "Updating..." : "Update Tags"}
            </button>
        </form>
    );
};

export default Tags;
