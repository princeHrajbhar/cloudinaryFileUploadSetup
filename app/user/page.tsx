"use client";
import Link from "next/link";
import Image from "next/image"; // Import the Image component
import { useEffect, useState } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  image_url: string;
}

export default function UserListPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/upload-image");
      const data = await res.json();
      console.log(data); // Log the response to verify the structure

      // Access the images array from the response
      if (data && Array.isArray(data.images)) {
        setUsers(data.images); // Set the images array to the state
      } else {
        console.error("Fetched data is not in expected format:", data);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/upload-image/${id}`, { method: "DELETE" });
    if (res.ok) {
      setUsers(users.filter((user) => user._id !== id));
    } else {
      console.error("Failed to delete user");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">User List</h1>
        <Link href="/" className="bg-blue-500 text-white px-4 py-2 rounded">
          Create User
        </Link>
      </div>

      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Image</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={4} className="border px-4 py-2 text-center">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id}>
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">
                  {user.image_url ? (
                    <Image
                      src={user.image_url}
                      alt="User"
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </td>
                <td className="border px-4 py-2">
                  <Link href={`/user/${user._id}`} className="text-blue-500 mr-4">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
