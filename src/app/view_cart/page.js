'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LogoutIcon from '@mui/icons-material/Logout';

const main_colour = '#FF0000';

function getCurrentUser() {
    if (typeof window === 'undefined') return null;
    const stored = window.localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
}

export default function CartPage() {
    const router = useRouter();
    const [items, setItems] = React.useState([]);
    const user = getCurrentUser();

    React.useEffect(() => {
        if (!user?.email) {
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
                    console.error('Cart API returned non-JSON:', text);
                    return [];
                }
            })
            .then(setItems)
            .catch(console.error);
    }, [router, user]);

    const total = items.reduce((sum, item) => sum + (item.price || 0), 0);

    const handleRemove = async (id) => {
        await fetch(`/api/cart?action=remove&id=${id}`);
        setItems((prev) => prev.filter((item) => item._id !== id));
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
                        onClick={() => router.push('/customer')}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Cart
                    </Typography>
                    <IconButton color="inherit" onClick={handleLogout}>
                        <LogoutIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Container sx={{ mt: 4 }}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Items
                    </Typography>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Item</TableCell>
                                <TableCell align="right">Price (€)</TableCell>
                                <TableCell align="right">Delete Item</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map((row) => (
                                <TableRow key={row._id}>
                                    <TableCell>{row.pname}</TableCell>
                                    <TableCell align="right">
                                        {Number(row.price).toFixed(2)}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button
                                            onClick={() => handleRemove(row._id)}
                                            sx={{ color: main_colour }}
                                        >
                                            X
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Typography variant="subtitle1">
                            Total: €{total.toFixed(2)}
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: main_colour,
                                '&:hover': { backgroundColor: main_colour },
                            }}
                            onClick={() => router.push('/checkout')}
                        >
                            Proceed to Checkout
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </>
    );
}