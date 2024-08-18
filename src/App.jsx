import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import About from './pages/About'
import Profile from './pages/Profile'
import Header from './componenets/Header'
import SignUp from './pages/SignUp'
import PrivateRoute from './componenets/privateRoute'
import CreateListing from './pages/createListing'
import UpdateListings from './pages/UpdateListings'
import Listing from './pages/Listing'
import Search from './pages/Search'






export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/Search" element={<Search/>} />

        
    <Route element={<PrivateRoute/>}>
      <Route path="/profile" element={<Profile />} />
      <Route path="/listing" element={<CreateListing/>} />
      <Route path='/update-listings/:listingId' element={<UpdateListings/>} /> 
        <Route path='/listing/:listingId'  element={<Listing/>}/> 

    </Route>
      </Routes>
    </>
  );
}