import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import ListingItems from '../componenets/ListingItems';

function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch(`/api/listing/get?offer=true&limit=4`);
        const data = await response.json();
        setOfferListings(data);
        await fetchRentListings();
      } catch (error) {
        console.error(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const response = await fetch(`/api/listing/get?type=rent&limit=4`);
        const data = await response.json();
        setRentListings(data);
        await fetchSaleListings();
      } catch (error) {
        console.error(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const response = await fetch(`/api/listing/get?type=sell&limit=4`);
        const data = await response.json();
        setSaleListings(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className='w-full'>
      <div className='flex flex-col gap-7 p-28 px-3 max-w-6xl m-auto'>
        <h1 className='text-3xl lg:text-6xl text-slate-700 font-bold'>
          Find your next <span className='text-gray-600'>Perfect</span>
          <br />
          space with ease
        </h1>

        <p className='text-gray-500 font-bold text-xs md:text-sm'>
          Sahand is the ultimate platform for all your property search needs, offering the best tools and resources to find your dream home or investment.
          <br /> Discover the perfect property with ease and confidence.
        </p>

        <Link className='hover:underline text-blue-950 font-bold text-xs sm:text-sm' to={'/Search'}>
          Let's start Discovering...
        </Link>
      </div>

      <div>
        {/* Swiper Component */}
        <Swiper navigation>
          {offerListings && offerListings.length > 1 && offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div className="flex flex-col gap-4 p-4 rounded-lg shadow-md">
                <div 
                  style={{
                    backgroundImage: `url(${listing.imageUrls[0]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }} 
                  className='h-[500px]'
                ></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div>
        {/* Show Listings of Offer, Rent, and Sale */}
        <div className='flex flex-col m-7 p-3'>
          <div className='flex flex-col'>
            <h2 className='text-slate-600 text text-5xl md:text-3xl font-bold'>Recent offers </h2>
            <Link className='font-bold hover:underline text-blue-800' to={`Search?offer=true`}>Show more rent offers</Link>
          </div>
          <div className='flex flex-wrap gap-4'>
            {offerListings.map((listing) => (
              <ListingItems key={listing._id} listing={listing} />
            ))}
          </div>
        </div>
        <div className='flex flex-col m-7 p-3'>
          <div className='flex flex-col'>
            <h2 className='text-slate-600 text text-5xl md:text-3xl font-bold'>Recent offers for rent</h2>
            <Link className='font-bold hover:underline text-blue-800' to={`Search?type=rent`}>Show more rent offers</Link>
          </div>
          <div className='flex flex-wrap gap-4'>
            {rentListings.map((listing) => (
              <ListingItems key={listing._id} listing={listing} />
            ))}
          </div>
        </div>
        <div className='flex flex-col m-7 p-3'>
          <div className='flex flex-col'>
            <h2 className='text-slate-600 text text-5xl md:text-3xl font-bold'>Recent offers for sale </h2>
            <Link className='font-bold hover:underline text-blue-800' to={`Search?type=sell`}>Show more sale offers</Link>
          </div>
          <div className='flex flex-wrap gap-4'>
            {saleListings.map((listing) => (
              <ListingItems key={listing._id} listing={listing} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
