import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { useToast } from "@chakra-ui/react";
import {
  FormControl,
  VStack,
  Input,
  FormLabel,
  InputGroup,
  InputRightElement,
  Button,
} from "@chakra-ui/react";
import axios from "axios";

function Signup() {
  const [show, setShow] = useState(false);
  const history = useHistory();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pic, setPic] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const postDetails = async (pics) => {
    setLoading(true);

    if (pics === undefined) {
      toast({
        title: "Please Select an Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "infinity-connect");
      data.append("cloud_name", "dqhlrmd5l");

      try {
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dqhlrmd5l/image/upload",
          {
            method: "post",
            body: data,
          }
        );

        const result = await res.json();
        console.log(result.url.toString());
        setPic(result.url.toString());
        toast({
          title: "Upload Successful!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } catch (err) {
        console.log(err);
        toast({
          title: "Failed to Upload",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
      setLoading(false);
    }
  };
  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !cpassword) {
      toast({
        title: "Please fill all the details",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }

    if (password !== cpassword) {
      toast({
        title: "Passwords do not match",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }

    const data = {
      name,
      email,
      password,
      profilePic: pic,
    };

    try {
      const res = await axios({
        method: "post",
        url: "/api/user",
        data,
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast({
        title: "Registration Successful!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("user_info", JSON.stringify(res.data));

      setLoading(false);
      history.push("/chats");
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = () => setShow(!show);
  return (
    <VStack spacing="5px">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <Input
          type="password"
          placeholder="Confirm your Password"
          onChange={(e) => setCpassword(e.target.value)}
        />
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => {
            // Just taking the first img, even if multiple are selected
            postDetails(e.target.files[0]);
          }}
        />
      </FormControl>
      <Button
        bg="#2c3e50"
        width="100%"
        style={{ marginTop: 15, color: "#fff" }}
        onClick={() => submitHandler()}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
}

export default Signup;
