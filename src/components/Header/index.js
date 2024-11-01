import React, { useEffect, useState } from "react";
import "./styles.css";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth"; // Import signOut
import { toast } from "react-toastify";
import userImg from "../../assets/user.svg"; // Default image

function Header() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState(userImg); // Default image state

  useEffect(() => {
    if (user) {
      // Set image source to user photoURL or default image
      setImageSrc(user.photoURL || userImg);
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  function logoutFnc() {
    signOut(auth)
      .then(() => {
        toast.success("Logged Out Successfully!");
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }

  const handleError = () => {
    setImageSrc(userImg); 
  };

  return (
    <div className="navbar">
      <p className="logo">TrackFunds</p>
      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <img
            src={imageSrc}
            alt="User Avatar"
            onError={handleError} // Handle image loading error
            style={{ borderRadius: "50%", height: "2em", width: "2rem" }}
          />
          <p className="logo link" onClick={logoutFnc}>
            Log Out
          </p>
        </div>
      )}
    </div>
  );
}

export default Header;
