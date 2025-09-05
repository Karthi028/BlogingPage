import { useAuth, useUser } from "@clerk/clerk-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useNavigate } from "react-router"
import { toast } from "react-toastify"
import PostAnalytics from "./PostAnalytics "

const PostmenuActions = ({ post }) => {

  const { user } = useUser()
  const { getToken } = useAuth()
  const navigate = useNavigate();

  const { isPending, error, data: savedPost } = useQuery({
    queryKey: ['savedPosts'],
    queryFn: async () => {
      const token = await getToken();
      return axios.get(`${import.meta.env.VITE_API_URL}/users/saved`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    }
  })

  const isSaved = savedPost?.data?.some(p => p === post._id) || false;
  const isAdmin = user?.publicMetadata?.role === 'admin' || false;
  const isPostOwner = post?.user?.username === user?.username;
  const shouldRender = isPostOwner || isAdmin;

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();

      return axios.delete(`${import.meta.env.VITE_API_URL}/posts/${post._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    },

    onSuccess: () => {
      toast.success('Post deleted Successfully');
      navigate('/')
    },
    onError: (error) => {
      toast.error(error.response.data);
    }
  });

  const queryClient = useQueryClient();

  const savePostMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();

      return axios.put(`${import.meta.env.VITE_API_URL}/users/save`, {
        postId: post._id
      },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedPosts"] })
    },
    onError: (error) => {
      toast.error(error.response.data);
    }
  });

  const featureMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();

      return axios.put(`${import.meta.env.VITE_API_URL}/posts/feature/Star`, {
        postId: post._id
      },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", post.slug] })
    },
    onError: (error) => {
      toast.error(error.response.data);
    }
  });

  const handlefeature = () => {
    featureMutation.mutate()
  }

  const handleDelete = () => {
    toast((t) => (
      <div>
        <p>Are you sure you want to <span className="text-red-600">delete</span>?</p>
        <div className="flex gap-5 ">
          <button className="hover:text-red-500 text-sm font-bold" onClick={() => {
            toast.dismiss(t.id);
            deleteMutation.mutate();
          }}>
            OK
          </button>
          <button className="hover:text-lime-500 text-sm font-bold" onClick={() => toast.dismiss(t.id)}>
            Cancel
          </button>
        </div>
      </div>
    ));
  }

  const likeMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return axios.put(`${import.meta.env.VITE_API_URL}/posts/like/${post._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["post", post.slug] });
    },
    onError: (error) => {
      toast.error(error.response.data);
    }
  });

  const isLiked = post.likes.includes(user?.id);

  const handleLike = () => {
    if (!user) {
      return navigate("/login");
    }
    likeMutation.mutate();
  };

  const handlesave = () => {
    if (!user) {
      return navigate("/login")
    }
    savePostMutation.mutate()
  }


  return (
    <div className="">
      <h1 className="mt-8 mb-4 text-sm font-medium">Actions</h1>
      {user && (
        <div onClick={handleLike} className="flex items-center gap-2 py-2 text-sm cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20px"
            height="20px"
            viewBox="0 0 24 24"
            fill={isLiked ? "red" : "none"}
            stroke={isLiked ? "red" : "gray"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span className="">likes</span>
          <span className="text-sm font-semibold text-gray-500">{post.likes.length}</span>
          {likeMutation.isPending && <span className="text-xs">(in progress)</span>}
        </div>
      )}

      {user ? isPending ? "loading..." : error ? "failed fetching SavedPosts" : <div onClick={handlesave} className="flex items-center gap-2 py-2 text-sm cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          width="20px"
          height="20px"
        >
          <path
            d="M12 4C10.3 4 9 5.3 9 7v34l15-9 15 9V7c0-1.7-1.3-3-3-3H12z"
            stroke={isSaved ? "none" : "rgba(132, 204, 22, 1)"}
            strokeWidth="2"
            fill={isSaved ? "rgba(132, 204, 22, 1)" : "none"}
          />
        </svg>
        <span>Save this Post</span>
        {savePostMutation.isPending && <span className="text-xs">(in progress)</span>}
      </div> : ''}


      {isAdmin && <div onClick={handlefeature} className="flex items-center gap-2 py-2 text-sm cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          width="20px"
          height="20px"
        >
          <path
            d="M24 2L29.39 16.26L44 18.18L33 29.24L35.82 44L24 37L12.18 44L15 29.24L4 18.18L18.61 16.26L24 2Z"
            stroke={post.isFeatured ? "none" : "rgba(132, 204, 22, 1)"}
            strokeWidth="2"
            fill={featureMutation.isPending ? post.isFeatured ? "none" : "rgba(132, 204, 22, 1)" : post.isFeatured ? "rgba(132, 204, 22, 1)" : "none"}
          />
        </svg>
        <span>Feature</span>
        {featureMutation.isPending && <span className="text-xs">(in progress)</span>}
      </div>}

      {user && (post.user.username === user.username || isAdmin) && <div onClick={handleDelete} className="flex items-center gap-2 py-2 text-sm cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 50 50"
          fill="red"
          width="20px"
          height="20px"
        >
          <path d="M 21 2 C 19.354545 2 18 3.3545455 18 5 L 18 7 L 10.154297 7 A 1.0001 1.0001 0 0 0 9.984375 6.9863281 A 1.0001 1.0001 0 0 0 9.8398438 7 L 8 7 A 1.0001 1.0001 0 1 0 8 9 L 9 9 L 9 45 C 9 46.645455 10.354545 48 12 48 L 38 48 C 39.645455 48 41 46.645455 41 45 L 41 9 L 42 9 A 1.0001 1.0001 0 1 0 42 7 L 40.167969 7 A 1.0001 1.0001 0 0 0 39.841797 7 L 32 7 L 32 5 C 32 3.3545455 30.645455 2 29 2 L 21 2 z M 21 4 L 29 4 C 29.554545 4 30 4.4454545 30 5 L 30 7 L 20 7 L 20 5 C 20 4.4454545 20.445455 4 21 4 z M 11 9 L 18.832031 9 A 1.0001 1.0001 0 0 0 19.158203 9 L 30.832031 9 A 1.0001 1.0001 0 0 0 31.158203 9 L 39 9 L 39 45 C 39 45.554545 38.554545 46 38 46 L 12 46 C 11.445455 46 11 45.554545 11 45 L 11 9 z M 18.984375 13.986328 A 1.0001 1.0001 0 0 0 18 15 L 18 40 A 1.0001 1.0001 0 1 0 20 40 L 20 15 A 1.0001 1.0001 0 0 0 18.984375 13.986328 z M 24.984375 13.986328 A 1.0001 1.0001 0 0 0 24 15 L 24 40 A 1.0001 1.0001 0 1 0 26 40 L 26 15 A 1.0001 1.0001 0 0 0 24.984375 13.986328 z M 30.984375 13.986328 A 1.0001 1.0001 0 0 0 30 15 L 30 40 A 1.0001 1.0001 0 1 0 32 40 L 32 15 A 1.0001 1.0001 0 0 0 30.984375 13.986328 z" />
        </svg>
        <span>Delete this Post</span>
        {deleteMutation.isPending && <span className="text-xs">(in progress)</span>}

      </div>}
      {shouldRender && <div><PostAnalytics post={post} /></div>}


    </div>
  )
}

export default PostmenuActions