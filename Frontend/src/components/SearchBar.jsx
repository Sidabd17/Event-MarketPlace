import { Search } from 'lucide-react';
import React, { useState } from 'react'
import SearchBarDialog from './SearchBarDialog';

const SearchBar = () => {
    const [open , setOpen] = useState(false);
  return (
    <>
    <div className='flex items-center gap-2 rounded-md w-[200px] sm:w-[200px] md:w-[310px] px-2 py-1 border-1 border-gray-400'>
        <Search />
        <input type="text"
          placeholder='Search for events, movies or plays'
          className='w-full h-full p-2 outline-none cursor-pointer' 
          onFocus={()=>{setOpen(true)}} />
    </div>

    {
        open && <SearchBarDialog open={open} setOpen={setOpen} />
    }
    </>
  )
}

export default SearchBar