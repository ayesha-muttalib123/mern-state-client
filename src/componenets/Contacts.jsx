import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Contacts({ listing }) {
  const [landlord, setLandlord] = useState(null);
  console.log("landlord state:", landlord);
  const [message, setmessage] = useState();
  const onchange = async (e) => {
    setmessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        // Fetch landlord data
        const response = await fetch(`/api/user/${listing.userRefs}`);
        const data = await response.json();

        // Check the response data
        console.log("Fetched landlord data:", data);
        setLandlord(data);
      } catch (error) {
        console.error("Error fetching landlord:", error);
      }
    };

    // Ensure listing.userRefs is defined before fetching

    fetchLandlord();
  }, [listing.userRefs]); // Dependency on `listing` to refetch if it changes

  return (
    <div>
      {landlord ? (
        <>
          <div className="flex flex-col m-3 gap-4">
            <p>
              Contact <span className="font-semibold">{landlord.username}</span>{" "}
              for <span>{listing.name}</span>
            </p>
            <textarea
              className="border rounded-lg p-3"
              name="message"
              id="message"
              value={message}
              onchange={onchange}
   placeholder="Enter your message here"
   
            />

          
            <Link className=" text-center w-full rounded-lg hover:opacity-95 bg-slate-700 p-2 text-white uppercase"  to={`mailto:${landlord.email}?subject=Regarding${listing.name}&body=${message}`}>
            Send Message
            </Link>
          </div>
        </>
      ) : (
        <p>Loading contact info.../</p>
      )}
    </div>
  );
}

export default Contacts;
