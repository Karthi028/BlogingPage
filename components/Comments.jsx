import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";
import { format } from "timeago.js";

const Comments = ({ postId }) => {

  const { getToken } = useAuth();
  const { isLoaded, isSignedIn, user } = useUser();
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentDesc, setEditedCommentDesc] = useState('');

  const { isPending, error, data: comments } = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const token = await getToken();
      return axios.get(`${import.meta.env.VITE_API_URL}/comments/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
    }
  })


  const queryClient = useQueryClient();

  const addCommentMutation = useMutation({
    mutationFn: async (newComment) => {
      const token = await getToken();
      return axios.post(`${import.meta.env.VITE_API_URL}/comments/${postId}`, newComment, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
    },
    onError: (error) => {
      toast.error(error.response.data)
    }
  })

  const editCommentMutation = useMutation({
    mutationFn: async ({ commentId, desc }) => {
      const token = await getToken();
      return axios.put(`${import.meta.env.VITE_API_URL}/comments/${commentId}`, { desc: desc }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    },
    onSuccess: () => {
      setEditingCommentId(null);
      setEditedCommentDesc('');
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
    onError: (err) => {
      toast.error('Failed to update comment: ' + err.message);
    }
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId) => {
      const token = await getToken();
      return axios.delete(`${import.meta.env.VITE_API_URL}/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      toast.success('Comment deleted successfully!');
    },
    onError: (err) => {
      toast.error('Failed to delete comment: ' + err.message);
    }
  });

  const markAsSpamMutation = useMutation({
    mutationFn: async (commentId) => {
      const token = await getToken();
      return axios.put(`${import.meta.env.VITE_API_URL}/comments/${commentId}/spam`, { isSpam: true }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      toast.success('Comment marked as spam!');
    },
    onError: (err) => {
      toast.error('Failed to mark comment as spam: ' + err.message);
    }
  });

  const restoreCommentMutation = useMutation({
    mutationFn: async (commentId) => {
      const token = await getToken();
      return axios.put(`${import.meta.env.VITE_API_URL}/comments/${commentId}/restore`, { isSpam: false }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      toast.success('Comment restored successfully!');
    },
    onError: (err) => {
      toast.error('Failed to restore comment: ' + err.message);
    }
  });

  const handleEditClick = (comment) => {
    setEditingCommentId(comment._id);
    setEditedCommentDesc(comment.desc);
  };

  const handleSaveEdit = (commentId) => {
    if (editedCommentDesc.trim()) {
      editCommentMutation.mutate({ commentId, desc: editedCommentDesc });
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedCommentDesc('');
  };

  const handleDeleteClick = (commentId) => {
    toast((t) => { 
      return (
        <div>
          <p>Are you sure you want to <span className="text-red-600">delete</span>?</p>
          <div className="flex gap-5">
            <button
              className="hover:text-red-500 text-sm font-bold"
              onClick={() => {
                toast.dismiss(t.id);
                deleteCommentMutation.mutate(commentId);
              }}
            >
              OK
            </button>
            <button
              className="hover:text-lime-500 text-sm font-bold"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </div>
      );
    });
  };

  const handleMarkAsSpam = (commentId) => {
    markAsSpamMutation.mutate(commentId);
  };

  const handleRestoreComment = (commentId) => {
    restoreCommentMutation.mutate(commentId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const desc = formData.get('desc');
    if (desc) {
      addCommentMutation.mutate({ desc });
      e.target.reset();
    }

  }

  if (isPending || !isLoaded) {
    return (<div className="p-4 font-bold text-center"><span className="text-purple-200">L</span>
      <span className="text-purple-300">o</span>
      <span className="text-purple-400">a</span>
      <span className="text-purple-500">d</span>
      <span className="text-purple-600">i</span>
      <span className="text-purple-700">n</span>
      <span className="text-purple-800">g</span>
      <span className="text-purple-300"> C</span>
      <span className="text-purple-400">o</span>
      <span className="text-purple-500">m</span>
      <span className="text-purple-600">m</span>
      <span className="text-purple-700">e</span>
      <span className="text-purple-800">n</span>
      <span className="text-purple-700">t</span>
      <span className="text-purple-800">s</span>
      ...</div>);
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Something went wrong: {error.message}</div>;
  }


  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Comments</h2>
      <form onSubmit={handleSubmit} className="flex items-center justify-between gap-8 w-full">
        <textarea
          name="desc"
          placeholder="Write a comment..."
          className="w-full p-4 rounded-xl bg-lime-50 outline-lime-300"
        />
        <button
          type="submit"
          className="bg-lime-500 px-4 py-3 text-white font-medium rounded-xl cursor-pointer disabled:cursor-not-allowed"
          disabled={!isSignedIn || addCommentMutation.isPending}
        >
          {addCommentMutation.isPending ? 'Sending...' : 'Send'}
        </button>
      </form>
      {comments.data.map((comment) => {
        const isAuthor = isSignedIn && user && comment.user && user.id === comment.user.clerkUserId;
        const isAdmin = isSignedIn && user && user.publicMetadata && user.publicMetadata.role === 'admin';
        const canEdit = isAuthor;
        const canDelete = isAuthor || isAdmin;
        const canModerate = isAdmin;
        const isEditing = editingCommentId === comment._id;

        return (
          <div key={comment._id} className="p-4 border border-lime-200 rounded-xl mb-3">
            <div className="flex items-center gap-4">
              {comment.user.img && <img
                src={comment.user.img}
                className="w-6 h-6 rounded-full object-cover"
                w="40"
              />}
              <p className="font-semibold text-gray-500">{comment.user.username}</p>
              <p className="text-gray-400">{format(comment.createdAt)}</p>
              {(canEdit || canDelete || canModerate) && (
                <div className="flex items-center space-x-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(comment._id)}
                        className="text-lime-600 hover:text-lime-500 hover:font-semibold"
                        disabled={editCommentMutation.isPending}
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-gray-500 hover:font-semibold"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    canEdit && (
                      <button
                        onClick={() => handleEditClick(comment)}
                        className="text-gray-500 hover:text-gray-700 hover:font-semibold"
                      >
                        Edit
                      </button>
                    )
                  )}
                  {canModerate && !comment.isSpam && (
                    <button
                      onClick={() => handleMarkAsSpam(comment._id)}
                      className="text-orange-500 hover:text-orange-700"
                      disabled={markAsSpamMutation.isPending}
                    >
                      Spam
                    </button>
                  )}
                  {canModerate && comment.isSpam && (
                    <button
                      onClick={() => handleRestoreComment(comment._id)}
                      className="text-green-500 hover:text-green-700"
                      disabled={restoreCommentMutation.isPending}
                    >
                      Restore
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => handleDeleteClick(comment._id)}
                      className="text-red-500 hover:font-semibold"
                      disabled={deleteCommentMutation.isPending}
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
            {isEditing ? (
              <textarea
                value={editedCommentDesc}
                onChange={(e) => setEditedCommentDesc(e.target.value)}
                className="w-full p-2 mt-2 rounded-lg border-2 border-lime-300 focus:outline-none focus:border-lime-500"
                rows="3"
              ></textarea>
            ) : (
              <p className="mt-2 text-gray-500">{comment.desc}</p>
            )}
          </div>
        );
      })}
    </div>
  )
}

export default Comments