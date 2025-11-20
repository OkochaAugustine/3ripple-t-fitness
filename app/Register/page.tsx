"use client";

import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  Box,
  Heading,
  Input,
  Button,
  Text,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

// Background image
const backgroundImage = "/images/form-bg.png";

export default function RegisterPage() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    state: "",
    address: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const [sparkles, setSparkles] = useState<
    { top: number; left: number; size: number; opacity: number }[]
  >([]);

  useEffect(() => {
    setMounted(true);

    // Generate sparkle positions
    const arr = Array.from({ length: 3 }).map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: 2 + Math.random() * 4,
      opacity: 0.5 + Math.random() * 0.5,
    }));
    setSparkles(arr);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Simple email validation
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Submit
  const handleSubmit = async () => {
    if (!validateEmail(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
      } else if (data.error === "Email already registered") {
        alert("This email is already registered!");
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Registration failed. Please try again.");
    }
  };

  if (!mounted) return null; // Prevent SSR issues

  return (
    <ChakraProvider>
      <Box
        fontFamily="sans-serif"
        minH="100vh"
        w="100vw"
        bgImage={`url(${backgroundImage})`}
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
        display="flex"
        justifyContent="center"
        alignItems="center"
        px={4}
        position="relative"
      >
        {/* Sparkles */}
        {sparkles.map((s, i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              width: `${s.size}px`,
              height: `${s.size}px`,
              borderRadius: "50%", // FIXED
              background: "linear-gradient(45deg, pink, yellow, cyan)",
              top: `${s.top}%`,
              left: `${s.left}%`,
              opacity: s.opacity,
            }}
            animate={{ scale: [0.5, 1.2, 0.5], rotate: [0, 360] }}
            transition={{ duration: 1.5 + Math.random(), repeat: Infinity }}
          />
        ))}

        {!submitted ? (
          <Box
            bg="blackAlpha.700"
            p={8}
            borderRadius="2xl"
            boxShadow="xl"
            maxW="md"
            w="full"
          >
            <Heading textAlign="center" mb={6}>
              Carnival Registration
            </Heading>

            <VStack spacing={4}>
              <Input
                placeholder="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                bg="whiteAlpha.900"
                color="black"
              />
              <Input
                placeholder="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                bg="whiteAlpha.900"
                color="black"
              />
              <Input
                placeholder="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                bg="whiteAlpha.900"
                color="black"
              />
              <Input
                placeholder="State of Residence"
                name="state"
                value={formData.state}
                onChange={handleChange}
                bg="whiteAlpha.900"
                color="black"
              />
              <Input
                placeholder="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                bg="whiteAlpha.900"
                color="black"
              />

              <Button
                bg="pink.500"
                _hover={{ bg: "pink.600", transform: "scale(1.05)" }}
                color="white"
                w="full"
                onClick={handleSubmit}
              >
                Register
              </Button>
            </VStack>
          </Box>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            style={{ textAlign: "center" }}
          >
            <Heading fontSize={["4xl", "6xl"]} mb={4}>
              🎉 Registration Successful! 🎉
            </Heading>
            <Text fontSize={["lg", "2xl"]} mb={6}>
              Welcome to the Carnival Extravaganza!
            </Text>
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Text
                fontSize={["2xl", "3xl"]}
                fontWeight="bold"
                color="yellow.300"
              >
                Get ready to party and move with Trainer Tim!
              </Text>
            </motion.div>

            <Button
              mt={6}
              bg="pink.500"
              _hover={{ bg: "pink.600" }}
              color="white"
              onClick={() => router.push("/")}
            >
              ⬅ Back to Home
            </Button>
          </motion.div>
        )}
      </Box>
    </ChakraProvider>
  );
}
