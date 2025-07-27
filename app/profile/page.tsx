"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { axiosInstance } from "@/lib/axios";

interface User {
  name: string;
  email: string;
}

const ProfilePage = () => {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  const [user, setUser] = useState<User>({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const setUserstore = useAuthStore((state) => state.setUser);
  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      fetchProfile();
    }
  }, [token, router]);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get("/profile")
      setUser(res.data);
    } catch (error) {
       if (error instanceof AxiosError) {
         setMessage({ type: "error", text: error.response?.data?.error || "Error loading profile" });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await axiosInstance.put(
        "/profile",
        { name: user.name, email: user.email },
      );
      
      setUserstore(res.data);
      setUser(res.data);
      setMessage({ type: "success", text: "Profile updated successfully" });
    } catch (err) {
      if (err instanceof AxiosError) {
        setMessage({ type: "error", text: err.response?.data?.error || "Error updating profile" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4 text-black">
      <div className="max-w-md mx-auto bg-white p-6 shadow-md rounded-xl">
        <h2 className="text-2xl font-bold mb-4">My Profile</h2>

        {message && (
          <div
            className={`mb-4 p-3 rounded text-sm ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              name="name"
              value={user.name}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={user.email}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default ProfilePage;
