import { ConnectDB } from "@/lib/config/db"
import BlogModel from "@/lib/models/BlogModel";
import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import fs from 'fs'


// API Endpoint to get all blogs
export async function GET(request) {
  try {
    await ConnectDB();

    const blogId = request.nextUrl.searchParams.get("id");
    if (blogId) {
      const blog = await BlogModel.findById(blogId);
      if (!blog) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json(blog);
    } else {
      const blogs = await BlogModel.find({});
      return NextResponse.json({ blogs });
    }
  } catch (err) {
    console.error('GET /api/blog error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


// API Endpoint For Uploading Blogs
export async function POST(request) {
  try {
    await ConnectDB();

    const formData = await request.formData();
    const timestamp = Date.now();

    const image = formData.get('image');
    if (!image || typeof image.name !== 'string') {
      return NextResponse.json({ error: 'Invalid image' }, { status: 400 });
    }

    const imageByteData = await image.arrayBuffer();
    const buffer = Buffer.from(imageByteData);
    const path = `./public/${timestamp}_${image.name}`;
    await writeFile(path, buffer);
    const imgUrl = `/${timestamp}_${image.name}`;

    const blogData = {
      title: `${formData.get('title')}`,
      description: `${formData.get('description')}`,
      category: `${formData.get('category')}`,
      author: `${formData.get('author')}`,
      image: `${imgUrl}`,
      authorImg: `${formData.get('authorImg')}`
    }

    await BlogModel.create(blogData);
    console.log("Blog Saved");

    return NextResponse.json({ success: true, msg: "Blog Added" });
  } catch (err) {
    console.error('POST /api/blog error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Creating API Endpoint to delete Blog

export async function DELETE(request) {
  try {
    await ConnectDB();

    const id = await request.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

    const blog = await BlogModel.findById(id);
    if (!blog) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // delete image file if exists
    const imagePath = `./public${blog.image}`;
    try {
      await fs.promises.unlink(imagePath);
    } catch (e) {
      // ignore file unlink errors, but log them
      console.warn('Failed to unlink image:', imagePath, e.message || e);
    }

    await BlogModel.findByIdAndDelete(id);
    return NextResponse.json({ msg: "Blog Deleted" });
  } catch (err) {
    console.error('DELETE /api/blog error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}