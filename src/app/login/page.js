'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from 'next/link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const main_colour = '#FF0000';

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = React.useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        const data = new FormData(event.currentTarget);
        const email = data.get('email');
        const pass = data.get('pass');

        try {
            const res = await fetch(
                `/api/login?email=${encodeURIComponent(
                    email
                )}&pass=${encodeURIComponent(pass)}`
            );

            const json = await res.json();
            console.log('Login API response:', json);

            if (!json.valid) {
                setError(json.error || 'Invalid email or password.');
                return;
            }

            const accountType = json.account_type || 'customer';

            if (typeof window !== 'undefined') {
                window.localStorage.setItem(
                    'currentUser',
                    JSON.stringify({ email, accountType })
                );
            }

            router.push(accountType === 'manager' ? '/manager' : '/customer');
        } catch (err) {
            console.error('Network / parse error:', err);
            setError('Network error contacting the server.');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: main_colour }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Login to Your Account
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="pass"
                        label="Password"
                        type="password"
                        id="pass"
                        autoComplete="current-password"
                    />
                    {error && (
                        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                            {error}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3,
                            mb: 2,
                            backgroundColor: main_colour,
                            '&:hover': { backgroundColor: main_colour },
                        }}
                    >
                        Login Now
                    </Button>
                    <Grid container justifyContent="center">
                        <Grid item>
                            <Link href="/register">
                                <Typography variant="body2" sx={{ cursor: 'pointer' }}>
                                    Don&apos;t have an account? Register here
                                </Typography>
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}