"use client";

import React, { useEffect, useState } from "react";
import {
  ChakraProvider,
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Text,
  TableContainer,
} from "@chakra-ui/react";

export default function AdminPage() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const res = await fetch("/api/register");
        const data = await res.json();
        if (data.success) {
          setRegistrations(data.registrations);
        }
      } catch (err) {
        console.error("Failed to fetch registrations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  return (
    <ChakraProvider>
      <Box p={{ base: 4, md: 8 }}>
        <Heading mb={6} fontSize={{ base: "2xl", md: "4xl" }}>
          Admin Dashboard - Registrations
        </Heading>

        {loading ? (
          <Spinner size="xl" />
        ) : registrations.length === 0 ? (
          <Text>No registrations yet.</Text>
        ) : (
          <TableContainer overflowX="auto">
            <Table variant="striped" colorScheme="pink" size={{ base: "sm", md: "md" }}>
              <Thead>
                <Tr>
                  <Th>Timestamp</Th>
                  <Th>Full Name</Th>
                  <Th>Email</Th>
                  <Th>Phone</Th>
                  <Th>State</Th>
                  <Th>Address</Th>
                </Tr>
              </Thead>
              <Tbody>
                {registrations.map((reg, i) => (
                  <Tr key={i}>
                    <Td>{reg.timestamp}</Td>
                    <Td>{reg.fullName}</Td>
                    <Td>{reg.email}</Td>
                    <Td>{reg.phone}</Td>
                    <Td>{reg.state}</Td>
                    <Td>{reg.address}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </ChakraProvider>
  );
}
