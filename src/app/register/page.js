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
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

const main_colour = '#FF0000';

export default function RegisterPage() {
    const router = useRouter();
    const [message, setMessage] = React.useState('');
    const [error, setError] = React.useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        setError('');

        const data = new FormData(event.currentTarget);
        const email = data.get('email');
        const pass = data.get('pass');
        const confirm = data.get('confirm');

        if (pass !== confirm) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const res = await fetch(
                `/api/register?email=${encodeURIComponent(
                    email
                )}&pass=${encodeURIComponent(
                    pass
                )}&account_type=customer`
            );
            const json = await res.json();
            if (json.ok) {
                setMessage('Account created! You can now log in.');
                setTimeout(() => router.push('/login'), 1000);
            } else {
                setError(json.error || 'There was a problem registering.');
            }
        } catch (err) {
            console.error('Register error:', err);
            setError('Network error while registering.');
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
                    <PersonAddAltIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Register
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
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirm"
                        label="Confirm Password"
                        type="password"
                        id="confirm"
                    />

                    {error && (
                        <Typography sx={{ mt: 1 }} color="error">
                            {error}
                        </Typography>
                    )}
                    {message && (
                        <Typography sx={{ mt: 1 }} color="primary">
                            {message}
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
                        Register
                    </Button>
                    <Grid container justifyContent="center">
                        <Grid item>
                            <Link href="/login">
                                <Typography variant="body2" sx={{ cursor: 'pointer' }}>
                                    Already have an account? Login
                                </Typography>
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}