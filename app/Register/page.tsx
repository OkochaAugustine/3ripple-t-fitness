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

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

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

  if (!mounted) return null;

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
              borderRadius: "50%",
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
          /* FORM CARD */
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
          /* SUPER PREMIUM SUCCESS SCREEN */
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ textAlign: "center", position: "relative" }}
          >
            {/* Floating particles */}
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                style={{
                  position: "absolute",
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.9)",
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  filter: "blur(1px)",
                }}
                animate={{
                  y: [-10, 10, -10],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 3 + Math.random() * 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}

            {/* GOLD GRADIENT HEADER */}
            <Heading
              fontSize={["4xl", "6xl"]}
              mb={4}
              bgGradient="linear(to-r, #FFD700, #FFF5A5, #FFD700)"
              bgClip="text"
              fontWeight="extrabold"
              textShadow="0 0 25px rgba(255,215,0,0.6)"
            >
              🎉 Registration Successful! 🎉
            </Heading>

            {/* ELECTRIC BLUE BOX */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
            >
              <Box
                bg="linear-gradient(135deg, #005eff, #00a2ff)"
                color="white"
                px={6}
                py={4}
                borderRadius="lg"
                mb={8}
                boxShadow="0 0 25px rgba(0,140,255,0.7)"
                fontSize={["lg", "2xl"]}
                fontWeight="semibold"
                style={{ backdropFilter: "blur(6px)" }}
              >
                Welcome to the Carnival Extravaganza!
              </Box>
            </motion.div>

            {/* TRAINER TIM MESSAGE */}
            <motion.div
              animate={{ rotate: [0, 4, -4, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Text
                fontSize={["2xl", "3xl"]}
                fontWeight="bold"
                px={6}
                py={3}
                borderRadius="lg"
                bg="linear-gradient(135deg, #007bff, #009dff)"
                color="white"
                boxShadow="0 0 20px rgba(0,140,255,0.8)"
                mb={10}
              >
                Get ready to party and move with Trainer Tim!
              </Text>
            </motion.div>

            {/* WHATSAPP GLOW CTA */}
            <motion.a
              href="https://wa.me/2348182787631?text=Hello!%20I%20just%20registered%20for%20the%20Delta%20Fitness%20Carnival."
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-block" }}
              initial={{ scale: 0.9 }}
              animate={{
                scale: [1, 1.12, 1],
                boxShadow: [
                  "0 0 15px #25D366",
                  "0 0 35px #25D366",
                  "0 0 15px #25D366",
                ],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.8,
                ease: "easeInOut",
              }}
            >
              <Box
                bg="#25D366"
                color="white"
                px={10}
                py={4}
                borderRadius="full"
                fontSize="xl"
                fontWeight="extrabold"
                mb={6}
                textShadow="0 0 10px rgba(0,0,0,0.4)"
              >
                💬 Tap Here to Join WhatsApp Updates
              </Box>
            </motion.a>

            <Button
              mt={4}
              bg="pink.500"
              _hover={{ bg: "pink.600", transform: "scale(1.05)" }}
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
