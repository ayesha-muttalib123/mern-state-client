import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import { useParams } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import { FaBed } from "react-icons/fa";
import { FaBath } from "react-icons/fa6";
import { FaSquareParking } from "react-icons/fa6";
import { FaChair } from "react-icons/fa6";
import { useSelector } from "react-redux";


import Contacts from "../componenets/Contacts.jsx";



function Listing() {
  const { listingId } = useParams();
  const  [contact,setcontact]=useState(false)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [listing, setListing] = useState(null);
  const {currentUser}=useSelector((state)=>state.user)
  console.log("cId: "+currentUser._id)

  console.log("Listing ID:", listingId);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/listing/get/${listingId}`);
        const data = await response.json();

        if (!data || data.success === false) {
          setError("Listing not found");
          setLoading(false);
          return;
        }

        setListing(data.listings);
        setError(null);
        setLoading(false);
      } catch (error) {
        setError("Error fetching listing");
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

  useEffect(() => {
    console.log("Fetched listing:", listing);
  }, [listing]);

  return (
    <div className="m-20 items-center">
      {loading ? (
        <div className="text-center text-green-700 text-2xl m-7 font-bold">
          Loading...
        </div>
      ) : error ? (
        <div className="text-center text-red-700 text-2xl m-7 font-bold">
          Error: {error}
        </div>
      ) : (
        <>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className=""
                  style={{
                    background: `url(${url}) center/cover no-repeat`,
                    height: "500px", // Adjust height as needed
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="flex flex-col gap-5 m-5 font-bold">
  <h1 className="font-bold text-2xl">
    {listing.name} <span className="text-xl">- $ {listing.regularPrice}/month</span>
  </h1>
  <div className="flex gap-2 items-center">
    <FaLocationDot />
    <p className="text-lg">{listing.address}</p>
  </div>
  <div className="flex gap-4">
    <p className="bg-red-900 w-[200px] text-center text-white rounded-md py-1 px-3">
      {listing.type === "rent" ? "For Rent" : "For Sale"}
    </p>
    <p className="bg-green-900 w-[200px] text-center text-white rounded-md py-1 px-3">
      ${listing.regularPrice - listing.discountedPrice} OFF
    </p>
  </div>
  <p className="text-slate-800 font-semibold"><span className="font-semibold text-black">Discription - </span>
  {listing.description}
  </p>
</div>
<div className="flex flex-wrap justify-start gap-4 m-7 text-green-900 font-bold">
  <div className="flex items-center gap-2">
    <FaBed />
    <p>{listing.bedrooms} {listing.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</p>
  </div>
  <div className="flex items-center gap-2">
    <FaBath />
    <p>{listing.bathroom} {listing.bathroom===1 ? 'Bathroom' : 'Bathrooms'}</p>
  </div>
  <div className="flex items-center gap-2">
    <FaSquareParking />
    <p>{listing.parking ? 'Parking Spot' : 'No Parking'}</p>
  </div>
  <div className="flex items-center gap-2">
    <FaChair />
    <p>{listing.furnished ? 'Furnished' : 'Unfurnished'}</p>
  </div>
</div>

{currentUser&&listing.userRefs !== currentUser._id && !contact && (
            <div className="flex justify-center m-7">
              <button onClick={() => setcontact(true)} className="max-w-[300px] w-full rounded-lg hover:opacity-95 bg-slate-700 p-2 text-white uppercase">
                Contact Landlord
              </button>
            </div>
          )}

          {/* Conditionally render the Contacts component if contact state is true */}
          {contact && <Contacts listing={listing} />}



        </>
      )}
    </div>
  );
}

export default Listing;
