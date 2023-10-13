import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChatEngine } from "react-chat-engine";
import { auth } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const Chats = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  const getFile = async (url) => {
    try {
      const response = await fetch(url);
      const data = await response.blob();
      return new File([data], "userPhoto.jpg", { type: "image/jpeg" });
    } catch (error) {
      console.error("Error fetching user photo:", error);
      return null;
    }
  };

  useEffect(() => {
    const setupChatEngine = async () => {
      if (!user) {
        navigate("/");
        return;
      }

      try {
        await axios.get("https://api.chatengine.io/users/me", {
          headers: {
            "project-id": "03a19186-498a-4282-8215-ee185590fda3",
            "user-name": user.email,
            "user-secret": user.uid,
          },
        });
        setLoading(false);
      } catch (error) {
        const formData = new FormData();
        formData.append("email", user.email);
        formData.append("username", user.displayName || user.email);
        formData.append("secret", user.uid);

        const avatar = await getFile(user.photoURL);
        if (avatar) {
          formData.append("avatar", avatar, avatar.name);

          try {
            await axios.post("https://api.chatengine.io/users/", formData, {
              headers: {
                "Private-key": "69326175-6fae-466d-9844-40900d3169ba",
              },
            });
            setLoading(false);
          } catch (error) {
            console.error("Error creating user:", error);
          }
        } else {
          console.error("User photo not found.");
          setLoading(false);
        }
      }
    };

    setupChatEngine();
  }, [user, navigate]);

  // if (!user || loading) {
  //   return (
  //     <div
  //       style={{
  //         color: "red",
  //         width: "100vw",
  //         height: "100vh",
  //         display: "flex",
  //         alignItems: "center",
  //         justifyContent: "center",
  //       }}
  //     >
  //       <h2>Loading...</h2>
  //     </div>
  //   );
  // }

  return (
    <div className="chat-page">
      <div className="nav-bar">
        <div className="logo-tab">Juba University Chat</div>
        <div className="logout-tab" onClick={handleLogout}>
          Logout
        </div>
      </div>

      <ChatEngine
        projectID="d0aa5ad2-826b-4240-892c-19801d933e60"
        userName={user.displayName}
        userSecret={user.uid}
        height="calc(100vh - 66px)"
      />
    </div>
  );
};

export default Chats;
