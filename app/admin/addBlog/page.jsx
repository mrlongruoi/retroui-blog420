'use client'
import { assets } from '@/Assets/assets'
import axios from 'axios'
import Image from 'next/image'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

const Page = () => {

  const [image,setImage] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
      if (!image) {
        setPreviewUrl(null);
        return;
      }

      const url = URL.createObjectURL(image);
      setPreviewUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }, [image]);
    const [data,setData] = useState({
        title:"",
        description:"",
        category:"Startup",
        author:"Alex Bennett",
        authorImg:"/author_img.png"
    })

    const onChangeHandler = (event) =>{
        const name = event.target.name;
        const value = event.target.value;
        setData(data=>({...data,[name]:value}));
        console.log(data);
    }

  const onSubmitHandler = async (e) =>{
        e.preventDefault();
        const formData = new FormData();
        formData.append('title',data.title);
        formData.append('description',data.description);
        formData.append('category',data.category);
        formData.append('author',data.author);
        formData.append('authorImg',data.authorImg);
        formData.append('image',image);
        const response = await axios.post('/api/blog',formData);
        if (response.data.success) {
            toast.success(response.data.msg);
            setImage(false);
            setData({
              title:"",
              description:"",
              category:"Startup",
              author:"Alex Bennett",
              authorImg:"/author_img.png"
            });
        }
        else{
            toast.error("Error");
        }
    }

  return (
    <>
      <form onSubmit={onSubmitHandler} className='pt-5 px-5 sm:pt-12 sm:pl-16'>
        <p className='text-xl'>Upload thumbnail</p>
        <label htmlFor="image">
          {image ? (
            // File preview: use a normal <img> to avoid next/image optimization/warnings for object URLs
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className='mt-4 w-auto h-auto object-contain border'
              src={previewUrl}
              width={140}
              height={70}
              alt="preview"
            />
          ) : (
            // static asset: use next/image with fill inside a fixed-size wrapper to avoid CSS size mismatch warnings
            <div className='mt-4 border' style={{ width: 140, height: 70, position: 'relative' }}>
              <Image src={assets.upload_area} alt='upload area' fill sizes="140px" style={{ objectFit: 'contain' }} />
            </div>
          )}
        </label>
  <input onChange={(e)=>setImage(e.target.files[0])} type="file" id='image' hidden required />
        <p className='text-xl mt-4'>Blog title</p>
        <input name='title' onChange={onChangeHandler} value={data.title} className='w-full sm:w-[500px] mt-4 px-4 py-3 border' type="text" placeholder='Type here' required />
        <p className='text-xl mt-4'>Blog Description</p>
        <textarea name='description' onChange={onChangeHandler} value={data.description} className='w-full sm:w-[500px] mt-4 px-4 py-3 border' type="text" placeholder='write content here' rows={6} required />
        <p className='text-xl mt-4'>Blog category</p>
        <select name="category" onChange={onChangeHandler} value={data.category} className='w-40 mt-4 px-4 py-3 border text-gray-500'>
            <option value="Startup">Startup</option>
            <option value="Technology">Technology</option>
            <option value="Lifestyle">Lifestyle</option>
        </select>
        <br />
        <button type="submit" className='mt-8 w-40 h-12 bg-black text-white'>ADD</button>
      </form>
    </>
  )
}

export default Page
