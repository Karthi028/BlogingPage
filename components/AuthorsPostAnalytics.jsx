import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AuthorsPostAnalytics = ({ posts }) => {
    if (!posts || posts.length === 0) {
        return null;
    }

    // Aggregate data from all posts
    const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
    const totalLikes = posts.reduce((sum, post) => sum + (post.likes ? post.likes.length : 0), 0);
    const totalComments = posts.reduce((sum, post) => sum + (post.comments || 0), 0);

    const data = [
        { name: 'Total Views', value: totalViews },
        { name: 'Total Likes', value: totalLikes },
        { name: 'Total Comments', value: totalComments }
    ];

    console.log(totalComments);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-8 mb-5 recharts-container-wrapper">
            <h2 className="text-xl font-bold mb-4">Author Performance Analytics</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 20, right: 5, left: 5, bottom: 5 }}>
                    <defs>
                        <linearGradient id="gradientViolet" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#c4b5fd" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="url(#gradientViolet)" />
                </BarChart>
            </ResponsiveContainer>
            <div className="mt-6 flex justify-around text-center">
                <div className="p-2 flex items-center gap-1 ">
                    <p className="text-gray-500 font-semibold text-sm">TotalViews: </p>
                    <p className="text-sm font-bold text-gray-800">{totalViews}</p>
                </div>
                <div className="p-2 flex items-center gap-1">
                    <p className="text-gray-500 font-semibold text-sm">TotalLikes: </p>
                    <p className="text-sm font-bold text-gray-800">{totalLikes}</p>
                </div>
                <div className="p-2 flex items-center gap-1">
                    <p className="text-gray-500 font-semibold text-sm">TotalComments: </p>
                    <p className="text-sm font-bold text-gray-800">{totalComments}</p>
                </div>
            </div>
        </div>
    );
};

export default AuthorsPostAnalytics;