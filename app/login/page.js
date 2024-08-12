"use client"; // This directive tells Next.js that this is a client-side component

import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "next/link"; // Correct usage of next/link
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { auth, signInWithEmailAndPassword } from "/firebase"; // Import from your firebase.js
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert"; // Import Alert component

const defaultTheme = createTheme();

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
        Pantry Tracker
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function SignIn() {
  const router = useRouter();

  // Define state for email, password, and error message
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State to manage error messages

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password to sign in.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/"); // Redirect after successful login
    } catch (error) {
      // Handle errors (e.g., wrong email or password)
      setError("Incorrect email or password. Please try again.");
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "#DD682B" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}{" "}
          {/* Display error message */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email} // Bind the input to email state
              onChange={(e) => setEmail(e.target.value)} // Update email state
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password} // Bind the input to password state
              onChange={(e) => setPassword(e.target.value)} // Update password state
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 0,
                backgroundColor: "#DD682B",
                "&:hover": {
                  backgroundColor: "#B1541D",
                },
              }}
            >
              Sign In
            </Button>
          </Box>
          <Link href="/" passHref>
            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 1,
                mb: 2,
                backgroundColor: "#DD682B",
                "&:hover": {
                  backgroundColor: "#B1541D",
                },
              }}
            >
              Back
            </Button>
          </Link>
          <Grid container>
            <Grid item>
              <Link href="/signup" passHref>
                <Typography variant="body2">
                  Don&apos;t have an account? Sign Up
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
