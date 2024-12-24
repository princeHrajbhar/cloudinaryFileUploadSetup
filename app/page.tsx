"use client";

import axios from "axios";
import FormComponent from "@/component/form";

export default function Page() {
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

            const response = await axios.post("/api/upload-image", data);
            console.log("Response:", response.data);
        } catch (error: unknown) {
            if (error instanceof Error) console.error("Error:", error.message);
            else console.error("An unexpected error occurred");
        }
    };

    return <FormComponent onSubmit={handleFormSubmit} />;
}
