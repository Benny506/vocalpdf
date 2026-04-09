import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { MdGroup, MdStorage, MdMenuBook, MdInsights, MdTrendingUp } from 'react-icons/md';
import { supabase } from '../../../supabase/supabaseClient';

const StatCard = ({ icon, label, value, trend, color }) => (
    <motion.div 
        whileHover={{ y: -5 }}
        className="glass-panel p-4 rounded-5 shadow-sm h-100 d-flex flex-column justify-content-between border border-white border-opacity-20"
    >
        <div className="d-flex justify-content-between align-items-start mb-3">
            <div className={`p-3 rounded-4 bg-${color} bg-opacity-10 text-${color}`}>
                {icon}
            </div>
            {trend && (
                <span className="badge bg-primary-subtle text-primary rounded-pill px-2 py-1 smaller">
                    <MdTrendingUp size={14} className="me-1" /> {trend}
                </span>
            )}
        </div>
        <div>
            <h3 className="h2 fw-bold text-dark mb-1 tracking-tighter">{value}</h3>
            <p className="small text-secondary fw-medium mb-0 uppercase tracking-wider">{label}</p>
        </div>
    </motion.div>
);

export const AdminOverview = () => {
    const [stats, setStats] = useState({
        totalFiles: 0,
        totalStorage: 0,
        activity: []
    });
    const [loading, setLoading] = useState(true);

    const fetchGlobalStats = async () => {
        try {
            // In a real environment with RLS, this would fail without service role or specific policies.
            // For this project, we fetch all vp_documents to simulate global oversight.
            const { data, error } = await supabase
                .from('vp_documents')
                .select('created_at, size');

            if (error) throw error;

            const totalFiles = data?.length || 0;
            const totalBytes = data?.reduce((acc, curr) => acc + (curr.size || 0), 0) || 0;
            const totalMB = (totalBytes / (1024 * 1024)).toFixed(1);

            // Group by day for the chart
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
                totalFiles,
                totalStorage: totalMB,
                activity: chartData
            });
        } catch (err) {
            console.error("Citadel Stats Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGlobalStats();
    }, []);

    return (
        <div className="admin-overview animate-fade-in">
            <div className="row g-4 mb-5">
                <div className="col-12 col-md-6 col-lg-4">
                    <StatCard 
                        icon={<MdMenuBook size={24} />} 
                        label="Universal Archives" 
                        value={loading ? '...' : stats.totalFiles} 
                        trend="Live Pulse"
                        color="primary"
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <StatCard 
                        icon={<MdStorage size={24} />} 
                        label="Global Storage Volume" 
                        value={loading ? '...' : `${stats.totalStorage} MB`} 
                        trend="Optimized"
                        color="success"
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <div className="bg-dark p-4 rounded-5 shadow-lg h-100 d-flex flex-column justify-content-center text-white border border-white border-opacity-10 shadow-2xl">
                        <MdInsights size={32} className="mb-3 text-primary opacity-75" />
                        <h3 className="h1 fw-bold mb-1 tracking-tighter">Citadel Authority</h3>
                        <p className="small opacity-50 uppercase tracking-widest mb-0 fw-bold">Universal Oversight Active</p>
                    </div>
                </div>
            </div>

            <div className="glass-panel p-4 p-md-5 rounded-5 shadow-sm mb-5 border border-white border-opacity-20">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h4 className="fw-bold text-dark mb-1 tracking-tight">Global Laboratory Pulse</h4>
                        <p className="text-secondary small mb-0 fw-medium">Universal upload trends across all student accounts</p>
                    </div>
                    <div className="dropdown">
                        <button className="btn btn-white-subtle rounded-pill px-4 btn-sm fw-bold border border-dark border-opacity-5 shadow-sm">Global Data Stream</button>
                    </div>
                </div>

                <div style={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer>
                        <AreaChart data={stats.activity}>
                            <defs>
                                <linearGradient id="colorGlobal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--bs-primary)" stopOpacity={0.2}/>
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
                                strokeWidth={4}
                                fillOpacity={1} 
                                fill="url(#colorGlobal)" 
                                animationDuration={1500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
