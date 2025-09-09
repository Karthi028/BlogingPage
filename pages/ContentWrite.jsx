import { useAuth, useUser } from "@clerk/clerk-react";
import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import Upload from "../components/Upload";
import Image from "../components/Image";

const queryClient = new QueryClient();

const ContentWrite = () => {

  const [searchParams] = useSearchParams();
  const [draftId, setDraftId] = useState(searchParams.get('draftId'));

  const [value, setValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [cover, setcover] = useState('');
  const [tags, setTags] = useState([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('general');
  const [image, setimage] = useState('');
  const [video, setvedio] = useState('');
  const [progress, setprogress] = useState(0)
  const { isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate()

  const { data: draftData, isLoading: isDraftLoading } = useQuery({
    queryKey: ['draft', draftId],
    queryFn: async () => {
      const token = await getToken();
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/Dposts/drafts/${draftId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
    enabled: !!draftId,
  });

  useEffect(() => {
    if (draftData) {
      setTitle(draftData.title || '');
      setDesc(draftData.desc || '');
      setCategory(draftData.category || 'general');
      setValue(draftData.content || '');
      setcover(draftData.img || {});
      setTags(draftData.tags || []);
    }
  }, [draftData]);

  useEffect(() => {
    image && setValue(prev => prev + `<p><image src="${image.url}"/></p>`)
  }, [image])

  useEffect(() => {
    if (video) {
      const videoHtml = `
            <div class="video-container">
                <iframe class="ql-video" src="${video.url}" frameborder="0" allowfullscreen></iframe>
            </div>
        `;
      setValue(prev => prev + `<p>${videoHtml}</p>`);
    }
  }, [video]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate('/login');
    }
  }, [isLoaded, isSignedIn, navigate]);

  const mutation = useMutation({
    mutationFn: async (newPost) => {
      const token = await getToken();
      return axios.post(`${import.meta.env.VITE_API_URL}/posts`, newPost, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    },
    onSuccess: (res) => {
      if (draftId) {
        deleteDraftMutation.mutate(draftId);
      }
      toast.success('Post created Successfully')
      navigate(`/${res.data.post.slug}`)
    }
  })

  const draftMutation = useMutation({
    mutationFn: async (draftPost) => {
      const token = await getToken();
      if (draftId) {
        return axios.put(`${import.meta.env.VITE_API_URL}/Dposts/drafts/${draftId}`, draftPost, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      return axios.post(`${import.meta.env.VITE_API_URL}/Dposts/drafts`, draftPost, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onMutate: () => {
      setIsSaving(true);
      toast.info("Saving draft...");
    },
    onSuccess: (response) => {
      setIsSaving(false);
      console.log(response);

      if (!draftId) {
        const newDraftId = response.data.post._id;
        setDraftId(newDraftId);
        navigate(`/contentwrite?draftId=${newDraftId}`, { replace: true });
      }

      queryClient.invalidateQueries({ queryKey: ['userDrafts'] });
      toast.success("Draft saved successfully!");
    },
  });

  const deleteDraftMutation = useMutation({
    mutationFn: async (draftIdToDelete) => {
      const token = await getToken();
      return axios.delete(`${import.meta.env.VITE_API_URL}/Dposts/drafts/${draftIdToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userDrafts'] });
    },
  });

  const handleTagInput = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const inputValue = e.target.value.trim();
      if (inputValue && !tags.includes(inputValue)) {
        setTags([...tags, inputValue]);
        e.target.value = '';
      }
    }
    if (e.key === ',') {
      e.preventDefault();
      const inputValue = e.target.value.slice(0, -1).trim();
      if (inputValue && !tags.includes(inputValue)) {
        setTags([...tags, inputValue]);
        e.target.value = '';
      }
    }
  };

  const handleAddTagOnBlur = (e) => {
    const inputValue = e.target.value.trim();
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
      e.target.value = '';
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  if (!isLoaded) {
    return <div className="">Loading...</div>;
  }

  const prepareData = () => {
    return {
      title: title,
      desc: desc,
      category: category,
      img: cover || {},
      content: value,
      tags: tags,
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...prepareData(), status: 'published' };
    mutation.mutate(data);
  };

  const handleSaveDraft = (e) => {
    e.preventDefault();
    const data = prepareData();
    draftMutation.mutate(data);

  };

  if (isDraftLoading || draftMutation.isLoading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  const handleDeleteDraft = () => {
    deleteDraftMutation.mutate(draftId);
    toast('Draft Deleted Successfully');
    navigate('/')
  }

  const isUploading = progress > 0 && progress < 100;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-5 items-center justify-between">
        <h1 className="font-light"><span className="text-lime-400 font-semibold text-xl">C</span>reate a
          <span className="text-indigo-500">Ne</span><span className="text-rose-400">w</span>
          <span className="text-cyan-500"> Po</span><span className="text-amber-400">st</span></h1>

        <div className=" mr-3">
          <Link to={'/dashboard/drafts'} className="flex font-light text-lime-600 text-xs">Drafts<img className="ml-1" src="/drafts.png" width={23} alt="Write" /></Link>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1 mb-6">
        <Upload
          type="image"
          setcover={setcover}
          setprogress={setprogress}
        >
          {cover && cover.url ? (
            <Image key={cover.url} src={cover.url} alt="Cover" className="w-32 h-20 object-cover rounded-md shadow-sm" />
          ) : <button type="button" className="w-max p-2 shadow-md rounded-xl text-sm text-gray-500 bg-white">Add a Cover Image</button>}

        </Upload>

        <div className="relative">
          <p className="text-xs absolute -top-3.5 text-red-400">Title:</p>
          <input
            className="text-4xl font-semibold bg-transparent outline-none h-12"
            type='text'
            placeholder="My Story Talks!!"
            name="title"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row md:justify-between md:items-center">
          <div className="flex items-center gap-4">
            <label htmlFor="" className="text-sm font-light">
              Choose a category:
            </label>
            <select
              name="category"
              id=""
              className="p-2 rounded-xl bg-white shadow-md outline-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="general">General</option>
              <option value="Nature">Nature</option>
              <option value="Business">business</option>
              <option value="Technology">Technology</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Science">Science</option>
            </select>
          </div>
          <div className="flex flex-col w-1/2 gap-2">
            <label htmlFor="tags-input" className="text-sm font-light">
              Add tags (Press Enter or comma to add)
            </label>
            <div className="flex flex-nowrap items-center gap-2 p-2 rounded-xl border border-lime-200 shadow-md mb-2 overflow-x-auto">
              {tags.map((tag, index) => (
                <span key={index} className="flex items-center bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded-full">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="ml-1 text-gray-500 hover:text-gray-900 focus:outline-none">
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
                onBlur={handleAddTagOnBlur}
                onKeyUp={(e) => e.key === ',' && (e.target.value = '')}
              />
            </div>
          </div>
        </div>
        <textarea
          className="p-4 mb-2 rounded-xl shadow-md outline-none border border-lime-200"
          name="desc"
          placeholder="A Short Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        <div className="flex">
          <div className="flex flex-col gap-2 mr-3 h-70">
            <Upload
              type="image"
              setcover={setimage}
              setprogress={setprogress}
            >
              <button type="button" className="cursor-pointer"><img src="/photo.png" width={30} alt="upload photo" /></button>
            </Upload>

            <Upload
              type="video"
              setcover={setvedio}
              setprogress={setprogress}
            >
              <button type="button" className="cursor-pointer"><img src="/vedio.png" width={30} alt="upload photo" /></button>
            </Upload>

          </div>
          <ReactQuill
            theme="snow"
            className="flex-1 rounded-xl bg-white shadow-md"
            value={value}
            onChange={setValue}
            readOnly={progress > 0 && progress < 100}
          />
        </div>
        <div className="flex gap-4 items-center mt-10">
          <button type="submit" disabled={mutation.isPending || isUploading} className="bg-lime-400 cursor-pointer text-white font-medium rounded-xl mt-4 p-2 w-36 disabled:bg-lime-100
         disabled:cursor-not-allowed">
            {mutation.isPending ? 'Loading...' : "send"}
          </button>
          <button type="button" onClick={handleSaveDraft} disabled={draftMutation.isPending || isUploading} className="bg-gray-400 cursor-pointer text-white font-medium rounded-xl mt-4 p-2 w-36 disabled:bg-gray-100 disabled:cursor-not-allowed">
            {draftMutation.isPending ? 'Saving...' : "Save Draft"}
          </button>
          {draftId && <button type="button" onClick={handleDeleteDraft} className="cursor-pointer ml-[-12px] mt-[-20px]"><img src="/delete.png" width={20} alt="" /></button>}
        </div>
        {"Progress:" + progress}
      </form>
    </div>
  );
};

export default ContentWrite;