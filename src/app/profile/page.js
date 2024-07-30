"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Profile() {
    const { data: session, status, update } = useSession();
    const router = useRouter();

    const [fullname, setFullname] = useState("");
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [gender, setGender] = useState("");
    const [allergy, setAllergy] = useState("");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    useEffect(() => {
        if (session) {
            setFullname(session.user.name || "");
            setNickname(session.nickname || "");
            setEmail(session.email || "");
            setPhoneNumber(session.phoneNumber || "");
            setPassword("");
            setBirthDate(session.birthDate || "");
            setGender(session.gender || "");
            setAllergy(session.allergy || "");
        }
    }, [session]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch("/api/updateProfile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                fullname,
                nickname,
                email,
                phoneNumber,
                password,
                birthDate,
                gender,
                allergy,
            }),
        });

        if (res.ok) {
            const updatedUser = await res.json();
            // Update the session with the new user data
            update({ ...session, user: updatedUser });
            console.log("Profile updated successfully");
        } else {
            console.error("Failed to update profile");
        }
    };

    return (
        <div className="min-h-screen bg-purple-50 flex justify-center items-center py-12">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-purple-700">Edit Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Full Name</label>
                        <input
                            type="text"
                            name="fullname"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            className="mt-1 p-2 w-full border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Nickname</label>
                        <input
                            type="text"
                            name="nickname"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            className="mt-1 p-2 w-full border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 p-2 w-full border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    {/* <div>
                        <label className="block text-gray-700">Phone Number</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="mt-1 p-2 w-full border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div> */}
                    <div>
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 p-2 w-full border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Birth Date</label>
                        <input
                            type="date"
                            name="birthDate"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            className="mt-1 p-2 w-full border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Gender</label>
                        <div className="flex items-center mt-1 space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="male"
                                    checked={gender === "male"}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="form-radio h-4 w-4 text-purple-600"
                                />
                                <span className="ml-2 text-gray-700">Male</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="female"
                                    checked={gender === "female"}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="form-radio h-4 w-4 text-purple-600"
                                />
                                <span className="ml-2 text-gray-700">Female</span>
                            </label>
                        </div>
                    </div>
                    {/* <div>
                        <label className="block text-gray-700">Allergy</label>
                        <input
                            type="text"
                            name="allergy"
                            value={allergy}
                            onChange={(e) => setAllergy(e.target.value)}
                            className="mt-1 p-2 w-full border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div> */}
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}
