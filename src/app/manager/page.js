'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import LogoutIcon from '@mui/icons-material/Logout';
import { LineChart } from '@mui/x-charts/LineChart';

const main_colour = '#FF0000';

function StatCard({ label, value }) {
    return (
        <Paper
            sx={{
                p: 2,
                textAlign: 'center',
                minHeight: 120,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
            }}
        >
            <Typography variant="subtitle2">{label}</Typography>
            <Typography variant="h5" sx={{ mt: 1 }}>
                {value}
            </Typography>
        </Paper>
    );
}

export default function ManagerPage() {
    const router = useRouter();
    const [stats, setStats] = React.useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalItemsSold: 0,
    });
    const [orders, setOrders] = React.useState([]);

    React.useEffect(() => {
        fetch('/api/manager')
            .then((res) => res.json())
            .then((data) => {
                setStats(data.stats || { totalOrders: 0, totalRevenue: 0, totalItemsSold: 0 });
                setOrders(Array.isArray(data.orders) ? data.orders : []);
            })
            .catch(console.error);
    }, []);

    // Prepare data for the revenue line chart
    const revenueChart = React.useMemo(() => {
        if (!orders.length) {
            return { labels: [], values: [] };
        }

        // sort by createdAt so the line goes in time order
        const sorted = [...orders].sort((a, b) =>
            new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
        );

        const labels = sorted.map((order, index) =>
            order.createdAt
                ? new Date(order.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                })
                : `#${index + 1}`
        );

        const values = sorted.map((order) => Number(order.total || 0));

        return { labels, values };
    }, [orders]);

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
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Manager Dashboard
                    </Typography>
                    <IconButton color="inherit" onClick={handleLogout}>
                        <LogoutIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Container sx={{ mt: 4 }} maxWidth="lg">
                {/* Top stats – centered */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 3,
                        flexWrap: 'wrap',
                        mb: 4,
                    }}
                >
                    <Grid container spacing={3} justifyContent="center">
                        <Grid item xs={12} md={4}>
                            <StatCard
                                label="Total Revenue Today"
                                value={`€${stats.totalRevenue.toFixed(2)}`}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <StatCard label="Total Orders Today" value={stats.totalOrders} />
                        </Grid>
                    </Grid>
                </Box>

                {/* Revenue line chart */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Revenue per Order
                    </Typography>
                    <Paper sx={{ p: 2 }}>
                        <LineChart
                            height={300}
                            xAxis={[{ data: revenueChart.labels }]}
                            series={[
                                {
                                    data: revenueChart.values,
                                    label: 'Order total (€)',
                                },
                            ]}
                        />
                    </Paper>
                </Box>

                {/* Recent orders table */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Recent Orders
                    </Typography>
                    <Paper>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Order ID</TableCell>
                                    <TableCell>Customer</TableCell>
                                    <TableCell>Placed At</TableCell>
                                    <TableCell align="right">Total (€)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order._id}>
                                        <TableCell>{order._id}</TableCell>
                                        <TableCell>{order.email}</TableCell>
                                        <TableCell>
                                            {order.createdAt
                                                ? new Date(order.createdAt).toLocaleString()
                                                : ''}
                                        </TableCell>
                                        <TableCell align="right">
                                            {Number(order.total).toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Box>
            </Container>
        </>
    );
}
