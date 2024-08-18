import React from "react";
import { Link } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";


function ListingItems({ listing }) {
  console.log("list :  ", listing);
  return (
    <div className="flex flexrow flex-wrap gap-4 justify-center">
      <div className="m-3 shadow-md   hover:shadow-lg w-full sm:w-[300px] rounded-lg bg-slate-100 overflow-hidden flex flex-col gap-4 border">
        <Link to={`/listing/${listing._id}`}>
          <img
            className="  transition-scale duration-300  rounded-lg h-[300px] sm:h-[220px]  hover:scale-105"
            src={listing.imageUrls[0]}
            alt=""
          />
        </Link>

        <div className="w-full flex flex-col gap-3 p-2">
          <p className=" w-[300px] truncate text-lg font-semibold text-slate-700">
            {listing.name}
          </p>
          <div className="flex items-center  gap-1 ">
            <FaLocationDot className="text-green-500 w-4 h-4" />
            <p className=" truncate text-sm  text-gray-600">
              {listing.address}
            </p>
          </div>
          <p className="line-clamp-2">
            {listing.description}
            
           
          </p>
          <p className=" text-slate-700 font-semibold ">${listing.offer?listing.discountedPrice.toLocaleString('en-US'):listing.regularPrice.toLocaleString('en-US')}
          { listing.type==='rent'&& ' /month'}
          </p>
          <div className="flex gap-4 text-slate-700 font-bold text-xs">
            <p>{listing.bedrooms===1? `${listing.bedrooms} bed`:`${listing.bedrooms} beds`}</p>
            <p>{listing.bathroom===1? `${listing.bathroom} bath`:`${listing.bathroom} baths`}</p>

          </div>
        </div>
      </div>
      </div>
    
  );
}

export default ListingItems;

// for show ... after 2 lines or three as you want bcz in normally after one line we can show ... if we need . after 2,3 lines we need this liubrary

// npm install -D @tailwindcss/line-clamp
