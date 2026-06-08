import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
  RadialLinearScale
} from 'chart.js';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
  RadialLinearScale
);

const AdminTransactions = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedQuarter, setSelectedQuarter] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    totalAmount: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [viewType, setViewType] = useState('charts');
  const [lineGraphView, setLineGraphView] = useState('monthly');

  const API_BASE_URL = 'https://vuma.pythonanywhere.com/api';
  const availableYears = [2023, 2024, 2025, 2026];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  useEffect(() => {
    AOS.init({ duration: 500, once: true });
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/donations/`);
      if (response.ok) {
        const data = await response.json();
        let allTransactions = [];
        if (data.results && Array.isArray(data.results)) {
          allTransactions = data.results;
        } else if (Array.isArray(data)) {
          allTransactions = data;
        }
        setTransactions(allTransactions);
        const completed = allTransactions.filter(t => t.status === 'completed').length;
        const pending = allTransactions.filter(t => t.status === 'pending').length;
        const totalAmount = allTransactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
        setStats({ total: allTransactions.length, completed, pending, totalAmount });
      } else {
        throw new Error('Failed to fetch transactions');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to load transactions.');
    } finally {
      setLoading(false);
    }
  };

  const isWithinDateRange = (transactionDate) => {
    if (dateRangeFilter === 'all') return true;
    const date = new Date(transactionDate);
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    switch(dateRangeFilter) {
      case 'today': return date.toDateString() === today.toDateString();
      case 'week': return date >= startOfWeek;
      case 'month': return date >= startOfMonth;
      case 'quarter':
        const quarterStart = new Date(today.getFullYear(), (selectedQuarter - 1) * 3, 1);
        const quarterEnd = new Date(today.getFullYear(), selectedQuarter * 3, 0);
        return date >= quarterStart && date <= quarterEnd;
      case 'year': return date.getFullYear() === selectedYear;
      case 'custom':
        if (customStartDate && customEndDate) {
          return date >= new Date(customStartDate) && date <= new Date(customEndDate);
        }
        return true;
      default: return true;
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesPaymentMethod = paymentMethodFilter === 'all' || transaction.payment_method === paymentMethodFilter;
    const matchesDateRange = isWithinDateRange(transaction.created_at);
    return matchesSearch && matchesStatus && matchesPaymentMethod && matchesDateRange;
  });

  // Data for charts
  const getMonthlyData = () => {
    const counts = Array(12).fill(0);
    const amounts = Array(12).fill(0);
    filteredTransactions.forEach(t => {
      const month = new Date(t.created_at).getMonth();
      counts[month]++;
      amounts[month] += parseFloat(t.amount || 0);
    });
    return { counts, amounts };
  };

  const getQuarterlyData = () => {
    const counts = Array(4).fill(0);
    const amounts = Array(4).fill(0);
    filteredTransactions.forEach(t => {
      const quarter = Math.floor(new Date(t.created_at).getMonth() / 3);
      counts[quarter]++;
      amounts[quarter] += parseFloat(t.amount || 0);
    });
    return { counts, amounts };
  };

  const getYearlyData = () => {
    const yearly = {};
    filteredTransactions.forEach(t => {
      const year = new Date(t.created_at).getFullYear();
      if (!yearly[year]) yearly[year] = { count: 0, amount: 0 };
      yearly[year].count++;
      yearly[year].amount += parseFloat(t.amount || 0);
    });
    return yearly;
  };

  const monthlyData = getMonthlyData();
  const quarterlyData = getQuarterlyData();
  const yearlyData = getYearlyData();

  const completedCount = filteredTransactions.filter(t => t.status === 'completed').length;
  const pendingCount = filteredTransactions.filter(t => t.status === 'pending').length;
  const mpesaCount = filteredTransactions.filter(t => t.payment_method === 'mpesa').length;
  const bankCount = filteredTransactions.filter(t => t.payment_method === 'bank').length;
  const unspecifiedCount = filteredTransactions.filter(t => !t.payment_method).length;

  // 3D Line Area Chart Data
  const getLineGraphData = () => {
    if (lineGraphView === 'monthly') {
      return {
        labels: months,
        datasets: [
          {
            label: '📊 Donations Count',
            data: monthlyData.counts,
            borderColor: '#F9C74F',
            backgroundColor: 'rgba(249,199,79,0.35)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#F9C74F',
            pointBorderColor: '#fff',
            pointBorderWidth: 3,
            pointRadius: 6,
            pointHoverRadius: 10,
            pointStyle: 'circle',
            yAxisID: 'y',
          },
          {
            label: '💰 Amount (TZS)',
            data: monthlyData.amounts,
            borderColor: '#2b7a5c',
            backgroundColor: 'rgba(43,122,92,0.35)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#2b7a5c',
            pointBorderColor: '#fff',
            pointBorderWidth: 3,
            pointRadius: 6,
            pointHoverRadius: 10,
            pointStyle: 'rectRounded',
            yAxisID: 'y1',
          }
        ]
      };
    } else if (lineGraphView === 'quarterly') {
      return {
        labels: ['Q1 (Jan-Mar)', 'Q2 (Apr-Jun)', 'Q3 (Jul-Sep)', 'Q4 (Oct-Dec)'],
        datasets: [
          {
            label: '📊 Donations Count',
            data: quarterlyData.counts,
            borderColor: '#F9C74F',
            backgroundColor: 'rgba(249,199,79,0.35)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#F9C74F',
            pointBorderColor: '#fff',
            pointBorderWidth: 3,
            pointRadius: 7,
            pointHoverRadius: 11,
          },
          {
            label: '💰 Amount (TZS)',
            data: quarterlyData.amounts,
            borderColor: '#2b7a5c',
            backgroundColor: 'rgba(43,122,92,0.35)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#2b7a5c',
            pointBorderColor: '#fff',
            pointBorderWidth: 3,
            pointRadius: 7,
            pointHoverRadius: 11,
            yAxisID: 'y1',
          }
        ]
      };
    } else {
      return {
        labels: Object.keys(yearlyData),
        datasets: [
          {
            label: '📊 Donations Count',
            data: Object.values(yearlyData).map(d => d.count),
            borderColor: '#F9C74F',
            backgroundColor: 'rgba(249,199,79,0.35)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#F9C74F',
            pointBorderColor: '#fff',
            pointBorderWidth: 3,
            pointRadius: 7,
            pointHoverRadius: 11,
          },
          {
            label: '💰 Amount (TZS)',
            data: Object.values(yearlyData).map(d => d.amount),
            borderColor: '#2b7a5c',
            backgroundColor: 'rgba(43,122,92,0.35)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#2b7a5c',
            pointBorderColor: '#fff',
            pointBorderWidth: 3,
            pointRadius: 7,
            pointHoverRadius: 11,
            yAxisID: 'y1',
          }
        ]
      };
    }
  };

  // 3D Column Chart Data (using Bar with 3D effects)
  const monthlyColumnData = {
    labels: months,
    datasets: [{
      label: 'Donations',
      data: monthlyData.counts,
      backgroundColor: 'rgba(249,199,79,0.85)',
      borderColor: '#F9C74F',
      borderWidth: 2,
      borderRadius: 8,
      barPercentage: 0.65,
      categoryPercentage: 0.8,
    }]
  };

  // 3D Column Chart for Quarterly
  const quarterlyColumnData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [{
      label: 'Donations',
      data: quarterlyData.counts,
      backgroundColor: 'rgba(43,122,92,0.85)',
      borderColor: '#2b7a5c',
      borderWidth: 2,
      borderRadius: 8,
      barPercentage: 0.65,
      categoryPercentage: 0.8,
    }]
  };

  // 3D Pie Chart Data
  const statusPieData = {
    labels: ['✅ Completed', '⏳ Pending'],
    datasets: [{
      data: [completedCount, pendingCount],
      backgroundColor: ['rgba(76,175,80,0.85)', 'rgba(255,152,0,0.85)'],
      borderColor: ['#4caf50', '#ff9800'],
      borderWidth: 2,
      hoverOffset: 15,
    }]
  };

  // 3D Doughnut Chart for Payment Methods (with 3D effect)
  const paymentDoughnutData = {
    labels: ['📱 M-PESA', '🏦 Bank Transfer', '❓ Not Specified'],
    datasets: [{
      data: [mpesaCount, bankCount, unspecifiedCount],
      backgroundColor: ['rgba(33,150,243,0.85)', 'rgba(156,39,176,0.85)', 'rgba(117,117,117,0.85)'],
      borderColor: ['#2196F3', '#9C27B0', '#757575'],
      borderWidth: 2,
      hoverOffset: 15,
      cutout: '55%',
    }]
  };

  // 3D Chart Options with 3D shadow effects
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { 
        position: 'top', 
        labels: { 
          font: { size: 10, weight: 'bold', family: 'Poppins' }, 
          usePointStyle: true, 
          boxWidth: 10,
          padding: 15,
        } 
      },
      tooltip: { 
        backgroundColor: 'rgba(0,0,0,0.9)', 
        padding: 12, 
        cornerRadius: 10, 
        titleFont: { size: 12, weight: 'bold' }, 
        bodyFont: { size: 11 },
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      }
    },
    scales: {
      y: { 
        beginAtZero: true, 
        grid: { color: 'rgba(0,0,0,0.05)', drawBorder: true }, 
        title: { display: true, text: 'Number of Donations', font: { size: 9, weight: 'bold' } }, 
        ticks: { stepSize: 1, font: { size: 9 } },
        border: { dash: [4, 4] }
      },
      y1: { 
        beginAtZero: true, 
        position: 'right', 
        grid: { drawOnChartArea: false }, 
        title: { display: true, text: 'Amount (TZS)', font: { size: 9, weight: 'bold' } }, 
        ticks: { callback: (v) => formatCurrency(v), font: { size: 9 } }
      }
    },
    elements: { 
      line: { borderJoin: 'round', capBezierPoints: true },
      point: { hoverBorderWidth: 4 }
    },
    layout: {
      padding: { top: 10, bottom: 10, left: 10, right: 10 }
    }
  };

  const columnChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { position: 'top', labels: { font: { size: 9 }, usePointStyle: true, boxWidth: 8 } },
      tooltip: { backgroundColor: 'rgba(0,0,0,0.85)', padding: 8, cornerRadius: 8, titleFont: { size: 11 }, bodyFont: { size: 10 } }
    },
    scales: { 
      y: { 
        beginAtZero: true, 
        grid: { color: 'rgba(0,0,0,0.05)' }, 
        title: { display: true, text: 'Count', font: { size: 9 } }, 
        ticks: { stepSize: 1, font: { size: 8 } } 
      },
      x: { ticks: { font: { size: 8, weight: 'bold' }, rotation: -45, maxRotation: 45 } }
    },
    layout: {
      padding: { top: 10, bottom: 20, left: 5, right: 5 }
    }
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { 
        position: 'bottom', 
        labels: { 
          font: { size: 9, weight: 'bold' }, 
          usePointStyle: true, 
          boxWidth: 10,
          padding: 12,
        } 
      },
      tooltip: { 
        callbacks: { 
          label: (ctx) => { 
            const total = ctx.dataset.data.reduce((a,b) => a+b,0); 
            const pct = ((ctx.parsed / total) * 100).toFixed(1); 
            return `${ctx.label}: ${ctx.parsed} (${pct}%)`; 
          } 
        },
        backgroundColor: 'rgba(0,0,0,0.85)',
        padding: 10,
        cornerRadius: 10,
      }
    },
    cutout: '0%',
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { 
        position: 'bottom', 
        labels: { 
          font: { size: 9, weight: 'bold' }, 
          usePointStyle: true, 
          boxWidth: 10,
          padding: 12,
        } 
      },
      tooltip: { 
        callbacks: { 
          label: (ctx) => { 
            const total = ctx.dataset.data.reduce((a,b) => a+b,0); 
            const pct = ((ctx.parsed / total) * 100).toFixed(1); 
            return `${ctx.label}: ${ctx.parsed} (${pct}%)`; 
          } 
        },
        backgroundColor: 'rgba(0,0,0,0.85)',
        padding: 10,
        cornerRadius: 10,
      }
    },
    cutout: '60%',
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('sw-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch { return 'N/A'; }
  };

  const getStatusBadge = (status) => {
    if (status === 'completed') return { bg: '#e8f5e9', color: '#2e7d32', icon: 'fa-check-circle', text: 'Completed' };
    return { bg: '#fff3e0', color: '#e65100', icon: 'fa-clock', text: 'Pending' };
  };

  const getPaymentMethodBadge = (method) => {
    if (method === 'mpesa') return { bg: '#e3f2fd', color: '#1565c0', icon: 'fa-mobile-alt', text: 'M-PESA' };
    if (method === 'bank') return { bg: '#f3e5f5', color: '#6a1b9a', icon: 'fa-university', text: 'Bank' };
    return { bg: '#f5f5f5', color: '#757575', icon: 'fa-question', text: 'N/A' };
  };

  const openModal = (t) => { setSelectedTransaction(t); setShowModal(true); document.body.style.overflow = 'hidden'; };
  const closeModal = () => { setShowModal(false); setSelectedTransaction(null); document.body.style.overflow = 'unset'; };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginate = (page) => setCurrentPage(page);

  const exportCSV = () => {
    const headers = ['ID', 'Reference', 'Donor', 'Email', 'Mobile', 'Amount', 'Status', 'Payment', 'Transaction Code', 'Date'];
    const rows = filteredTransactions.map(t => [t.id, t.reference_number, t.full_name, t.email, t.mobile_number, t.amount, t.status, t.payment_method || 'N/A', t.transaction_code || 'N/A', formatDate(t.created_at)]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPaymentMethodFilter('all');
    setDateRangeFilter('all');
    setCustomStartDate('');
    setCustomEndDate('');
    setSelectedYear(new Date().getFullYear());
    setSelectedQuarter(1);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '50px', height: '50px', border: '3px solid #F9C74F', borderTopColor: '#0B3B2F', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
          <p style={{ marginTop: '0.8rem', color: '#666', fontSize: '0.8rem' }}>Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shadowPulse { 0%, 100% { box-shadow: 0 5px 20px rgba(0,0,0,0.08); } 50% { box-shadow: 0 8px 30px rgba(0,0,0,0.15); } }
        
        .stat-card { transition: all 0.3s ease; cursor: pointer; background: white; border-radius: 12px; padding: 0.7rem; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.12); background: linear-gradient(135deg, #fff, #fef9e8); }
        
        .chart-card { transition: all 0.3s ease; background: white; border-radius: 12px; padding: 0.8rem; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .chart-card:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(0,0,0,0.12); animation: shadowPulse 1s ease; }
        
        .transaction-row:hover { background: rgba(249,199,79,0.08); transform: translateX(3px); transition: all 0.2s ease; }
        .modal-content { animation: slideInUp 0.3s ease; }
        .modal-overlay { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .filter-btn, .view-btn { transition: all 0.2s ease; }
        .filter-btn:hover, .view-btn:hover { transform: translateY(-1px); }
        .modal-content::-webkit-scrollbar { width: 4px; }
        .modal-content::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 2px; }
        .modal-content::-webkit-scrollbar-thumb { background: #F9C74F; border-radius: 2px; }
        
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 0.8rem !important; }
          .charts-grid { grid-template-columns: 1fr !important; }
          .table-container { overflow-x: auto; }
        }
      `}</style>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', color: 'white', padding: '1rem 1.5rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <i className="fas fa-arrow-left" style={{ cursor: 'pointer', fontSize: '1rem' }} onClick={() => navigate('/admin')} />
            <h1 style={{ fontSize: '1.3rem', margin: 0 }}><i className="fas fa-chart-line" style={{ marginRight: '0.4rem', color: '#F9C74F' }}></i>3D Transaction Analytics</h1>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setViewType('charts')} className="view-btn" style={{ background: viewType === 'charts' ? '#F9C74F' : 'rgba(255,255,255,0.2)', border: 'none', padding: '0.3rem 0.8rem', borderRadius: '6px', color: viewType === 'charts' ? '#0B3B2F' : 'white', cursor: 'pointer', fontSize: '0.75rem' }}><i className="fas fa-chart-bar"></i> 3D Charts</button>
            <button onClick={() => setViewType('table')} className="view-btn" style={{ background: viewType === 'table' ? '#F9C74F' : 'rgba(255,255,255,0.2)', border: 'none', padding: '0.3rem 0.8rem', borderRadius: '6px', color: viewType === 'table' ? '#0B3B2F' : 'white', cursor: 'pointer', fontSize: '0.75rem' }}><i className="fas fa-table"></i> Table</button>
            <button onClick={exportCSV} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', padding: '0.3rem 0.8rem', borderRadius: '6px', color: 'white', cursor: 'pointer', fontSize: '0.75rem' }}><i className="fas fa-download"></i> Export</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1rem 1.5rem' }}>
        {/* Stats Cards */}
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.8rem', marginBottom: '1rem' }}>
          <div className="stat-card"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><div style={{ color: '#666', fontSize: '0.65rem' }}>Total</div><div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0B3B2F' }}>{stats.total}</div></div><div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(11,59,47,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fas fa-receipt" style={{ fontSize: '0.8rem', color: '#0B3B2F' }}></i></div></div></div>
          <div className="stat-card"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><div style={{ color: '#666', fontSize: '0.65rem' }}>Completed</div><div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2e7d32' }}>{stats.completed}</div></div><div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(76,175,80,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fas fa-check-circle" style={{ fontSize: '0.8rem', color: '#4caf50' }}></i></div></div></div>
          <div className="stat-card"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><div style={{ color: '#666', fontSize: '0.65rem' }}>Pending</div><div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e65100' }}>{stats.pending}</div></div><div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(255,152,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fas fa-clock" style={{ fontSize: '0.8rem', color: '#ff9800' }}></i></div></div></div>
          <div className="stat-card"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><div style={{ color: '#666', fontSize: '0.65rem' }}>Amount</div><div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1565c0' }}>{formatCurrency(stats.totalAmount)}</div></div><div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(33,150,243,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fas fa-money-bill-wave" style={{ fontSize: '0.8rem', color: '#2196F3' }}></i></div></div></div>
        </div>

        {/* Filters */}
        <div style={{ background: 'white', borderRadius: '10px', padding: '0.6rem', marginBottom: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
            <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ flex: 1, minWidth: '120px', padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.7rem' }} />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.7rem' }}><option value="all">Status</option><option value="completed">Completed</option><option value="pending">Pending</option></select>
            <select value={paymentMethodFilter} onChange={(e) => setPaymentMethodFilter(e.target.value)} style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.7rem' }}><option value="all">Payment</option><option value="mpesa">M-PESA</option><option value="bank">Bank</option></select>
            <select value={dateRangeFilter} onChange={(e) => setDateRangeFilter(e.target.value)} style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.7rem' }}><option value="all">Date</option><option value="today">Today</option><option value="week">Week</option><option value="month">Month</option><option value="quarter">Quarter</option><option value="year">Year</option><option value="custom">Custom</option></select>
            {dateRangeFilter === 'quarter' && <select value={selectedQuarter} onChange={(e) => setSelectedQuarter(parseInt(e.target.value))} style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.7rem' }}><option value={1}>Q1</option><option value={2}>Q2</option><option value={3}>Q3</option><option value={4}>Q4</option></select>}
            {dateRangeFilter === 'year' && <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.7rem' }}>{availableYears.map(y => <option key={y} value={y}>{y}</option>)}</select>}
            {dateRangeFilter === 'custom' && <><input type="date" value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)} style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.7rem' }} /><span style={{ fontSize: '0.7rem' }}>-</span><input type="date" value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)} style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.7rem' }} /></>}
            <button onClick={resetFilters} style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid #ddd', background: '#f5f5f5', fontSize: '0.7rem', cursor: 'pointer' }}><i className="fas fa-undo"></i></button>
          </div>
        </div>

        {viewType === 'charts' ? (
          /* 3D Charts View */
          <div>
            {/* Main 3D Line Area Chart */}
            <div className="chart-card" style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ color: '#0B3B2F', fontSize: '0.8rem', margin: 0 }}><i className="fas fa-chart-line" style={{ color: '#F9C74F' }}></i> 3D Trend Analysis</h3>
                <select value={lineGraphView} onChange={(e) => setLineGraphView(e.target.value)} style={{ padding: '0.2rem 0.5rem', borderRadius: '15px', border: '1px solid #F9C74F', background: '#F9C74F10', fontSize: '0.7rem', cursor: 'pointer' }}>
                  <option value="monthly">📅 Monthly</option>
                  <option value="quarterly">📊 Quarterly</option>
                  <option value="yearly">📈 Yearly</option>
                </select>
              </div>
              <div style={{ height: '240px' }}><Line data={getLineGraphData()} options={lineChartOptions} /></div>
            </div>

            {/* Small 3D Charts Grid - 2x2 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.8rem' }}>
              {/* 3D Monthly Column Chart */}
              <div className="chart-card">
                <h4 style={{ color: '#0B3B2F', fontSize: '0.7rem', marginBottom: '0.3rem' }}><i className="fas fa-chart-bar" style={{ color: '#F9C74F' }}></i> 3D Monthly Columns</h4>
                <div style={{ height: '160px' }}><Bar data={monthlyColumnData} options={columnChartOptions} /></div>
              </div>

              {/* 3D Pie Chart */}
              <div className="chart-card">
                <h4 style={{ color: '#0B3B2F', fontSize: '0.7rem', marginBottom: '0.3rem' }}><i className="fas fa-chart-pie" style={{ color: '#F9C74F' }}></i> 3D Status Distribution</h4>
                <div style={{ height: '160px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ width: '180px', height: '180px' }}><Pie data={statusPieData} options={pieChartOptions} /></div>
                </div>
              </div>

              {/* 3D Payment Methods Doughnut */}
              <div className="chart-card">
                <h4 style={{ color: '#0B3B2F', fontSize: '0.7rem', marginBottom: '0.3rem' }}><i className="fas fa-credit-card" style={{ color: '#F9C74F' }}></i> 3D Payment Methods</h4>
                <div style={{ height: '160px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ width: '180px', height: '180px' }}><Doughnut data={paymentDoughnutData} options={doughnutChartOptions} /></div>
                </div>
              </div>

              {/* 3D Quarterly Column Chart */}
              <div className="chart-card">
                <h4 style={{ color: '#0B3B2F', fontSize: '0.7rem', marginBottom: '0.3rem' }}><i className="fas fa-chart-simple" style={{ color: '#F9C74F' }}></i> 3D Quarterly Columns</h4>
                <div style={{ height: '160px' }}><Bar data={quarterlyColumnData} options={columnChartOptions} /></div>
              </div>
            </div>
          </div>
        ) : (
          /* Table View */
          <div style={{ background: 'white', borderRadius: '10px', padding: '0.8rem', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.7rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                  <th style={{ textAlign: 'left', padding: '0.5rem', color: '#666' }}>ID</th><th style={{ textAlign: 'left', padding: '0.5rem', color: '#666' }}>Reference</th><th style={{ textAlign: 'left', padding: '0.5rem', color: '#666' }}>Donor</th><th style={{ textAlign: 'left', padding: '0.5rem', color: '#666' }}>Amount</th><th style={{ textAlign: 'left', padding: '0.5rem', color: '#666' }}>Status</th><th style={{ textAlign: 'left', padding: '0.5rem', color: '#666' }}>Payment</th><th style={{ textAlign: 'left', padding: '0.5rem', color: '#666' }}>Date</th><th style={{ textAlign: 'center', padding: '0.5rem', color: '#666' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: '#999' }}><i className="fas fa-inbox"></i> No transactions</td></tr>
                ) : (
                  currentItems.map(t => {
                    const status = getStatusBadge(t.status);
                    const payment = getPaymentMethodBadge(t.payment_method);
                    return (
                      <tr key={t.id} className="transaction-row" style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '0.5rem', fontWeight: 600, color: '#0B3B2F' }}>#{t.id}</td>
                        <td style={{ padding: '0.5rem', fontSize: '0.65rem', color: '#666' }}>{t.reference_number}</td>
                        <td style={{ padding: '0.5rem' }}><div><div style={{ fontWeight: 600 }}>{t.full_name}</div><div style={{ fontSize: '0.6rem', color: '#999' }}>{t.email}</div></div></td>
                        <td style={{ padding: '0.5rem', fontWeight: 600, color: '#0B3B2F' }}>{formatCurrency(t.amount)}</td>
                        <td style={{ padding: '0.5rem' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', padding: '0.15rem 0.4rem', borderRadius: '12px', background: status.bg, color: status.color, fontSize: '0.6rem' }}><i className={`fas ${status.icon}`} style={{ fontSize: '0.5rem' }}></i>{status.text}</span></td>
                        <td style={{ padding: '0.5rem' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', padding: '0.15rem 0.4rem', borderRadius: '12px', background: payment.bg, color: payment.color, fontSize: '0.6rem' }}><i className={`fas ${payment.icon}`} style={{ fontSize: '0.5rem' }}></i>{payment.text}</span></td>
                        <td style={{ padding: '0.5rem', fontSize: '0.65rem', color: '#666' }}>{formatDate(t.created_at)}</td>
                        <td style={{ padding: '0.5rem', textAlign: 'center' }}><button onClick={() => openModal(t)} style={{ background: 'rgba(249,199,79,0.1)', border: 'none', padding: '0.2rem 0.5rem', borderRadius: '5px', cursor: 'pointer', color: '#F9C74F', fontSize: '0.6rem' }}><i className="fas fa-eye"></i></button></td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.3rem', marginTop: '0.8rem', flexWrap: 'wrap' }}>
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid #ddd', background: 'white', fontSize: '0.6rem', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}>Prev</button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let page = currentPage <= 3 ? i + 1 : (currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i);
                  if (page > 0 && page <= totalPages) return <button key={page} onClick={() => paginate(page)} style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid #ddd', background: currentPage === page ? '#F9C74F' : 'white', color: currentPage === page ? '#0B3B2F' : '#666', fontSize: '0.6rem', cursor: 'pointer' }}>{page}</button>;
                  return null;
                })}
                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid #ddd', background: 'white', fontSize: '0.6rem', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}>Next</button>
              </div>
            )}
            <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.6rem', color: '#999' }}>{indexOfFirstItem+1}-{Math.min(indexOfLastItem, filteredTransactions.length)} of {filteredTransactions.length}</div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedTransaction && (
        <div className="modal-overlay" onClick={closeModal} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: '16px', maxWidth: '400px', width: '100%', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
            <button onClick={closeModal} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', border: 'none', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', color: 'white', fontSize: '0.8rem' }}><i className="fas fa-times"></i></button>
            <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', padding: '1rem', textAlign: 'center' }}>
              <div style={{ width: '45px', height: '45px', margin: '0 auto', borderRadius: '50%', background: '#F9C74F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fas fa-receipt" style={{ fontSize: '1.2rem', color: '#0B3B2F' }}></i></div>
              <h3 style={{ color: 'white', marginTop: '0.5rem', marginBottom: '0.2rem', fontSize: '1rem' }}>Transaction</h3>
              <p style={{ color: '#F9C74F', fontSize: '0.65rem' }}>{selectedTransaction.reference_number}</p>
            </div>
            <div style={{ padding: '1rem' }}>
              <div style={{ background: getStatusBadge(selectedTransaction.status).bg, padding: '0.4rem', borderRadius: '10px', marginBottom: '0.8rem', textAlign: 'center', fontSize: '0.7rem' }}><i className={`fas ${getStatusBadge(selectedTransaction.status).icon}`}></i> Status: {getStatusBadge(selectedTransaction.status).text}</div>
              <div style={{ marginBottom: '0.8rem' }}><div style={{ fontWeight: 600, fontSize: '0.7rem', marginBottom: '0.3rem' }}>Donor</div><div style={{ background: '#f9fbf7', borderRadius: '10px', padding: '0.5rem', fontSize: '0.7rem' }}><strong>Name:</strong> {selectedTransaction.full_name}<br/><strong>Email:</strong> {selectedTransaction.email}<br/><strong>Mobile:</strong> {selectedTransaction.mobile_number}</div></div>
              <div style={{ marginBottom: '0.8rem' }}><div style={{ fontWeight: 600, fontSize: '0.7rem', marginBottom: '0.3rem' }}>Details</div><div style={{ background: '#f9fbf7', borderRadius: '10px', padding: '0.5rem', fontSize: '0.7rem' }}><strong>Amount:</strong> {formatCurrency(selectedTransaction.amount)}<br/><strong>Type:</strong> {selectedTransaction.donation_type}<br/><strong>Created:</strong> {formatDate(selectedTransaction.created_at)}</div></div>
              <button onClick={closeModal} style={{ width: '100%', background: '#F9C74F', border: 'none', padding: '0.4rem', borderRadius: '20px', color: '#0B3B2F', fontWeight: 600, cursor: 'pointer', fontSize: '0.7rem' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTransactions;