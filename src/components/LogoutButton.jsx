import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function LogoutButton() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        background: "transparent",
        border: "none",
        color: "white",
        cursor: "pointer",
        padding: "8px 16px",
      }}
    >
      Logout
    </button>
  );
}
