"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore, auth } from "@/firebase";
import {
  Box,
  Modal,
  Stack,
  TextField,
  Typography,
  Button,
  Alert,
} from "@mui/material";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  query,
  setDoc,
  getDocs,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import ResponsiveAppBar from "./responsiveappbar.js"; // Import the ResponsiveAppBar

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [openAddItem, setOpenAddItem] = useState(false);
  const [openSearch, setOpenSearch] = useState(false); // State for search modal
  const [item, setItem] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [user, setUser] = useState(null); // State to track the logged-in user
  const [searchedItem, setSearchedItem] = useState(null); // State to track the searched item

  // Function to update inventory
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  // Function to add an item to the inventory
  const addItem = async (item) => {
    if (!user) {
      alert("You need to be signed in to add items.");
      return;
    }

    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });

      // If the searched item is the same as the item being added, update the searchedItem state
      if (searchedItem && searchedItem.name === item) {
        setSearchedItem({ name: item, quantity: quantity + 1 });
      }
    } else {
      await setDoc(docRef, { quantity: 1 });

      // If the searched item is the same as the item being added, update the searchedItem state
      if (searchedItem && searchedItem.name === item) {
        setSearchedItem({ name: item, quantity: 1 });
      }
    }
    await updateInventory();
  };

  // Function to remove an item from the inventory
  const removeItem = async (item) => {
    if (!user) {
      alert("You need to be signed in to remove items.");
      return;
    }

    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);

        // If the searched item is the same as the item being removed, clear the searchedItem state
        if (searchedItem && searchedItem.name === item) {
          setSearchedItem(null);
        }
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });

        // If the searched item is the same as the item being removed, update the searchedItem state
        if (searchedItem && searchedItem.name === item) {
          setSearchedItem({ name: item, quantity: quantity - 1 });
        }
      }
    }
    await updateInventory();
  };

  useEffect(() => {
    // Check for user authentication status
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set the user if logged in, or null if not
    });

    updateInventory(); // Update inventory on component mount

    return () => unsubscribe(); // Clean up the subscription on component unmount
  }, []);

  const handleOpenAddItem = () => {
    if (!user) {
      alert("You need to be signed in to add items.");
      return;
    }
    setOpenAddItem(true);
  };

  const handleCloseAddItem = () => setOpenAddItem(false);

  const handleOpenSearch = () => {
    setOpenSearch(true); // Open search modal for all users
  };

  const handleCloseSearch = () => setOpenSearch(false);

  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      alert("Please enter an item to search.");
      return;
    }

    const docRef = doc(
      collection(firestore, "inventory"),
      searchQuery.trim().toLowerCase()
    );
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setSearchedItem({
        name: searchQuery.trim(),
        quantity: docSnap.data().quantity,
      });
    } else {
      const addItemResponse = confirm(
        `Item: ${searchQuery} is not available. Would you like to add it to the inventory?`
      );
      if (addItemResponse && user) {
        await setDoc(docRef, { quantity: 1 });
        alert(
          `${searchQuery} has been added to the inventory with quantity: 1`
        );
        updateInventory(); // Update the inventory after adding the item
      } else if (addItemResponse && !user) {
        alert("You need to be signed in to add items.");
      } else {
        setSearchedItem(null); // Clear the searched item if not found
      }
    }

    setSearchQuery("");
    handleCloseSearch();
  };

  return (
    <>
      <ResponsiveAppBar />
      <Box
        width={{ xs: "100%", sm: "100vw" }}
        height={{ xs: "auto", sm: "100vh" }}
        display="flex"
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
        gap={{ xs: 1, sm: 2 }}
        padding={{ xs: 2, sm: 0 }} // Added padding for mobile
      >
        {!user && (
          <Alert severity="warning">
            You need to be signed in to manage the pantry.
          </Alert>
        )}
        <Modal open={openAddItem} onClose={handleCloseAddItem}>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            width={{ xs: "90%", sm: 400 }}
            bgcolor="white"
            border="2px solid #000"
            boxShadow={24}
            p={{ xs: 2, sm: 4 }}
            display="flex"
            flexDirection="column"
            gap={{ xs: 2, sm: 3 }}
            sx={{ transform: "translate(-50%,-50%)" }}
          >
            <Typography variant="h6">Add Item</Typography>
            <Stack
              width="100%"
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
            >
              <TextField
                label="Item Name"
                value={item}
                onChange={(e) => setItem(e.target.value)}
                fullWidth
              />
              <Button
                variant="contained" // Change to contained to match styling
                sx={{
                  my: 2,
                  color: "white",
                  backgroundColor: "#DD682B",
                  "&:hover": {
                    backgroundColor: "#B1541D",
                  },
                }}
                onClick={() => {
                  if (item.trim() === "") {
                    alert("Please enter an item before adding.");
                    handleCloseAddItem();
                    return;
                  }
                  addItem(item);
                  setItem("");
                  handleCloseAddItem();
                }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>

        <Modal open={openSearch} onClose={handleCloseSearch}>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            width={{ xs: "90%", sm: 400 }}
            bgcolor="white"
            border="2px solid #000"
            boxShadow={24}
            p={{ xs: 2, sm: 4 }}
            display="flex"
            flexDirection="column"
            gap={{ xs: 2, sm: 3 }}
            sx={{ transform: "translate(-50%,-50%)" }}
          >
            <Typography variant="h6">Search Item</Typography>
            <Stack
              width="100%"
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
            >
              <TextField
                label="Search Query"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
              />
              <Button
                variant="contained"
                sx={{
                  my: 2,
                  color: "white",
                  backgroundColor: "#DD682B",
                  "&:hover": {
                    backgroundColor: "#B1541D",
                  },
                }}
                onClick={handleSearch} // Handle search when the button is clicked
              >
                Search
              </Button>
            </Stack>
          </Box>
        </Modal>

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            onClick={handleOpenAddItem}
            disabled={!user}
            sx={{
              color: "white",
              backgroundColor: "#DD682B",
              "&:hover": {
                backgroundColor: "#B1541D",
              },
            }}
          >
            Add New Item
          </Button>
          <Button
            variant="contained"
            onClick={handleOpenSearch}
            sx={{
              color: "white",
              backgroundColor: "#DD682B",
              "&:hover": {
                backgroundColor: "#B1541D",
              },
            }}
          >
            Search
          </Button>
        </Stack>

        <Box border="1px solid #333" width={{ xs: "100%", sm: "auto" }}>
          <Box
            width={{ xs: "100%", sm: "800px" }} // Set width to 100% on small screens
            height="100px"
            bgcolor="#DD682B"
            display="flex"
            justifyContent="center"
            alignItems="center"
            padding={{ xs: 1, sm: 0 }}
          >
            <Typography
              variant={{ xs: "h4", sm: "h2" }}
              color="white"
              fontFamily="'Roboto', sans-serif"
              fontWeight="bold"
            >
              Pantry Items
            </Typography>
          </Box>

          <Stack
            width="100%"
            height={{ xs: "auto", sm: "300px" }}
            spacing={{ xs: 1, sm: 2 }}
            overflow="auto"
          >
            {searchedItem ? (
              <Box
                key={searchedItem.name}
                width="100%"
                minHeight="150px"
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems="center"
                padding={5}
                textAlign="center" // Centering text for mobile
              >
                <Typography variant={{ xs: "h5", sm: "h3" }} color="#333">
                  {searchedItem.name.charAt(0).toUpperCase() +
                    searchedItem.name.slice(1)}
                </Typography>
                <Typography variant={{ xs: "h5", sm: "h3" }} color="#333">
                  {searchedItem.quantity}
                </Typography>
                <Stack
                  direction="row"
                  spacing={{ xs: 1, sm: 2 }}
                  justifyContent="center"
                  marginTop={{ xs: 2, sm: 0 }}
                >
                  <Button
                    variant="contained"
                    onClick={() => addItem(searchedItem.name)}
                    disabled={!user}
                    sx={{
                      color: "white",
                      backgroundColor: "#DD682B",
                      "&:hover": {
                        backgroundColor: "#B1541D",
                      },
                    }}
                  >
                    Add
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => removeItem(searchedItem.name)}
                    disabled={!user}
                    sx={{
                      color: "white",
                      backgroundColor: "#DD682B",
                      "&:hover": {
                        backgroundColor: "#B1541D",
                      },
                    }}
                  >
                    Remove
                  </Button>
                </Stack>
              </Box>
            ) : (
              inventory.map(({ name, quantity }) => (
                <Box
                  key={name}
                  width="100%"
                  minHeight="150px"
                  display="flex"
                  flexDirection={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems="center"
                  padding={5}
                  textAlign="center" // Centering text for mobile
                >
                  <Typography variant={{ xs: "h5", sm: "h3" }} color="#333">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography variant={{ xs: "h5", sm: "h3" }} color="#333">
                    {quantity}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={{ xs: 1, sm: 2 }}
                    justifyContent="center"
                    marginTop={{ xs: 2, sm: 0 }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => addItem(name)}
                      disabled={!user}
                      sx={{
                        color: "white",
                        backgroundColor: "#DD682B",
                        "&:hover": {
                          backgroundColor: "#B1541D",
                        },
                      }}
                    >
                      Add
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => removeItem(name)}
                      disabled={!user}
                      sx={{
                        color: "white",
                        backgroundColor: "#DD682B",
                        "&:hover": {
                          backgroundColor: "#B1541D",
                        },
                      }}
                    >
                      Remove
                    </Button>
                  </Stack>
                </Box>
              ))
            )}
          </Stack>
        </Box>
      </Box>
    </>
  );
}
