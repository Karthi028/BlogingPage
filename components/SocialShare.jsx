import { useLocation } from "react-router";


const SocialShare = ({ post }) => {
  const location = useLocation();
  const postUrl = `${window.location.origin}${location.pathname}`;
  const postTitle = encodeURIComponent(post.title);
  const postDescription = encodeURIComponent(post.desc);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${postTitle}&url=${postUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${postUrl}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${postUrl}&title=${postTitle}&summary=${postDescription}`,
    whatsapp: `https://api.whatsapp.com/send?text=${postTitle}%20${postUrl}`,
  };

  return (
    <div className="flex gap-4">
      <h3 className="text-sm font-medium text-gray-400">Share on:</h3>
      {/* Twitter */}
      <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer">
        <img src="/twitter.png" alt="Twitter" className="w-6 h-6" />
      </a>
      {/* Facebook */}
      <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer">
        <img src="/facebook.png" alt="Facebook" className="w-6 h-6" />
      </a>
      {/* LinkedIn */}
      <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer">
        <img src="/linkedin.png" alt="LinkedIn" className="w-6 h-6" />
      </a>
      {/* WhatsApp */}
      <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer">
        <img src="/whattsapp.png" alt="WhatsApp" className="w-6 h-6" />
      </a>
    </div>
  );
};

export default SocialShare;