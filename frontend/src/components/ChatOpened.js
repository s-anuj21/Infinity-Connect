import React from "react";
import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./Modals/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "lottie-react";
import animationData from "./animations/typing.json";

import { ChatState } from "./Context/ChatProvider";
import UpdateGroupChatModal from "./Modals/UpdateGroupChatModel";

import io from "socket.io-client";
const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare, setTimeoutID;

function ChatOpened({ fetchAgain, setFetchAgain }) {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);

  // This variable is used for typing indicator
  const [isotherusertyping, setIsotherusertyping] = useState(false);

  // This variable is used for user who is typing
  const [typing, setTyping] = useState(false);

  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();

  const toast = useToast();

  // Setting up Socket IO, Connecting to Server and listening for typing event
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });

    socket.on("typing", () => {
      setIsotherusertyping(true);
    });

    socket.on("stop typing", () => {
      setIsotherusertyping(false);
    });
  }, []);

  /**
   * @description Fetching Messages of Selected Chat
   */
  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const { data } = await axios({
        url: `/api/message/${selectedChat._id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setMessages(data);

      // Socket IO Stuff
      socket.emit("join chat", selectedChat._id);
    } catch (err) {
      //   console.log(err);
      toast({
        title: "Error Fetching Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
    setLoading(false);
  };

  /**
   * @description Sending Message to Selected Chat
   * @param {Event} e on enter key
   */
  const sendMessage = async (e) => {
    if (e.key !== "Enter" || !newMessage) return;

    socket.emit("stop typing", selectedChat._id);

    try {
      const { data } = await axios({
        url: `/api/message`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        data: {
          content: newMessage,
          chatId: selectedChat._id,
        },
      });

      setNewMessage("");
      setMessages([...messages, data[0]]);
      socket.emit("new message", data[0]);
    } catch (err) {
      toast({
        title: "Error Sending Message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  /**
   * @description Sending Message to Selected Chat
   * @param {Event} e
   */
  const typingHandler = async (e) => {
    setNewMessage(e.target.value);

    // Typing Indicator Logic
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    const typingInterval = 3000;

    setTimeoutID = setTimeout(() => {
      socket.emit("stop typing", selectedChat._id);
      setTyping(false);

      clearTypingTimeout();
    }, typingInterval);
  };

  // Clearing Timeout
  const clearTypingTimeout = () => {
    if (setTimeoutID) {
      clearTimeout(setTimeoutID);
    }
  };

  // Fetching Messages on Selected Chat Change
  useEffect(() => {
    fetchMessages();
    // This variable is used to decide whether to give notification or not
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  // Socket IO Stuff , Listening for new messages
  useEffect(() => {
    if (!messages) return;
    socket.on("message received", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        // Give Notification
        setNotification([newMessageRecieved, ...notification]);
        setFetchAgain(!fetchAgain); // Refreshing
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  return (
    <>
      <Text
        fontSize={{ base: "28px", md: "30px" }}
        pb={3}
        px={2}
        w="100%"
        fontFamily="Work sans"
        display="flex"
        justifyContent={{ base: "space-between" }}
        alignItems="center"
      >
        <IconButton
          display={{ base: "flex", md: "none" }}
          icon={<ArrowBackIcon />}
          onClick={() => setSelectedChat("")}
        />
        {messages && !selectedChat.isGroupChat ? (
          <>
            {getSender(user, selectedChat.users)}
            <ProfileModal user={getSenderFull(user, selectedChat.users)} />
          </>
        ) : (
          <>
            {selectedChat.chatName.toUpperCase()}
            <UpdateGroupChatModal
              fetchMessages={fetchMessages}
              fetchAgain={fetchAgain}
              setFetchAgain={setFetchAgain}
            />
          </>
        )}
      </Text>
      <Box
        display="flex"
        flexDir="column"
        justifyContent="flex-end"
        p={3}
        bg="#E8E8E8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {loading ? (
          <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
        ) : (
          <div className="messages">
            <ScrollableChat messages={messages} />
          </div>
        )}

        <FormControl onKeyDown={sendMessage} id="first-name" isRequired mt={3}>
          {isotherusertyping ? (
            <div>
              <Lottie
                animationData={animationData}
                style={{
                  marginBottom: 15,
                  marginLeft: 0,
                  height: 50,
                  width: 70,
                }}
              />
            </div>
          ) : (
            <></>
          )}
          <Input
            variant="filled"
            bg="#E0E0E0"
            placeholder="Enter a message.."
            value={newMessage}
            onChange={typingHandler}
          />
        </FormControl>
      </Box>
    </>
  );
}

export default ChatOpened;
