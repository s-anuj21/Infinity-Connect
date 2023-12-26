import React, { useEffect } from "react";
import axios from "axios";

function ChatPage() {
  const fetchChats = async () => {
    console.log("HI");
    const response = await axios.get("/api/chat");
    console.log(response);
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return <div>ChatPage</div>;
}

export default ChatPage;
