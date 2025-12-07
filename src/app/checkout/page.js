'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LogoutIcon from '@mui/icons-material/Logout';
import Box from '@mui/material/Box';

const main_colour = '#FF0000';

export default function CheckoutPage() {
    const router = useRouter();

    const [user, setUser] = React.useState(null);
    const [items, setItems] = React.useState([]);
    const [form, setForm] = React.useState({
        name: '',
        email: '',
        phone: '',
        address: '',
    });
    const [orderPlaced, setOrderPlaced] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');

    React.useEffect(() => {
        if (typeof window === 'undefined') return;

        const stored = window.localStorage.getItem('currentUser');
        const parsed = stored ? JSON.parse(stored) : null;
        setUser(parsed || {});

        if (parsed?.email) {
            setForm((prev) => ({ ...prev, email: parsed.email }));
        }
    }, []);

    React.useEffect(() => {
        if (!user) return;

        if (!user.email) {
            router.push('/login');
            return;
        }

        fetch(`/api/cart?action=view&email=${encodeURIComponent(user.email)}`)
            .then(async (res) => {
                const text = await res.text();
                try {
                    const data = text ? JSON.parse(text) : [];
                    return data;
                } catch (e) {
                    console.error('Cart API returned non-JSON in checkout:', text);
                    return [];
                }
            })
            .then((data) => {
                const normalised = data.map((item) => ({
                    ...item,
                    price: Number(item.price || 0),
                }));
                setItems(normalised);
            })
            .catch(console.error);
    }, [user, router]);

    const total = items.reduce((sum, item) => sum + Number(item.price || 0), 0);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        const qs = new URLSearchParams({
            email: form.email,
            name: form.name,
            phone: form.phone,
            address: form.address,
            total: String(total),
        }).toString();

        const res = await fetch(`/api/checkout?${qs}`);
        const json = await res.json();
        if (json.ok) {
            setOrderPlaced(true);
        } else {
            setErrorMessage('There was a problem placing your order.');
        }
    };

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            window.localStorage.removeItem('currentUser');
        }
        router.push('/login');
    };

    return (
        <>
            <AppBar position="static" sx={{ bgcolor: main_colour }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => router.push('/view_cart')}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Checkout
                    </Typography>
                    <IconButton color="inherit" onClick={handleLogout}>
                        <LogoutIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Container sx={{ mt: 4 }} maxWidth="lg">
                {orderPlaced ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mt: 6,
                        }}
                    >
                        <Paper
                            sx={{
                                p: 4,
                                width: '100%',
                                maxWidth: 800,
                            }}
                        >
                            <Typography variant="h4" align="center" gutterBottom>
                                Your order has been placed.
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Order details:
                            </Typography>

                            <Table size="small" sx={{ mt: 1 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Item</TableCell>
                                        <TableCell align="right">Price (€)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {items.map((item) => (
                                        <TableRow key={item._id}>
                                            <TableCell>{item.pname}</TableCell>
                                            <TableCell align="right">
                                                {Number(item.price || 0).toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell>
                                            <strong>Total</strong>
                                        </TableCell>
                                        <TableCell align="right">
                                            <strong>€{total.toFixed(2)}</strong>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Paper>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            gap: 3,
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                        }}
                    >
                        <Paper
                            sx={{
                                p: 2,
                                width: { xs: '100%', md: '35%' },
                            }}
                        >
                            <Typography variant="h6" gutterBottom>
                                Order Summary
                            </Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Item</TableCell>
                                        <TableCell align="right">Price (€)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {items.map((item) => (
                                        <TableRow key={item._id}>
                                            <TableCell>{item.pname}</TableCell>
                                            <TableCell align="right">
                                                {Number(item.price || 0).toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell>
                                            <strong>Total</strong>
                                        </TableCell>
                                        <TableCell align="right">
                                            <strong>€{total.toFixed(2)}</strong>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Paper>

                        <Paper
                            sx={{
                                p: 2,
                                flexGrow: 1,
                                width: { xs: '100%', md: '65%' },
                            }}
                        >
                            <Typography variant="h6" gutterBottom>
                                Your Details
                            </Typography>
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    required
                                    fullWidth
                                    margin="normal"
                                    label="Full Name"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                />
                                <TextField
                                    required
                                    fullWidth
                                    margin="normal"
                                    label="Email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Phone Number"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                />
                                <TextField
                                    required
                                    fullWidth
                                    multiline
                                    rows={3}
                                    margin="normal"
                                    label="Delivery Address"
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                />
                                {errorMessage && (
                                    <Typography sx={{ mt: 1 }} color="error">
                                        {errorMessage}
                                    </Typography>
                                )}
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        mt: 2,
                                        backgroundColor: main_colour,
                                        '&:hover': { backgroundColor: main_colour },
                                    }}
                                >
                                    Confirm Order
                                </Button>
                            </form>
                        </Paper>
                    </Box>
                )}
            </Container>
        </>
    );
}