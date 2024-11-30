"use client"
import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

export default function Home() {
    const [image, setImage] = useState<File | null>(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.type === "file" && e.target.files) {
            setImage(e.target.files[0]);
        } else if (e.target.name === "name") {
            setName(e.target.value);
        } else if (e.target.name === "email") {
            setEmail(e.target.value);
        }
    };

    const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (!image || !name || !email) {
                alert("Please provide all required fields.");
                return;
            }

            const formData = new FormData();
            formData.append("image", image);
            formData.append("name", name);
            formData.append("email", email);

            const response = await axios.post("/api/upload-image", formData);
            console.log("Response:", response.data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error:", error.message);
            } else {
                console.error("An unexpected error occurred");
            }
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className="w-1/2 mx-auto py-10 space-y-4">
            <input
                type="text"
                name="name"
                placeholder="Name"
                value={name}
                onChange={onChangeHandler}
                className="border p-2 w-full"
            />
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={onChangeHandler}
                className="border p-2 w-full"
            />
            <input
                type="file"
                onChange={onChangeHandler}
                className="border p-2 w-full"
            />
            <button
                type="submit"
                className="bg-black px-4 py-2 rounded-sm text-white"
            >
                Upload
            </button>
        </form>
    );
}
