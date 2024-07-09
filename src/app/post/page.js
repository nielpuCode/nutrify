// this is my src/app/post/page.js
"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";

const NewPostPage = () => {
    const [userEmail, setUserEmail] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session?.user?.email) {
            setUserEmail(session.user.email);
        }
    }, [session]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/postfrutier', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userEmail,
                    title,
                    content,
                }),
            });
            if (res.status === 400) {
                console.log('Error email is not registered');
            }
            if (res.status === 200) {
                router.push('/');
            }
            router.push('/viewpost');
        } catch (error) {
            console.log('Error creating post, try again');
            console.log(error);
        }
    };

    return (
        <div className="max-w-md mx-auto my-10 p-6 bg-white shadow-md rounded-md">
            <h1 className="text-3xl font-bold mb-5 text-center text-purple-700">Create a New Post</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <input
                        type="text"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="hidden mt-1 p-3 border text-black border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Your Email"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 p-3 border text-black border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Post Title"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Content</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="mt-1 p-3 border text-black border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Write your content here..."
                        rows="5"
                    ></textarea>
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800 transition-all duration-300 ease-in-out w-full"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default NewPostPage;
