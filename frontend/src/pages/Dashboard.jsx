import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../App.css";

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (userData && token) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);

                axios
                    .get("http://127.0.0.1:8000/api/dashboard", {
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    })
                    .then((response) => {
                        console.log("Dashboard data:", response.data);
                    })
                    .catch((error) => {
                        setError("Failed to fetch dashboard data.");
                        console.error(error);
                    });
            } catch (error) {
                console.error("Failed to parse user data:", error);
                localStorage.removeItem("user");
                navigate("/login");
            } finally {
                setLoading(false);
            }
        } else {
            navigate("/login");
        }
    }, [navigate]);

    // Logout function
    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("token");
            console.log("Token being sent:", localStorage.getItem("token"));
            if (!token) {
                throw new Error("No token found in localStorage");
            }

            await axios.post(
                "http://127.0.0.1:8000/api/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );



            // Clear local storage
            localStorage.removeItem("user");
            localStorage.removeItem("token");

            // Redirect to login
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
            setError("Failed to log out.");
        }
    };

    if (loading)
        return <p className="text-center text-gray-500 text-lg">Loading...</p>;

    return (
        <div className="container mx-auto mt-10">
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg mx-auto">
                <h2 className="text-center text-blue-500 text-2xl font-semibold mb-6">
                    Welcome to Your Dashboard
                </h2>
                {error && (
                    <p className="text-center text-red-500 text-sm mb-4">{error}</p>
                )}
                {user && (
                    <div className="bg-blue-100 text-blue-700 p-4 rounded-lg text-center mb-6">
                        <p>
                            Hello, <span className="font-bold">{user.name}</span>!
                        </p>
                        <p>Your email: {user.email}</p>
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 mx-auto block transition duration-200"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
