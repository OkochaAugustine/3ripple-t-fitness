"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ChakraProvider,
  Box,
  Flex,
  Button,
  Heading,
  Text,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

// Assets
const logo = "/images/logo.jpg";
const heroImages = [
  "/images/hero.jpg",
  "/images/hero2.jpg",
  "/images/hero3.jpg",
  "/images/hero4.jpg",
];
const carnivalVideo1 = "/videos/carnival-video.mp4";
const carnivalVideo2 = "/videos/carnival-video2.mp4";

// Sparkle component (client-only)
const Sparkle = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const top = Math.random() * 100;
  const left = Math.random() * 100;
  const size = 2 + Math.random() * 4;
  const opacity = 0.5 + Math.random() * 0.5;

  return (
    <motion.div
      style={{
        position: "absolute",
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        background: "linear-gradient(45deg, pink, yellow, cyan)",
        top: `${top}%`,
        left: `${left}%`,
        opacity,
      }}
      animate={{ scale: [0.5, 1.2, 0.5], rotate: [0, 360] }}
      transition={{ duration: 1.5 + Math.random(), repeat: Infinity }}
    />
  );
};

export default function Home() {
  const router = useRouter();
  const eventDate = new Date("2025-12-25T06:00:00");

  // ================== Hooks ==================
  const [mounted, setMounted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [showVideo, setShowVideo] = useState(false);
  const [videoIndex, setVideoIndex] = useState(0);
  const videoRefs = [useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null)];
  const rotatingWords = ["POWER", "ENERGY", "COMPETITION", "TRANSFORMATION"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // Mounted (prevent hydration error)
  useEffect(() => setMounted(true), []);

  // Countdown
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      const diff = eventDate.getTime() - new Date().getTime();
      setTimeLeft({
        days: Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))),
        hours: Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24)),
        minutes: Math.max(0, Math.floor((diff / (1000 * 60)) % 60)),
        seconds: Math.max(0, Math.floor((diff / 1000) % 60)),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [mounted]);

  // Hero image rotation
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(
      () => setCurrentImageIndex((prev) => (prev + 1) % heroImages.length),
      6000
    );
    return () => clearInterval(interval);
  }, [mounted]);

  // Rotating words
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(
      () => setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length),
      1500
    );
    return () => clearInterval(interval);
  }, [mounted]);

  // Video popup
  useEffect(() => {
    if (!mounted) return;
    const timer = setTimeout(() => {
      setShowVideo(true);
      document.body.style.overflow = "hidden";
      videoRefs[0].current?.play().catch(() => {});
    }, 4000);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "auto";
    };
  }, [mounted]);

  const handleVideoEnded = () => {
    if (videoIndex === 0) {
      setVideoIndex(1);
      setTimeout(() => videoRefs[1].current?.play().catch(() => {}), 300);
    } else {
      setShowVideo(false);
      document.body.style.overflow = "auto";
    }
  };

  // ================== Render ==================
  if (!mounted) return <Box h="100vh" w="100vw" bg="black" />;

  return (
    <ChakraProvider>
      <Box fontFamily="sans-serif" color="white" overflow="hidden" bg="black">
        {/* NAVBAR */}
        <Flex
          as="nav"
          position="fixed"
          top={0}
          left={0}
          w="100%"
          h={["16", "20"]}
          bg="black"
          zIndex={50}
          align="center"
          px={[4, 8]}
          justify="space-between"
        >
          <Box display="flex" alignItems="center">
            <Box
              as="img"
              src={logo}
              alt="Logo"
              h={["3rem", "4rem", "4.5rem"]}
              w="auto"
              objectFit="contain"
            />
          </Box>
          <Box position="relative">
            <Button
              bg="pink.500"
              color="white"
              fontWeight="bold"
              py={2}
              px={6}
              borderRadius="full"
              _hover={{ bg: "pink.600", transform: "scale(1.05)" }}
              onClick={() => router.push("/Register")}
            >
              Register Now
            </Button>
            {/* Hydration-safe sparkles */}
            {mounted && Array.from({ length: 3 }).map((_, i) => <Sparkle key={i} />)}
          </Box>
        </Flex>

        {/* HERO */}
        <Box position="relative" h="100vh" w="100vw" pt="20">
          {/* Background */}
          {heroImages.map((img, idx) => (
            <Box
              key={idx}
              as="img"
              src={img}
              alt=""
              position="absolute"
              inset={0}
              w="100%"
              h="100%"
              objectFit="cover"
              transition="opacity 1.2s ease-in-out"
              opacity={idx === currentImageIndex ? 1 : 0}
            />
          ))}
          <Box position="absolute" inset={0} bg="blackAlpha.600" />

          {/* HERO TEXT */}
          <Box
            position="relative"
            zIndex={20}
            textAlign="center"
            px={4}
            maxW="3xl"
            mx="auto"
            mt={[24, 28, 32]}
          >
            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <Heading
                fontSize={["3xl", "4xl", "4.5xl"]}
                fontWeight="800"
                textTransform="uppercase"
                bgGradient="linear(to-r, pink.300, yellow.300, red.400)"
                bgClip="text"
                letterSpacing="wide"
              >
                Asaba Fitness Carnival 2025
              </Heading>
            </motion.div>

            {/* Subheading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <Text
                fontSize={["lg", "xl", "2xl"]}
                fontWeight="bold"
                mt={2}
                color="pink.200"
              >
                With Trainer Tim
              </Text>
            </motion.div>

            {/* Rotating Words */}
            <AnimatePresence mode="wait">
              <motion.div
                key={rotatingWords[currentWordIndex]}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Text
                  fontSize={["2xl", "3xl"]}
                  fontWeight="extrabold"
                  mt={4}
                  color="yellow.300"
                >
                  {rotatingWords[currentWordIndex]}
                </Text>
              </motion.div>
            </AnimatePresence>

            {/* Hero Description & Countdown Explanation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              style={{ marginTop: "20px" }}
            >
              <Text
                fontSize={["md", "lg"]}
                color="white"
                fontWeight="semibold"
                mb={2}
              >
                📍 Venue: Dome Event Center, Asaba
              </Text>
              <Text
                fontSize={["md", "lg"]}
                color="white"
                fontWeight="semibold"
                mb={4}
              >
                🎉 December 25th • 6:00 AM
              </Text>

              <Text
                mt={2}
                fontSize={["sm", "md"]}
                color="whiteAlpha.800"
                px={[2, 4]}
                lineHeight="1.6"
              >
                Join the ultimate fitness carnival featuring Street Carnival Invasion, Workout Party, Glow in the Dark Fitness Rave, Fitness Contests & more. Enjoy Music, Games, Face Painting, Drinks & Food!{" "}
                <Text as="span" fontWeight="bold" color="pink.400">
                  Time is running out!
                </Text>{" "}
                Our countdown shows how close we are — register now to secure your spot before it’s too late!
              </Text>
            </motion.div>

            {/* Countdown */}
            <Flex
              justify="center"
              gap={[2, 4]}
              fontSize={["lg", "2xl"]}
              fontWeight="bold"
              mt={6}
              wrap="wrap"
            >
              {["Days", "Hours", "Minutes", "Seconds"].map((label, i) => (
                <Box
                  key={i}
                  bg="whiteAlpha.200"
                  backdropFilter="blur(10px)"
                  px={[3, 5]}
                  py={[3, 4]}
                  borderRadius="xl"
                  border="1px solid whiteAlpha.300"
                  shadow="xl"
                  minW="85px"
                  textAlign="center"
                >
                  <Text>
                    {i === 0
                      ? timeLeft.days
                      : i === 1
                      ? timeLeft.hours
                      : i === 2
                      ? timeLeft.minutes
                      : timeLeft.seconds}
                  </Text>
                  <Text fontSize="sm" textTransform="uppercase">
                    {label}
                  </Text>
                </Box>
              ))}
            </Flex>

            {/* Call to Action */}
            <Button
              mt={6}
              bg="pink.500"
              color="white"
              fontWeight="bold"
              py={4}
              px={10}
              borderRadius="full"
              fontSize={["md", "lg"]}
              _hover={{ bg: "pink.600", transform: "scale(1.05)" }}
              onClick={() => router.push("/app/register")}
            >
              ⏳ Register Now & Secure Your Spot
            </Button>
          </Box>
        </Box>

        {/* VIDEO POPUP */}
        <AnimatePresence>
          {showVideo && (
            <Box
              position="fixed"
              inset={0}
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg="blackAlpha.900"
              zIndex={9999}
            >
              <Box
                position="relative"
                w="full"
                h="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Button
                  position="absolute"
                  top={6}
                  right={6}
                  w={14}
                  h={14}
                  fontSize="4xl"
                  bg="red.600"
                  _hover={{ bg: "red.500" }}
                  borderRadius="full"
                  onClick={() => {
                    setShowVideo(false);
                    document.body.style.overflow = "auto";
                  }}
                  zIndex={10000}
                >
                  ✕
                </Button>
                <video
                  ref={videoRefs[videoIndex]}
                  src={videoIndex === 0 ? carnivalVideo1 : carnivalVideo2}
                  autoPlay
                  muted
                  playsInline
                  onEnded={handleVideoEnded}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </Box>
            </Box>
          )}
        </AnimatePresence>
      </Box>
    </ChakraProvider>
  );
}
