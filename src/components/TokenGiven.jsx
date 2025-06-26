import React from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';

const TokenGiven = () => {
    return (
        <div className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 w-full py-2.5 font-medium text-sm sm:text-base text-white text-center bg-gray-800 mt-25">
            <p className="px-4">
                Special Deal: Free Shipping on Orders Above ₹1500 | 20% OFF on First Purchase
            </p>
        </div>
    );
};

export default TokenGiven;
