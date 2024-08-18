import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import React, { useRef, useState } from "react";
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

function CreateListing() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [Error, setError] = useState("");
  const navigate=useNavigate()

  const CurrentUser = useSelector((state) => state.user.currentUser); 
  console.log("CurrentUser (stringified):", JSON.stringify(CurrentUser, null, 2));

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    regularPrice: 0,
    address: "",
    furnished: false,
    parking: false,
    type: "rent",
    bathroom: 1,
    bedrooms: 1,
    offer: false,
    discountedPrice: 0,
    imageUrls: [],  // This should match your schema
    userRefs:CurrentUser?._id
});
  console.log(formData);

  const handleSubmitImage = (e) => {
    e.preventDefault();

    if (files.length > 0 && files.length <7) {
      setUploading(true);
      const promises = files.map((file) => storeImage(file));

      Promise.all(promises)
        .then((urls) => {
          setFormData((prevData) => ({
            ...prevData,
            imageUrls: [...prevData.imageUrls, ...urls],
          }));
          setUploading(false);
          alert("All files uploaded successfully!");
        })
        .catch((err) => {
          console.error(err);
          alert("Error uploading files!");
          setUploading(false);
        });
    } else {
      alert("Please select up to 6 images.");
    }
  };

  const handleDelete = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      imageUrls: prevData.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const storeImage = (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage();
      const filename = new Date().getTime() + file.name;
      const storageRef = ref(storage, filename);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Optional: Handle progress here if needed
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleSubmit = async (e) => {
  
    e.preventDefault();
    if(formData.imageUrls.length<1){
      return setError('you must upload atleast 1 image')
    }
    if(formData.regularPrice<formData.discountedPrice){
      return setError('regular price must be less than discounted price')
      }
    try {
      setLoading(true);

      console.log("Form Data to be submitted:", JSON.stringify(formData, null, 2));
      console.log("CurrentUser:", CurrentUser);
      console.log("CurrentUser ID:", CurrentUser?._id);

      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData }),
      });

      const data = await res.json();
      setLoading(false);

      if (!data.success) {
        setError(data.message);  // Assuming data.message contains the error message
        console.error("Backend error message:", data.message);
      } else {
        console.log("Data successfully submitted:", data);
       
        navigate(`/listing/${data._id}`)
      }
    } catch (error) {
      setLoading(false);
      setError(error.message);  // Handle fetch error
      console.error("Error submitting data:", error);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.type === "checkbox") {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    } else {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  return (
    <main className="m-auto max-w-4xl">
      <h1 className="font-semibold text-3xl text-center p-3">Create Listing</h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row p-3 gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            id="name"
            value={formData.name}
            onChange={handleInputChange}
            className="rounded-lg p-3"
          />
          <textarea
            placeholder="Description"
            id="description"
            value={formData.description}
            onChange={handleInputChange}
            className="rounded-lg p-3 border"
          />
          <input
            type="text"
            placeholder="Address"
            id="address"
            value={formData.address}
            onChange={handleInputChange}
            className="rounded-lg p-3"
          />
          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="type"
                checked={formData.type === "sell"}
                onChange={() =>
                  setFormData((prevData) => ({ ...prevData, type: "sell" }))
                }
                className="w-5"
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="type"
                checked={formData.type === "rent"}
                onChange={() =>
                  setFormData((prevData) => ({ ...prevData, type: "rent" }))
                }
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" onChange={handleInputChange} />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" onChange={handleInputChange} />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" onChange={handleInputChange} />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex gap-3">
              <input
                type="number"
                id="bedrooms"
                value={formData.bedrooms}
                onChange={handleInputChange}
                className="w-10 border-gray-300 text-center"
                min={0}
                max={10}
              />
              <span>Beds</span>
            </div>
            <div className="flex gap-3">
              <input
                type="number"
                id="bathroom"
                value={formData.bathroom}
                onChange={handleInputChange}
                className="w-10 border-gray-300 text-center m-auto"
                min={0}
                max={10}
              />
              <span>Baths</span>
            </div>
            <div className="flex gap-3">
              <input
                type="number"
                id="regularPrice"
                value={formData.regularPrice}
                onChange={handleInputChange}
                className="w-10 border-gray-300 text-center m-auto"
                min={50}
                max={10000000}
              />
              <div className="flex flex-col flex-1 text-center ">
                <p>Regular Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
           
  {     formData.offer &&
  
  <div className="flex gap-3">
            <input
              type="number"
              id="discountedPrice"
              value={formData.discountedPrice}
              onChange={handleInputChange}
              className="w-10 border-gray-300 text-center m-auto"
              min={0}
              max={10000000}
            />
            <div className="flex flex-col flex-1 text-center">
              <p>Discounted Price</p>
              <span className="text-xs">($ / month)</span>
            </div>
          </div>}
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex flex-1">
            <p>Images:</p>
            <span className="font-normal text-gray-600 ml-2">
              The first Image will be the cover (max 6)
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <input
              onChange={(e) => setFiles(Array.from(e.target.files))}
              className="border p-3 border-gray-300"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              onClick={handleSubmitImage}
              className="uppercase rounded border border-green-700 text-green-700 p-3"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            {formData.imageUrls.map((url, index) => (
              <div key={index} className="flex flex-col items-center">
                <img
                  src={url}
                  alt={`Uploaded ${index}`}
                  className="rounded-lg w-32 h-32 object-cover mb-2"
                />
                <button
                  onClick={() => handleDelete(index)}
                  className="uppercase rounded border border-red-700 text-red-700 p-2"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          {Error && <p className="text-red-600">{Error}</p>}
          <button  disabled ={loading||uploading} className="p-3 rounded bg-slate-700 uppercase text-white hover:placeholder-opacity-95 disabled:opacity-80">
            {loading ? "Creating..." : "Create Listing"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default CreateListing;

























// import {
//   getStorage,
//   ref,
//   uploadBytesResumable,
//   getDownloadURL,
// } from "firebase/storage";
// import React, { useState } from "react";
// import { useSelector } from 'react-redux';

// function CreateListing() {
//   const [files, setFiles] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const CurrentUser = useSelector((state) => state.user.currentUser); 
//   console.log("CurrentUser (stringified):", JSON.stringify(CurrentUser, null, 2));
//   // Log the entire Redux state for debugging
//   // const entireState = useSelector((state) => state);
//   // console.log("Entire Redux state:", entireState);

//   const [formData, setFormData] = useState({
//     imageUrls: [],
//     name: "",
//     description: "",
//     address: "",
//     type: "rent",
//     bedrooms: 1,
//     bathroom: 1,
//     regularPrice: 0,
//     discountedPrices: 0,
//     offer: false,
//     parking: false,
//     furnished: false,
//   });

//   console.log(formData);

//   const handleSubmitImage = (e) => {
//     e.preventDefault();

//     if (files.length > 0 && files.length <= 6) {
//       setUploading(true);
//       const promises = files.map((file) => storeImage(file));

//       Promise.all(promises)
//         .then((urls) => {
//           setFormData((prevData) => ({
//             ...prevData,
//             imageUrls: [...prevData.imageUrls, ...urls],
//           }));
//           setUploading(false);
//           alert("All files uploaded successfully!");
//         })
//         .catch((err) => {
//           console.error(err);
//           alert("Error uploading files!");
//           setUploading(false);
//         });
//     } else {
//       alert("Please select up to 6 images.");
//     }
//   };

//   const handleDelete = (index) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       imageUrls: prevData.imageUrls.filter((_, i) => i !== index),
//     }));
//   };

//   const storeImage = (file) => {
//     return new Promise((resolve, reject) => {
//       const storage = getStorage();
//       const filename = new Date().getTime() + file.name;
//       const storageRef = ref(storage, filename);
//       const uploadTask = uploadBytesResumable(storageRef, file);

//       uploadTask.on(
//         "state_changed",
//         (snapshot) => {
//           // Optional: Handle progress here if needed
//         },
//         (error) => {
//           reject(error);
//         },
//         () => {
//           getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//             resolve(downloadURL);
//           });
//         }
//       );
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);

//       // Log the formData and userId before sending the request
//       console.log("Form Data to be submitted:", JSON.stringify(formData, null, 2));
//       console.log("CurrentUser:", CurrentUser);
//       console.log("CurrentUser ID:", CurrentUser?._id);

//       const res = await fetch("/api/listing/create", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ formData, userRefs: CurrentUser?._id }),
//       });

//       const data = await res.json();
//       setLoading(false);

//       if (!data.success) {
//         setError(data.message);  // Assuming data.message contains the error message
//       } else {
//         // Handle success scenario if needed
//         console.log("Data successfully submitted:", data);
//       }

//     } catch (error) {
//       setLoading(false);
//       setError(error.message);  // Handle fetch error
//       console.error("Error submitting data:", error);
//     }
//   };

//   const handleInputChange = (e) => {
//     if (e.target.type === "checkbox") {
//       setFormData({ ...formData, [e.target.id]: e.target.checked });
//     } else {
//       setFormData({ ...formData, [e.target.id]: e.target.value });
//     }
//   };

//   return (
//     <main className="m-auto max-w-4xl">
//       <h1 className="font-semibold text-3xl text-center p-3">Create Listing</h1>
//       <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row p-3 gap-4">
//         <div className="flex flex-col gap-4 flex-1">
//           <input
//             type="text"
//             placeholder="Name"
//             id="name"
//             value={formData.name}
//             onChange={handleInputChange}
//             className="rounded-lg p-3"
//           />
//           <textarea
//             placeholder="Description"
//             id="description"
//             value={formData.description}
//             onChange={handleInputChange}
//             className="rounded-lg p-3 border"
//           />
//           <input
//             type="text"
//             placeholder="Address"
//             id="address"
//             value={formData.address}
//             onChange={handleInputChange}
//             className="rounded-lg p-3"
//           />
//           <div className="flex flex-wrap gap-6">
//             <div className="flex gap-2">
//               <input
//                 type="checkbox"
//                 id="type"
//                 checked={formData.type === "sell"}
//                 onChange={() =>
//                   setFormData((prevData) => ({ ...prevData, type: "sell" }))
//                 }
//                 className="w-5"
//               />
//               <span>Sell</span>
//             </div>
//             <div className="flex gap-2">
//               <input
//                 type="checkbox"
//                 id="type"
//                 checked={formData.type === "rent"}
//                 onChange={() =>
//                   setFormData((prevData) => ({ ...prevData, type: "rent" }))
//                 }
//               />
//               <span>Rent</span>
//             </div>
//             <div className="flex gap-2">
//               <input type="checkbox" id="parking" onChange={handleInputChange} />
//               <span>Parking Spot</span>
//             </div>
//             <div className="flex gap-2">
//               <input type="checkbox" id="furnished" onChange={handleInputChange} />
//               <span>Furnished</span>
//             </div>
//             <div className="flex gap-2">
//               <input type="checkbox" id="offer" onChange={handleInputChange} />
//               <span>Offer</span>
//             </div>
//           </div>
//           <div className="flex gap-3">
//             <div className="flex gap-3">
//               <input
//                 type="number"
//                 id="bedrooms"
//                 value={formData.bedrooms}
//                 onChange={handleInputChange}
//                 className="w-10 border-gray-300 text-center"
//                 min={0}
//                 max={10}
//               />
//               <span>Beds</span>
//             </div>
//             <div className="flex gap-3">
//               <input
//                 type="number"
//                 id="bathroom"
//                 value={formData.bathroom}
//                 onChange={handleInputChange}
//                 className="w-10 border-gray-300 text-center m-auto"
//                 min={0}
//                 max={10}
//               />
//               <span>Baths</span>
//             </div>
//             <div className="flex gap-3">
//               <input
//                 type="number"
//                 id="regularPrice"
//                 value={formData.regularPrice}
//                 onChange={handleInputChange}
//                 className="w-10 border-gray-300 text-center m-auto"
//                 min={50}
//                 max={10000000}
//               />
//               <div className="flex flex-col flex-1 text-center ">
//                 <p>Regular Price</p>
//                 <span className="text-xs">($ / month)</span>
//               </div>
//             </div>
//             <div className="flex gap-3">
//               <input
//                 type="number"
//                 className="h-10 border-gray-300 text-center  m-auto"
//                 min={0}
//                 max={10}
//               />
//               <div className="flex flex-col flex-1 text-center">
//                 <p>Discounted Price</p>
//                 <span className="text-xs">($ / month)</span>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="flex flex-col gap-4 flex-1">
//           <div className="flex flex-1">
//             <p>Images:</p>
//             <span className="font-normal text-gray-600 ml-2">
//               (Max 6 images)
//             </span>
//             <div className="flex flex-wrap gap-2">
//               {formData.imageUrls.map((url, index) => (
//                 <div key={index} className="relative">
//                   <img src={url} alt="upload" className="h-20 w-20 object-cover" />
//                   <button
//                     type="button"
//                     onClick={() => handleDelete(index)}
//                     className="absolute top-0 right-0 text-white bg-red-500 rounded-full p-1"
//                   >
//                     &times;
//                   </button>
//                 </div>
//               ))}
//             </div>
//             <input
//               type="file"
//               multiple
//               accept="image/*"
//               onChange={(e) => setFiles(Array.from(e.target.files))}
//               className="my-2"
//             />
//             <button
//               type="button"
//               onClick={handleSubmitImage}
//               className="p-2 bg-blue-500 text-white rounded-lg"
//               disabled={uploading}
//             >
//               {uploading ? "Uploading..." : "Upload Images"}
//             </button>
//           </div>
//         </div>
//         <button
//           type="submit"
//           className="p-2 bg-green-500 text-white rounded-lg"
//           disabled={loading}
//         >
//           {loading ? "Submitting..." : "Submit"}
//         </button>
//       </form>
//       {error && <p className="text-red-500 mt-3">{error}</p>}
//     </main>
//   );
// }

// export default CreateListing;

