// src/app/api/postfrutier/route.js
import PostFrutier from '../../../models/Postfrutier';
import connect from '../../../utils/db';
import { NextResponse } from 'next/server';
import { useSession } from "next-auth/react";

export async function POST(request) {
    const { userEmail, title, content } = await request.json();
    await connect();
    await PostFrutier.create({ userEmail, title, content });
    return NextResponse.json({ message: 'Product Created' }, { status: 201 });
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('userEmail');

    if (!userEmail) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connect();
    const posts = await PostFrutier.find({ userEmail });
    return NextResponse.json({ posts });
}

export async function DELETE(request) {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
        return NextResponse.json({ message: 'Post ID is required' }, { status: 400 });
    }

    await connect();
    const deletedPost = await PostFrutier.findByIdAndDelete(postId);

    if (!deletedPost) {
        return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
}