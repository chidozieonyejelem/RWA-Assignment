'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import Image from 'next/image';
import NextLink from 'next/link';

export default function GraphPage() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
    });

    useEffect(() => {
        fetch('/api/manager')
            .then((res) => res.json())
            .then((data) => {
                if (data && data.stats) {
                    setStats({
                        totalOrders: Number(data.stats.totalOrders || 0),
                        totalRevenue: Number(data.stats.totalRevenue || 0),
                    });
                }
            })
            .catch(console.error);
    }, []);

    const totalRevenueRounded = Number(stats.totalRevenue.toFixed(2));
    const barData = [stats.totalOrders, totalRevenueRounded];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
            <AppBar position="static" color="default" elevation={1}>
                <Toolbar
                    sx={{ display: 'flex', justifyContent: 'space-between', px: 3 }}
                >
                    <Stack direction="row" spacing={1} alignItems="center">
                        <NextLink href="/customer">
                            <Image
                                src="/images/mcdonalds.png"
                                width={45}
                                height={45}
                                alt="McDonalds logo"
                                style={{ cursor: 'pointer' }}
                            />
                        </NextLink>

                        <Typography variant="h5" sx={{ color: 'red', fontWeight: 'bold' }}>
                            McDONALDS
                        </Typography>
                    </Stack>

                    <Avatar
                        alt="Profile"
                        sx={{ width: 45, height: 45, cursor: 'pointer' }}
                    />
                </Toolbar>
            </AppBar>

            <Box sx={{ p: 4 }}>
                <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
                    Graph Data (Total Orders &amp; Revenue)
                </Typography>

                <BarChart
                    xAxis={[{ data: ['Total Orders', 'Total Revenue (€)'] }]}
                    series={[{ data: barData }]}
                    height={300}
                />
            </Box>
        </Box>
    );
}