// src/app/register/page.js
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const Register = () => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { data: session, status: sessionStatus } = useSession();

    const [fullname, setFullname] = useState("");
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [gender, setGender] = useState("");

    useEffect(() => {
        if (sessionStatus === "authenticated") {
            router.replace("/");
        }
    }, [sessionStatus, router]);

    const isValidEmail = (email) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValidEmail(email)) {
            setError("Email is invalid");
            return;
        }

        if (!password || password.length < 1) {
            setError("Password is invalid");
            return;
        }

        setLoading(true); // Set loading state to true

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({fullname, nickname, email, password, birthDate, gender}),
            });
            setLoading(false); // Set loading state to false after response

            if (res.status === 400) {
                setError("This email is already registered");
            } else if (res.status === 200) {
                setError("");
                router.push("/login");
            }
        } catch (error) {
            setLoading(false); // Set loading state to false in case of error
            setError("Error, try again");
            console.log(error);
        }
    };

    if (sessionStatus === "loading") {
        return <h1 className="text-center text-2xl">Loading...</h1>;
    }

    return (
        sessionStatus !== "authenticated" && (
            <div className="flex justify-center mt-16">
                <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-lg">
                    <h1 className="text-3xl font-semibold text-center text-purple-700">Register</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input type="text" placeholder="Full Name" required value={fullname} onChange={(e) => setFullname(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nickname</label>
                                <input type="text" placeholder="Nickname" required value={nickname} onChange={(e) => setNickname(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"/>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" placeholder="Email Address" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <input type="password" placeholder="Enter Password" required value={password}
                                    onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"/>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Birth Date</label>
                                <input type="date" required value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Gender</label>
                                <div className="mt-1 flex space-x-4">
                                    <label className="flex items-center">
                                        <input type="radio" name="gender" value="male" className="form-radio text-purple-600" required checked={gender === 'male'} onChange={() => setGender('male')}/>
                                        <span className="ml-2">Male</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" name="gender" value="female" className="form-radio text-purple-600" required checked={gender === 'female'} onChange={() => setGender('female')}/>
                                        <span className="ml-2">Female</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex justify-center items-center">
                                    <div className="loader border-t-4 border-white rounded-full w-6 h-6 animate-spin"></div>
                                </div>
                            ) : (
                                "Register"
                            )}
                        </button>
                        {error && (
                            <p className="text-red-600 text-sm mt-2">{error}</p>
                        )}
                    </form>
                    <div className="text-center text-gray-500 mt-4">- OR -</div>
                    <Link className="block text-center text-blue-500 hover:underline mt-2" href="/login">Login with an existing account</Link>
                </div>
            </div>
        )
    );
};

export default Register;
