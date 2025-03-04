"use client";
import ProfileServices from "@/services/profile/services1";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Modal from "../product-management/Modal";
import FormSetPassword from "./FormSetPassword";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { Camera, Edit, Save, Key, User, Mail, Phone, ShieldCheck, Activity } from "lucide-react";

const Section1 = () => {
  const {
    profile,
    isChangeAvatar,
    newFile,
    getDataUser,
    saveChanges,
    handlePickImage,
    handleChangeAvatar,
    setProfile,
    setPasswordHandle,
    isSaveAvatar,
  } = ProfileServices();
  const [modalSetPass, setModalSetPass] = useState(false);
  const [modalEnterRefCode, setModalEnterRefCode] = useState(false);
  const [saved, setSaved] = useState(false);
  
  
  
  const handleSaveChanges = () => {
    saveChanges();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="py-8 px-4 md:px-0">
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 h-32 relative">
          <div className="absolute -bottom-16 left-8 flex items-end">
            <div className="relative w-32 h-32 rounded-full border-4 border-gray-800 overflow-hidden bg-gray-700 shadow-lg">
              {isChangeAvatar ? (
                <Image
                  src={newFile.url}
                  alt="Profile Picture"
                  fill
                  className="object-cover"
                />
              ) : (
                <Image
                  src={
                    profile.avatar
                      ? profile.avatar
                      : "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
                  }
                  alt="Profile Picture"
                  fill
                  className="object-cover"
                />
              )}
              
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                  <Camera className="h-8 w-8 text-white" />
                  <span className="text-white text-xs mt-1">Change</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handlePickImage(e)}
                    disabled={isChangeAvatar}
                  />
                </label>
              </div>
            </div>
            
            {isChangeAvatar && (
              <button
                onClick={handleChangeAvatar}
                disabled={isSaveAvatar}
                className="ml-4 mb-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all flex items-center shadow-lg transform hover:scale-105"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Avatar
              </button>
            )}
          </div>
          
         
        </div>
        
        {/* Profile Content */}
        <div className="px-8 pt-20 pb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
            <div>
              <h1 className="text-3xl text-white font-bold">
                {profile.firstName} {profile.lastName || ""}
              </h1>
              <div className="mt-2 inline-flex items-center px-3 py-1 bg-indigo-900/50 rounded-full text-indigo-200 text-sm">
                <span className="mr-2">Referral Code:</span>
                <span className="font-mono font-bold">{profile.referral_code}</span>
              </div>
            </div>
            
            {profile && !profile.is_google && (
              <button
                onClick={() => setModalSetPass(true)}
                className="mt-4 md:mt-0 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center transition-all shadow-md transform hover:scale-105"
              >
                <Key className="w-4 h-4 mr-2" />
                Set Password
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="flex items-center text-gray-400 mb-2 group-focus-within:text-indigo-400 transition-colors">
                <User className="w-4 h-4 mr-2" /> First Name
              </label>
              <input
                type="text"
                value={profile.firstName}
                onChange={(e) =>
                  setProfile({ ...profile, firstName: e.target.value })
                }
                placeholder="Enter first name"
                className="w-full bg-gray-700/50 border border-gray-600 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white transition-all"
              />
            </div>
            
            <div className="group">
              <label className="flex items-center text-gray-400 mb-2 group-focus-within:text-indigo-400 transition-colors">
                <User className="w-4 h-4 mr-2" /> Last Name
              </label>
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) =>
                  setProfile({ ...profile, lastName: e.target.value })
                }
                placeholder="Enter last name"
                className="w-full bg-gray-700/50 border border-gray-600 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white transition-all"
              />
            </div>
            
            <div className="group">
              <label className="flex items-center text-gray-400 mb-2 group-focus-within:text-indigo-400 transition-colors">
                <Mail className="w-4 h-4 mr-2" /> Email
              </label>
              <input
                type="email"
                value={profile.email}
                disabled={profile?.is_google ? true : false}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="Enter email"
                className={`w-full bg-gray-700/50 border border-gray-600 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white transition-all ${
                  profile?.is_google ? "opacity-70 cursor-not-allowed" : ""
                }`}
              />
              {profile?.is_google && (
                <span className="text-xs text-amber-400 mt-1 flex items-center">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  Google account - email cannot be changed
                </span>
              )}
            </div>
            
            <div className="group">
              <label className="flex items-center text-gray-400 mb-2 group-focus-within:text-indigo-400 transition-colors">
                <Phone className="w-4 h-4 mr-2" /> Phone
              </label>
              <input
                type="text"
                value={profile.phone || ""}
                onChange={(e) => setProfile({ ...profile, phone: parseInt(e.target.value, 10) })}
                placeholder="Enter phone number"
                className="w-full bg-gray-700/50 border border-gray-600 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white transition-all"
              />
            </div>
            
            <div className="group">
              <label className="flex items-center text-gray-400 mb-2">
                <ShieldCheck className="w-4 h-4 mr-2" /> Role
              </label>
              <div className="w-full bg-gray-800 border border-gray-700 p-3 rounded-lg text-gray-300 flex items-center">
                <span className={`mr-2 inline-block w-2 h-2 rounded-full ${
                  profile.role === "admin" ? "bg-purple-500" : "bg-blue-500"
                }`}></span>
                {profile.role || "User"}
              </div>
            </div>
            
            <div className="group">
              <label className="flex items-center text-gray-400 mb-2">
                <Activity className="w-4 h-4 mr-2" /> Status
              </label>
              <div className="w-full bg-gray-800 border border-gray-700 p-3 rounded-lg text-gray-300 flex items-center">
                <span className={`mr-2 inline-block w-2 h-2 rounded-full ${
                  profile.status === "Active" ? "bg-green-500" : "bg-red-500"
                }`}></span>
                {profile.status || "Inactive"}
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSaveChanges}
              className={`relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg flex items-center transition-all shadow-lg transform hover:scale-105 ${
                saved ? "bg-green-600" : ""
              }`}
            >
              {saved ? (
                <>
                  <div className="absolute inset-0 bg-green-600"></div>
                  <span className="relative flex items-center">
                    <Save className="w-5 h-5 mr-2" /> Saved!
                  </span>
                </>
              ) : (
                <>
                  <Edit className="w-5 h-5 mr-2" /> Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Modal for setting password */}
      {profile ? (
        <Modal
          isOpen={modalSetPass}
          onClose={() => setModalSetPass(false)}
          title="Set New Password"
        >
          <FormSetPassword onsubmit={setPasswordHandle} />
        </Modal>
      ) : (
        ""
      )}
    </div>
  );
};

export default Section1;