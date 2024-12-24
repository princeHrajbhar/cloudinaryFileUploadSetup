"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";

interface FormComponentProps {
    onSubmit: (formData: { name: string; email: string; image: File | null }) => void;
    initialData?: { name: string; email: string; imageUrl: string | null }; // optional initial data for edit
}

export default function FormComponent({ onSubmit, initialData }: FormComponentProps) {
    const [image, setImage] = useState<File | null>(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    // Pre-populate form fields if initialData is provided (editing case)
    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setEmail(initialData.email);
        }
    }, [initialData]);

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, files, type } = e.target;
        if (type === "file" && files) setImage(files[0]);
        else if (name === "name") setName(value);
        else if (name === "email") setEmail(value);
    };

    const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit({ name, email, image });
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
            {initialData?.imageUrl && (
                <img
                    src={initialData.imageUrl}
                    alt="User Image"
                    className="w-32 h-32 object-cover rounded-full mt-4"
                />
            )}
            <button type="submit" className="bg-black px-4 py-2 rounded-sm text-white">
                {initialData ? "Update" : "Upload"}
            </button>
        </form>
    );
}
