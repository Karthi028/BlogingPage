import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PostAnalytics = ({ post }) => {
    if (!post) {
        return null;
    }

    const data = [
        { name: 'Views', value: post.views },
        { name: 'Likes', value: post.likes.length },
        { name: 'Comments', value: post.comments }
    ];

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
        </div>
    );
};

export default PostAnalytics;