"use client";

import React, { useEffect } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && typeof window !== 'undefined') {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Show loading while checking authentication
  if (loading || !user) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Dashboard
        </Typography>
        <Typography variant="h6" gutterBottom>
          Hello, {user.user?.username || 'User'}!
        </Typography>
        <Typography variant="body1">
          Role: {user.user?.role || 'N/A'}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="textSecondary">
            Login Status: {user.message}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
