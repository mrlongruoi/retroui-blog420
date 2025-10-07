import { assets } from '@/Assets/assets'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const BlogItem = ({title,description,category,image,id,priority=false}) => {

  // ensure specific known LCP images (like the Next.js demo image in /public)
  // are treated as priority even if parent didn't mark them
  const imageSrc = typeof image === 'string' ? image : (image?.src || '');
  const autoPriority = imageSrc.includes('nextjs');
  const finalPriority = priority || autoPriority;

  return (
    <div className='max-w-[330px] sm:max-w-[300px] bg-white border border-black transition-all hover:shadow-[-7px_7px_0px_#000000]'>
  <Link href={`/blogs/${id}`}>
  <Image src={image} alt={title || 'blog image'} width={400} height={400} className='border-b border-black' priority={finalPriority} />
  </Link>
      <p className='ml-5 mt-5 px-1 inline-block bg-black text-white text-sm'>{category}</p>
      <div className="p-5">
        <h5 className='mb-2 text-lg font-medium tracking-tight text-gray-900'>{title}</h5>
        <p className='mb-3 text-sm tracking-tight text-gray-700' dangerouslySetInnerHTML={{"__html":description.slice(0,120)}}></p>
        <Link href={`/blogs/${id}`} className='inline-flex items-center py-2 font-semibold text-center'>
            Read more <Image src={assets.arrow} className='ml-2' alt='' width={12} />
        </Link>
      </div>
    </div>
  )
}

export default BlogItem
