import React from "react";
import { Box, Text } from "@chakra-ui/layout";
import "./style.css";
import { ChatState } from "./Context/ChatProvider";

import ChatOpened from "./ChatOpened";

function SingleChat({ fetchAgain, setFetchAgain }) {
  const { selectedChat } = ChatState();
  return (
    <>
      {selectedChat ? (
        <ChatOpened fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      ) : (
        // to get socket.io on same page
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
}

export default SingleChat;
