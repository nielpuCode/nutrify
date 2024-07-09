'use client';

import { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import mascotImage from "/public/mascot_frutier.png";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function LLMadvice() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [nutritionData, setNutritionData] = useState("");
  const [userQuestion, setUserQuestion] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchNutritionData = async () => {
      if (session && session.user && session.user.email) {
        try {
          const response = await fetch(`/api/nutrition?userEmail=${encodeURIComponent(session.user.email)}`);
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
          const data = await response.json();
          setNutritionData(data.data); // Store data directly
        } catch (err) {
          console.error("Error fetching nutrition data:", err);
          setError("Error fetching nutrition data");
        }
      }
    };

    if (status === 'authenticated') {
      fetchNutritionData();
    }
  }, [session, status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setPrediction(null);

    const prompt = `Here are the user's, the name is ${session.user?.name} current nutrition data: ${JSON.stringify(nutritionData)}. Based on this, answer the following question concisely and straightforwardly: ${userQuestion}. Maximum response is only 90 words. The option of the food is only around vegetables and fruits only. The nutrition is only focus in that list of the user. This chat is between you and the user only. So response with you/I am pov. You dont need to mention the beginning such as "Based on..", "Hey there...", or etc like template response like that. Just answer like you are already know the condition of your friends directly`;

    setMessages([...messages, { sender: 'user', text: userQuestion }]);
    setUserQuestion('');

    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      setError(`Error: ${response.statusText}`);
      return;
    }

    let prediction;
    try {
      prediction = await response.json();
    } catch (err) {
      setError("Error parsing JSON response");
      console.error("Error parsing JSON response:", err);
      return;
    }

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + prediction.id);
      if (!response.ok) {
        setError(`Error: ${response.statusText}`);
        return;
      }

      try {
        prediction = await response.json();
      } catch (err) {
        setError("Error parsing JSON response");
        console.error("Error parsing JSON response:", err);
        return;
      }
    }

    setPrediction(prediction);
    setMessages([...messages, { sender: 'user', text: userQuestion }, { sender: 'bot', text: prediction.output }]);
  };

  if (status === 'loading') {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  return (
    <div className="flex flex-col items-center min-h-fit border-0 px-3">
      <h1 className="text-xl md:text-4xl font-bold text-left md:text-center text-purple-800 my-8 flex flex-row border-0 items-center justify-center gap-x-2">
        Nutripal Is Here For You!
        <Image src={mascotImage} alt="Frutier Mascot" className="border-0 w-[70px] block md:hidden" />

      </h1>

      <div className="flex flex-col md:flex-row-reverse w-full border-0 justify-center items-center">
        <Image src={mascotImage} alt="Frutier Mascot" className="border-0 w w-1/4 hidden md:block" />

        <div className="w-full md:w-[70%] mx-auto bg-white p-2 md:p-4 rounded-lg shadow-lg border-2 border-purple-800">
          <div className="flex flex-col space-y-4 mb-4 h-96 overflow-y-auto">
            {messages.length === 0 && (
              <div className="text-center md:text-3xl text-gray-300 border-0 h-full flex flex-col justify-center items-center font-extrabold">Let's talk about something today!</div>
            )}
            {messages.map((message, index) => (
              <div key={index} className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <span className={`text-sm ${message.sender === 'user' ? 'text-purple-600 font-extrabold' : 'text-gray-600 font-extrabold'}`}>
                  {message.sender === 'user' ? session.user.name : 'Nutripal'}
                </span>
                <div className="flex items-center space-x-2">
                  <div className={`p-3 rounded-lg ${message.sender === 'user' ? 'bg-purple-500 text-white' : 'bg-gray-300 text-gray-900'}`}>
                    {message.text}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex">
            <input
              type="text"
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              className="flex-grow p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Type your question here..."
            />
            <button type="submit" className="ml-2 px-4 py-2 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600">Send</button>
          </form>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
    </div>
  );
}
