import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/lib/auth";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      
      try {
        await logoutUser();
        navigate("/");
      } catch (err) {
        console.error("Logout failed:", err);
      }
    };

    doLogout();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-gray-600">Logging out...</p>
    </div>
  );
}