"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
    const { data: session } = useSession();
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownVisible(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className="bg-gradient-to-b from-purple-700 to-purple-500 shadow-md p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <Image src="/new_logo.png" className="rounded-full" alt="Frutier Logo" width={40} height={40} />
                    <a href="/" className="text-2xl font-bold text-white">Nutrify</a>
                </div>
                <div className="hidden md:flex items-center space-x-4">
                    {!session ? (
                        <>
                            <Link href="/login" className="bg-cyan-500 font-extrabold text-white px-4 py-2 rounded hover:bg-cyan-600">Login</Link>
                            <Link href="/register" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 font-extrabold">Register</Link>
                        </>
                    ) : (
                        <>
                            <Link href="/dashboard" className="bg-purple-400 text-white px-4 py-2 rounded hover:bg-purple-500 transition-all duration-300 ease-in-out">Dashboard</Link>

                            <div className="dropdown border-0">
                                <div tabIndex={0} role="button" className=" font-extrabold text-white cursor-pointer hover:bg-purple-600 border-2 transition-all duration-200 ease-in-out border-white rounded-full px-4 py-1 truncate max-w-sm bg-none">{session.name}</div>

                                <ul tabIndex={0} className="dropdown-content bg-purple-500 z-[1] w-fit p-2 shadow">
                                    <li><Link href="/profile" className="block w-full px-4 py-2 text-white hover:bg-purple-400 font-bold hover:rounded" onClick={toggleDropdown}>Profile</Link></li>
                                    <li><button className="border-0 rounded cursor-pointer block w-full text-left px-4 py-2 text-white hover:bg-purple-400 font-bold hover:rounded" onClick={() => { signOut(); }}>Logout</button></li>
                                </ul>
                            </div>                                
                        </>
                    )}
                </div>
                <div className="md:hidden flex items-center">
                    <button onClick={toggleMenu} className="text-white focus:outline-none">
                        {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>
            </div>
            {menuOpen && (
                <div className="md:hidden mt-2 flex flex-col items-start space-y-2">
                    {!session ? (
                        <>
                            <Link href="/login" className="bg-blue-500 text-white px-4 py-2 rounded w-full text-left hover:bg-blue-600">Login</Link>
                            <Link href="/register" className="bg-green-500 text-white px-4 py-2 rounded w-full text-left hover:bg-green-600">Register</Link>
                        </>
                    ) : (
                        <>
                            <Link href="/dashboard" className="bg-purple-400 text-white px-4 py-2 rounded w-full text-left hover:bg-purple-500 transition-all duration-300 ease-in-out">Dashboard</Link>
                            <div className="relative w-full border-0 my-2 text-center">
                                <span className="font-extrabold text-white cursor-pointer hover:bg-purple-600 border-2 transition-all duration-200 ease-in-out border-white rounded-full px-4 py-1 truncate max-w-sm text-center mx-auto" title={session.name} onClick={toggleDropdown}>
                                    {session.name}
                                </span>
                                {dropdownVisible && (
                                    <div className="w-full mt-2 bg-gradient-to-b from-purple-500 to-purple-300 rounded-xl ">
                                        <ul className="py-1">
                                            <li>
                                                <Link href="/profile" className="block w-full px-4 py-2 text-white font-extrabold hover:bg-purple-300 text-center">Edit Profile</Link>
                                                <button className="border-0 rounded-b-xl cursor-pointer block w-full px-4 py-2 text-white font-extrabold hover:bg-purple-300 text-center" onClick={() => { signOut(); }}>Logout</button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
