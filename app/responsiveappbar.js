import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import Image from "next/image";
import { getAuth, signOut, deleteUser } from "firebase/auth";

const settings = ["signup", "login"]; // Use lowercase for paths

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [user, setUser] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // State for dialog

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    await signOut(auth);
    handleCloseUserMenu();
  };

  const handleDeleteAccount = () => {
    setOpenDeleteDialog(true); // Open the confirmation dialog
  };

  const confirmDeleteAccount = async () => {
    if (user) {
      await deleteUser(user);
    }
    setOpenDeleteDialog(false); // Close the dialog after deletion
    handleCloseUserMenu();
  };

  const handleCloseDialog = () => {
    setOpenDeleteDialog(false); // Close the dialog without deleting
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#000000" }}>
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              justifyContent: { xs: "space-between", md: "space-between" },
            }}
          >
            {/* Logo for small screens (left-aligned) */}
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <Image
                src="/logo.png" // Replace with the path to your logo image
                alt="Logo"
                width={40} // Adjust width as needed
                height={39} // Adjust height as needed
              />
            </Box>

            {/* Logo for large screens (left-aligned) */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <Image
                src="/logo_text.png" // Replace with the path to your logo image
                alt="Logo"
                width={200} // Adjust width as needed
                height={50} // Adjust height as needed
                style={{ objectFit: "contain" }}
              />
            </Box>

            {/* Menu icon for small screens (right-aligned) */}
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                alignItems: "center",
                justifyContent: "flex-end", // Align menu icon to the right on small screens
              }}
            >
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseNavMenu}>
                    <Link href={`/${setting}`} passHref>
                      <Typography textAlign="center" component="a">
                        {setting.charAt(0).toUpperCase() + setting.slice(1)}{" "}
                        {/* Capitalize the first letter */}
                      </Typography>
                    </Link>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* Conditional rendering based on authentication state */}
            {user ? (
              // User is logged in
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end", // Align settings to the right
                }}
              >
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={user.displayName || "User"}
                    src={user.photoURL || ""}
                  />
                </IconButton>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={handleLogout}>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleDeleteAccount}>
                    <Typography textAlign="center" color="red">
                      Delete Account
                    </Typography>
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              // User is not logged in
              <Box
                sx={{
                  display: { xs: "none", md: "flex" }, // Only show on large screens
                  alignItems: "center",
                  justifyContent: "flex-end", // Align settings to the right
                }}
              >
                <Link href="/signup" passHref>
                  <Button
                    sx={{
                      my: 2,
                      mx: 1, // Adds horizontal margin to create space between buttons
                      color: "white", // Text color
                      backgroundColor: "#DD682B", // Background color
                      "&:hover": {
                        backgroundColor: "#B1541D", // Background color on hover
                      },
                    }}
                  >
                    Sign up
                  </Button>
                </Link>

                <Link href="/login" passHref>
                  <Button
                    sx={{
                      my: 2,
                      mx: 1, // Adds horizontal margin to create space between buttons
                      color: "white", // Text color
                      backgroundColor: "#DD682B", // Background color
                      "&:hover": {
                        backgroundColor: "#B1541D", // Background color on hover
                      },
                    }}
                  >
                    Login
                  </Button>
                </Link>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Delete Account Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" color="red">
          {"Delete Account"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete your account? This action is
            irreversible, and all your data will be permanently deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={confirmDeleteAccount}
            sx={{ color: "red" }} // Set text color to red
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ResponsiveAppBar;
