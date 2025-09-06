import Lottie from 'react-lottie';

const Anime = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    path:'/Anime.json',
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="w-64 h-64">
        <Lottie
          options={defaultOptions}
          height={256}
          width={256}
        />
      </div>
    </div>
  );
};

export default Anime;