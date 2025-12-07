'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LogoutIcon from '@mui/icons-material/Logout';

const main_colour = '#FF0000';

function getCurrentUser() {
    if (typeof window === 'undefined') return null;
    const stored = window.localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
}

export default function CustomerPage() {
    const router = useRouter();
    const [products, setProducts] = React.useState([]);
    const [cartCount, setCartCount] = React.useState(0);
    const [weather, setWeather] = React.useState(null);

    const user = getCurrentUser();

    React.useEffect(() => {
        fetch('/api/getProducts')
            .then((res) => res.json())
            .then(setProducts)
            .catch(console.error);

        fetch(
            'https://api.open-meteo.com/v1/forecast?latitude=53.3331&longitude=-6.2489&hourly=temperature_2m'
        )
            .then((res) => res.json())
            .then((data) => {
                const temps = data?.hourly?.temperature_2m;
                if (Array.isArray(temps) && temps.length > 0) {
                    setWeather(temps[0]);
                }
            })
            .catch(console.error);
    }, []);

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            window.localStorage.removeItem('currentUser');
        }
        router.push('/login');
    };

    const goToCart = () => {
        router.push('/view_cart');
    };

    const putInCart = async (item) => {
        if (!user?.email) {
            router.push('/login');
            return;
        }

        try {
            const res = await fetch(
                `/api/cart?action=add&pname=${encodeURIComponent(
                    item.pname
                )}&price=${encodeURIComponent(
                    item.price
                )}&email=${encodeURIComponent(user.email)}`
            );

            const text = await res.text();
            let json;
            try {
                json = text ? JSON.parse(text) : null;
            } catch (e) {
                console.error('cart add returned non-JSON:', text);
                alert('Error adding to cart. Check console for details.');
                return;
            }

            if (!res.ok || !json?.ok) {
                alert('Error adding to cart: ' + (json?.error || 'Unknown error'));
                return;
            }

            setCartCount((c) => c + 1);
        } catch (err) {
            console.error('cart add fetch error:', err);
            alert('Network error adding to cart.');
        }
    };

    return (
        <>
            <AppBar position="static" sx={{ bgcolor: main_colour }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        McDonald&apos;s Menu
                    </Typography>

                    {weather !== null && (
                        <Typography sx={{ mr: 2 }} variant="body2">
                            Current temp: {weather.toFixed(1)}°C
                        </Typography>
                    )}

                    <IconButton color="inherit" onClick={goToCart}>
                        <Badge
                            badgeContent={cartCount}
                            sx={{
                                '& .MuiBadge-badge': {
                                    bgcolor: 'black',   // circle is black
                                    color: 'white',     // number text is white
                                },
                            }}
                        >
                            <ShoppingCartIcon />
                        </Badge>
                    </IconButton>
                    <IconButton color="inherit" onClick={handleLogout}>
                        <LogoutIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Container sx={{ mt: 4 }} maxWidth="lg">
                <Grid container spacing={3}>
                    {products.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item._id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                {item.imageUrl && (
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={item.imageUrl}
                                        alt={item.pname}
                                    />
                                )}
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h6">
                                        {item.pname}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {item.description}
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ mt: 1 }}>
                                        €{Number(item.price).toFixed(2)}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        sx={{
                                            backgroundColor: main_colour,
                                            '&:hover': { backgroundColor: main_colour },
                                        }}
                                        onClick={() => putInCart(item)}
                                    >
                                        Add to Cart
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </>
    );
}