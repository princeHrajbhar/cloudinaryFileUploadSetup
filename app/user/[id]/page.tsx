"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import FormComponent from "@/component/form"; // Adjust import if necessary
import { useParams } from "next/navigation";

// Define a specific interface for the user data
interface UserData {
  name: string;
  email: string;
  image_url: string;
}

export default function EditPage() {
  const params = useParams(); // Safely access parameters
  const userId = params?.id; // Correct parameter name based on your file structure
  const [userData, setUserData] = useState<UserData | null>(null); // Use the UserData interface

  useEffect(() => {
    if (!userId) {
      console.error("User ID is missing from the URL");
      return;
    }

    const fetchUserData = async () => {
      try {
        console.log("Fetching data for userId:", userId);
        const response = await axios.get(`/api/upload-image/${userId}`);
        setUserData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleFormSubmit = async (formData: { name: string; email: string; image: File | null }) => {
    const { name, email, image } = formData;

    if (!image || !name || !email) {
      alert("Please provide all required fields.");
      return;
    }

    try {
      const data = new FormData();
      data.append("image", image);
      data.append("name", name);
      data.append("email", email);

      const response = await axios.put(`/api/upload-image/${userId}`, data);
      console.log("Response:", response.data);
      alert("User data updated successfully!");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data || error.message);
      } else {
        console.error("An unexpected error occurred");
      }
    }
  };

  return userData ? (
    <FormComponent
      onSubmit={handleFormSubmit}
      initialData={{
        name: userData.name,
        email: userData.email,
        imageUrl: userData.image_url,
      }}
    />
  ) : (
    <div>Loading...</div>
  );
}
