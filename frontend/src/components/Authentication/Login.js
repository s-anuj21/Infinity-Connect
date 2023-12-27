import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  FormControl,
  VStack,
  Input,
  FormLabel,
  InputGroup,
  InputRightElement,
  Button,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
function Login() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const history = useHistory();

  const toast = useToast();

  const handleClick = () => setShow(!show);

  const submitHandler = async () => {
    if (!email || !password) {
      toast({
        title: "Please fill all the details",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }

    try {
      const res = await axios({
        method: "POST",
        url: "/api/user/login",
        data: {
          email,
          password,
        },
      });

      console.log(res.data);

      if (res.data.status === "success") {
        toast({
          title: "Login Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }

      localStorage.setItem("userInfo", JSON.stringify(res.data));

      history.push("/chats");
    } catch (err) {
      console.log(err);
      toast({
        title: "Login Failed",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <VStack spacing="10px">
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
      <Button
        bg="#2c3e50"
        width="100%"
        style={{ marginTop: 15, color: "#fff" }}
        onClick={() => submitHandler()}
      >
        Login
      </Button>
    </VStack>
  );
}

export default Login;
