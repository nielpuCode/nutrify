// src/pages/ViewPost.js
"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewPostPage = () => {
    const { data: session, status } = useSession();
    const [posts, setPosts] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            if (session) {
                try {
                    const res = await fetch(`/api/postfrutier?userEmail=${session.user.email}`);
                    if (res.status === 200) {
                        const data = await res.json();
                        setPosts(data.posts);
                    }
                } catch (error) {
                    console.error('Error fetching posts:', error);
                }
            }
        };

        fetchData();
    }, [status, session]);

    const handleDelete = async (postId) => {
        const confirmed = window.confirm('Are you sure you want to delete this post?');
        if (!confirmed) {
            return;
        }

        try {
            const res = await fetch(`/api/postfrutier?postId=${postId}`, {
                method: 'DELETE',
            });
            if (res.status === 200) {
                setPosts(posts.filter(post => post._id !== postId));
                toast.success('Post deleted successfully');
            } else {
                toast.error('Failed to delete post');
                console.error('Failed to delete post');
            }
        } catch (error) {
            toast.error('Error deleting post');
            console.error('Error deleting post:', error);
        }
    };

    if (status === 'loading') return <div className="flex items-center justify-center h-screen">Loading...</div>;
    if (status === 'unauthenticated') {
        router.push('/login');
    }

    return (
        <div className="max-w-2xl mx-auto my-10 p-6 bg-white shadow-md rounded-md">
            <ToastContainer />
            <Link href="/post" className="text-white px-3 py-2 rounded-lg bg-purple-700 hover:bg-purple-900 mb-4 block text-center">Create a Post</Link>
            <h1 className="text-4xl font-bold mb-5 text-center text-purple-700">Your Posts</h1>
            {posts.length === 0 && <p className="text-gray-600 text-center">No posts found.</p>}
            {posts.map((post) => (
                <div key={post._id} className="border rounded-lg p-6 mb-4 shadow-md">
                    <h2 className="text-2xl font-semibold mb-2 text-purple-600">{post.title}</h2>
                    <p className="text-gray-800">{post.content}</p>
                    <button
                        onClick={() => handleDelete(post._id)}
                        className="bg-red-500 text-white px-4 py-2 mt-4 rounded hover:bg-red-600"
                    >
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ViewPostPage;
