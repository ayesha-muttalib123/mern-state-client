import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ListingItems from "../componenets/ListingItems";

function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [listings, setListing] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [sidebarData, setSidebarData] = useState({
    SearchTerm: "",
    offer: false,
    parking: false,
    furnished: false,
    type: "all",
    sort: "createdAt",
    order: "desc",
  });
  console.log("listingsss",listings)

  // Update the URL query parameters
  const handleSubmit = async (e) => {
    e.preventDefault();
    const UrlParams = new URLSearchParams();

    UrlParams.set("searchTerm", sidebarData.SearchTerm);
    UrlParams.set("offer", sidebarData.offer ? "true" : "false");
    UrlParams.set("parking", sidebarData.parking ? "true" : "false");
    UrlParams.set("furnished", sidebarData.furnished ? "true" : "false");
    UrlParams.set("type", sidebarData.type);
    UrlParams.set("sort", sidebarData.sort);
    UrlParams.set("order", sidebarData.order);

    const SearchQuery = UrlParams.toString();
    navigate(`/search?${SearchQuery}`);
  };

  // Fetch listings whenever the URL parameters change
  useEffect(() => {
    const fetchListings = async () => {
      setShowMore(false);
      setLoading(true);
      const UrlParams = new URLSearchParams(location.search);

      const searchParams = {
        searchTerm: UrlParams.get("searchTerm") || "",
        offer: UrlParams.get("offer") === "true" ? "true" : "false",
        parking: UrlParams.get("parking") === "true" ? "true" : "false",
        furnished: UrlParams.get("furnished") === "true" ? "true" : "false",
        type: UrlParams.get("type") || "all",
        sort: UrlParams.get("sort") || "createdAt",
        order: UrlParams.get("order") || "desc",
      };

      try {
        const response = await fetch(
          `/api/listing/get?${new URLSearchParams(searchParams)}`
        );
        const data = await response.json();
        setListing(data);
        if (data.length > 8) {
          setShowMore(true);
        
        }
       
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [location.search]);

  // Handle input changes
  const handleChange = (e) => {
    const { id, type, value, checked } = e.target;

    if (id === "all" || id === "rent" || id === "sell") {
      setSidebarData((prev) => ({ ...prev, type: id }));
    }

    if (id === "searchTerm") {
      setSidebarData((prev) => ({ ...prev, SearchTerm: value }));
    }

    if (id === "parking" || id === "furnished" || id === "offer") {
      setSidebarData((prev) => ({ ...prev, [id]: checked }));
    }

    if (id === "sort_order") {
      const [sort, order] = value.split("_");
      setSidebarData((prev) => ({
        ...prev,
        sort,
        order,
      }));
    }
  };
  const showMorebutton = async () => {
    try {
      setShowMore(false);  // Hide the button while fetching more data
  
      // Get the current number of listings and set startIndex
      const listingLength = listings.length;
      const startIndex = listingLength;
  
      // Create URL parameters including the startIndex for pagination
      const urlParams = new URLSearchParams(location.search);
      urlParams.set("startIndex", startIndex);
      
      // Fetch the additional listings
      const response = await fetch(`/api/listing/get?${urlParams.toString()}`);
      const data = await response.json();
      
      // Append the new listings to the existing ones
      setListing((prevListings) => [...prevListings, ...data]);
      console.log("after appendiing: ",listings)
  
      // Check if there are more listings to load
      if (data.length === 9) { 
        setShowMore(true);  // Show the button if there's potentially more data
      } else {
        setShowMore(false);  // Hide the button if no more data
      }
    } catch (error) {
      console.error("Error fetching more listings:", error);
    }
  };
  
  
  return (
    <div className="p-5 flex flex-col md:flex-row md:h-screen">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 border-b-2 md:border-r-2 md:min-h-screen p-5"
      >
        <div className="flex gap-2 items-center p-7 border-b-2 md:border-b-0 md:border-r-2">
          <h1 className="font-bold whitespace-nowrap">Search Term:</h1>
          <input
            type="text"
            className="w-full h-10 p-2 border rounded-lg"
            value={sidebarData.SearchTerm}
            onChange={handleChange}
            id="searchTerm"
            placeholder="Search..."
          />
        </div>

        <div
          className="flex flex-col gap-4 p-3"
        >
          <div className="font-bold flex flex-wrap gap-3">
            <h1>Type:</h1>
            <label className="font-semibold flex items-center">
              <input
                type="checkbox"
                className="w-5 h-5 mr-2"
                id="all"
                checked={sidebarData.type === "all"}
                onChange={handleChange}
              />
              Rent & Sale
            </label>
            <label className="flex font-semibold items-center">
              <input
                id="offer"
                type="checkbox"
                className="w-5 h-5 mr-2"
                checked={sidebarData.offer}
                onChange={handleChange}
              />
              Offer
            </label>
            <label className="flex font-semibold items-center">
              <input
                id="rent"
                type="checkbox"
                className="w-5 h-5 mr-2"
                checked={sidebarData.type === "rent"}
                onChange={handleChange}
              />
              Rent
            </label>
            <label className="flex font-semibold items-center">
              <input
                id="sell"
                type="checkbox"
                className="w-5 h-5 mr-2"
                checked={sidebarData.type === "sell"}
                onChange={handleChange}
              />
              Sale
            </label>
          </div>

          <div className="flex font-bold flex-wrap gap-3">
            <h1>Amenities:</h1>
            <label className="flex font-semibold items-center">
              <input
                id="parking"
                type="checkbox"
                className="w-5 h-5 mr-2"
                checked={sidebarData.parking}
                onChange={handleChange}
              />
              Parking
            </label>
            <label className="flex font-semibold items-center">
              <input
                id="furnished"
                type="checkbox"
                className="w-5 h-5 mr-2"
                checked={sidebarData.furnished}
                onChange={handleChange}
              />
              Furnished
            </label>
          </div>

          <div className="flex flex-col gap-5 mt-4">
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="font-semibold mr-2">
                Sort:
              </label>
              <select
                onChange={handleChange}
                id="sort_order"
                className="border rounded-lg p-2"
                value={sidebarData.sort + "_" + sidebarData.order}
              >
                <option value="regularPrice_desc">Price high to low</option>
                <option value="regularPrice_asc">Price low to high</option>
                <option value="createdAt_desc">Latest</option>
                <option value="createdAt_asc">Oldest</option>
              </select>
            </div>

            <button className="uppercase bg-slate-700 text-white p-3 rounded-lg w-full mt-4">
              Search
            </button>
          </div>
        </div>
      </form>

      <div className="flex-grow  p-4">
        <h1 className="font-bold text-2xl">Listing Results:</h1>

        {!loading && listings.length === 0 && (
          <p className="p-3 text-slate-700 font-semibold">No listings found.</p>
        )}

        {loading && (
          <p className="text-center text-slate-700 p-3 font-semibold">
            Loading...
          </p>
        )}

        <div className="flex flex-wrap gap-2 p-4">
          {!loading &&
            listings.map((listing) => (
              <ListingItems key={listing._id} listing={listing} />
            ))}
        </div>
         {
            showMore&&(
              <button onClick={showMorebutton} className="text-green-500 w-full text-center hover:underline p-7 items-center ">
               Show More</button>
            )
          }
         
      </div>
    </div>
  );
}

export default Search;
