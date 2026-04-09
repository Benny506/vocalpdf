import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';
import { MdMenuBook, MdTimer, MdAutoGraph, MdTrendingUp, MdOutlineSdStorage } from 'react-icons/md';
import { supabase } from '../../../supabase/supabaseClient';
import { useSelector } from 'react-redux';
import { selectAuth } from '../../store/slices/authSlice';

const StatCard = ({ icon, label, value, trend, color, subtitle }) => (
    <motion.div 
        whileHover={{ y: -5 }}
        className="glass-panel p-4 rounded-5 shadow-sm h-100 d-flex flex-column justify-content-between"
    >
        <div className="d-flex justify-content-between align-items-start mb-3">
            <div className={`p-3 rounded-4 bg-${color} bg-opacity-10 text-${color}`}>
                {icon}
            </div>
            {trend && (
                <span className="badge bg-success-subtle text-success rounded-pill px-2 py-1 smaller">
                    <MdTrendingUp size={14} className="me-1" /> {trend}
                </span>
            )}
        </div>
        <div>
            <h3 className="h2 fw-bold text-dark mb-1 tracking-tighter">{value}</h3>
            <p className="small text-secondary fw-medium mb-0 uppercase tracking-wider">{label}</p>
            {subtitle && <p className="smaller text-secondary opacity-50 mb-0">{subtitle}</p>}
        </div>
    </motion.div>
);

export const Overview = () => {
    const { user } = useSelector(selectAuth);
    const [stats, setStats] = useState({
        docCount: 0,
        totalSize: 0,
        activity: []
    });
    const [loading, setLoading] = useState(true);

    const fetchRealData = async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('vp_documents')
                .select('created_at, size')
                .order('created_at', { ascending: true });

            if (error) throw error;

            // 1. Process Stats
            const count = data?.length || 0;
            const sizeInBytes = data?.reduce((acc, curr) => acc + (curr.size || 0), 0) || 0;
            const sizeMB = (sizeInBytes / (1024 * 1024)).toFixed(1);

            // 2. Process Activity (Group uploads by day for the chart)
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const activityMap = data?.reduce((acc, curr) => {
                const day = days[new Date(curr.created_at).getDay()];
                acc[day] = (acc[day] || 0) + 1;
                return acc;
            }, {});

            const chartData = days.map(day => ({
                name: day,
                uploads: activityMap[day] || 0
            }));

            setStats({
                docCount: count,
                totalSize: sizeMB,
                activity: chartData
            });
        } catch (err) {
            console.error("Overview Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRealData();
    }, [user]);

    return (
        <div className="overview-module animate-fade-in">
            {/* Stats Grid */}
            <div className="row g-4 mb-5">
                <div className="col-12 col-md-6 col-lg-4">
                    <StatCard 
                        icon={<MdMenuBook size={24} />} 
                        label="Documents Archived" 
                        value={loading ? '...' : stats.docCount} 
                        trend={stats.docCount > 0 ? "+Auth" : null}
                        color="primary"
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <StatCard 
                        icon={<MdOutlineSdStorage size={24} />} 
                        label="Cloud Storage Used" 
                        value={loading ? '...' : `${stats.totalSize} MB`} 
                        subtitle="Across all experiments"
                        color="success"
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4 text-white">
                    <div className="bg-primary p-4 rounded-5 shadow-lg h-100 d-flex flex-column justify-content-center">
                        <MdAutoGraph size={32} className="mb-3 opacity-50" />
                        <h3 className="h1 fw-bold mb-1 tracking-tighter text-white">Platinum</h3>
                        <p className="small opacity-75 uppercase tracking-widest mb-0 fw-bold">Active Laboratory Tier</p>
                    </div>
                </div>
            </div>

            {/* Analytics Chart */}
            <div className="glass-panel p-4 p-md-5 rounded-5 shadow-sm mb-5">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h4 className="fw-bold text-dark mb-1 tracking-tight">Activity Pulse</h4>
                        <p className="text-secondary small mb-0 fw-medium">Real-time laboratory upload trends</p>
                    </div>
                    <div className="badge bg-light text-secondary rounded-pill px-3 py-2 smaller fw-bold mono uppercase tracking-widest border">Live Stream</div>
                </div>

                <div style={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer>
                        <AreaChart data={stats.activity}>
                            <defs>
                                <linearGradient id="colorUploads" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--bs-primary)" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="var(--bs-primary)" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                                dy={10}
                            />
                            <YAxis hide />
                            <Tooltip 
                                contentStyle={{ 
                                    borderRadius: '16px', 
                                    border: 'none', 
                                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                    background: 'rgba(255,255,255,0.9)',
                                    backdropFilter: 'blur(10px)'
                                }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="uploads" 
                                stroke="var(--bs-primary)" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorUploads)" 
                                animationDuration={1500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Overview;
