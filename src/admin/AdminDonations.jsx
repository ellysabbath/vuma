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
  const [testimonials, setTestimonials] = useState([]);
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
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingTestimonial, setDeletingTestimonial] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Transaction delete states
  const [showTransactionDeleteConfirm, setShowTransactionDeleteConfirm] = useState(false);
  const [deletingTransaction, setDeletingTransaction] = useState(null);

  // New testimonial form state
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    location: '',
    text: '',
    rating: 5,
    is_active: true,
    order: 0
  });

  const API_BASE_URL = 'https://vuma.pythonanywhere.com/api';
  const availableYears = [2023, 2024, 2025, 2026];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  useEffect(() => {
    AOS.init({ duration: 500, once: true });
    fetchTransactions();
    fetchTestimonials();
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

  // ============ TRANSACTION CRUD OPERATIONS ============

  // DELETE Transaction
  const handleDeleteTransaction = async () => {
    if (!deletingTransaction) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/donations/${deletingTransaction.id}/`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchTransactions();
        showActionFeedback('Transaction deleted successfully!', 'success');
        setShowTransactionDeleteConfirm(false);
        setDeletingTransaction(null);
        setShowModal(false);
      } else {
        const errorData = await response.json();
        showActionFeedback(errorData.error || 'Failed to delete transaction', 'error');
      }
    } catch (error) {
      showActionFeedback('Network error. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // EDIT Transaction (Update status)
  const handleUpdateTransactionStatus = async (transactionId, newStatus) => {
    try {
      const transaction = transactions.find(t => t.id === transactionId);
      if (!transaction) return;

      const updatedTransaction = {
        ...transaction,
        status: newStatus
      };

      const response = await fetch(`${API_BASE_URL}/donations/${transactionId}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTransaction),
      });

      if (response.ok) {
        await fetchTransactions();
        showActionFeedback(`Transaction status updated to ${newStatus}!`, 'success');
        setShowModal(false);
      } else {
        const errorData = await response.json();
        showActionFeedback(errorData.error || 'Failed to update transaction', 'error');
      }
    } catch (error) {
      showActionFeedback('Network error. Please try again.', 'error');
    }
  };

  // ============ TESTIMONIAL CRUD OPERATIONS ============

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/estimonials/`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTestimonials(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };

  const showActionFeedback = (message, type = 'success') => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const openAddTestimonialModal = () => {
    setIsEditMode(false);
    setEditingTestimonial(null);
    setNewTestimonial({
      name: '',
      location: '',
      text: '',
      rating: 5,
      is_active: true,
      order: testimonials.length
    });
    setShowTestimonialModal(true);
    document.body.style.overflow = 'hidden';
  };

  const openEditTestimonialModal = (testimonial) => {
    setIsEditMode(true);
    setEditingTestimonial(testimonial);
    setNewTestimonial({
      name: testimonial.name || '',
      location: testimonial.location || '',
      text: testimonial.text || '',
      rating: testimonial.rating || 5,
      is_active: testimonial.is_active !== undefined ? testimonial.is_active : true,
      order: testimonial.order || 0
    });
    setShowTestimonialModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeTestimonialModal = () => {
    setShowTestimonialModal(false);
    setEditingTestimonial(null);
    setNewTestimonial({
      name: '',
      location: '',
      text: '',
      rating: 5,
      is_active: true,
      order: 0
    });
    setIsSubmitting(false);
    document.body.style.overflow = 'unset';
  };

  const handleTestimonialChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewTestimonial({
      ...newTestimonial,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddTestimonial = async () => {
    if (!newTestimonial.name || !newTestimonial.text) {
      showActionFeedback('Please fill in name and testimonial text', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/estimonials/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTestimonial),
      });

      const data = await response.json();
      if (data.success) {
        await fetchTestimonials();
        showActionFeedback('Testimonial added successfully!', 'success');
        closeTestimonialModal();
      } else {
        showActionFeedback(data.errors || 'Failed to add testimonial', 'error');
      }
    } catch (error) {
      showActionFeedback('Network error. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTestimonial = async () => {
    if (!newTestimonial.name || !newTestimonial.text) {
      showActionFeedback('Please fill in name and testimonial text', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/estimonials/${editingTestimonial.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTestimonial),
      });

      const data = await response.json();
      if (data.success) {
        await fetchTestimonials();
        showActionFeedback('Testimonial updated successfully!', 'success');
        closeTestimonialModal();
      } else {
        showActionFeedback(data.errors || 'Failed to update testimonial', 'error');
      }
    } catch (error) {
      showActionFeedback('Network error. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTestimonial = async () => {
    if (!deletingTestimonial) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/estimonials/${deletingTestimonial.id}/`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        await fetchTestimonials();
        showActionFeedback('Testimonial deleted successfully!', 'success');
        setShowDeleteConfirm(false);
        setDeletingTestimonial(null);
      } else {
        showActionFeedback(data.error || 'Failed to delete testimonial', 'error');
      }
    } catch (error) {
      showActionFeedback('Network error. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleTestimonialStatus = async (testimonial) => {
    try {
      const response = await fetch(`${API_BASE_URL}/estimonials/${testimonial.id}/toggle-active/`, {
        method: 'POST',
      });

      const data = await response.json();
      if (data.success) {
        await fetchTestimonials();
        showActionFeedback(`Testimonial ${data.data.is_active ? 'activated' : 'deactivated'} successfully!`, 'success');
      } else {
        showActionFeedback(data.error || 'Failed to toggle status', 'error');
      }
    } catch (error) {
      showActionFeedback('Network error. Please try again.', 'error');
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
        @keyframes fadeInScale {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        
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

      {/* Success Alert */}
      {showSuccess && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          animation: 'fadeInScale 0.3s ease'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            minWidth: '300px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: successMessage.includes('success') || successMessage.includes('Success') || successMessage.includes('✅') ? '#4caf50' : '#f44336',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              animation: 'scaleIn 0.5s ease'
            }}>
              <i className={`fas ${successMessage.includes('success') || successMessage.includes('Success') || successMessage.includes('✅') ? 'fa-check' : 'fa-times'}`} style={{ fontSize: '2.5rem', color: 'white' }}></i>
            </div>
            <h3 style={{ color: '#0B3B2F', marginBottom: '0.5rem' }}>
              {successMessage.includes('success') || successMessage.includes('Success') || successMessage.includes('✅') ? 'Success!' : 'Error!'}
            </h3>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>{successMessage}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', color: 'white', padding: '1rem 1.5rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <i className="fas fa-arrow-left" style={{ cursor: 'pointer', fontSize: '1rem' }} onClick={() => navigate('/admin')} />
            <h1 style={{ fontSize: '1.3rem', margin: 0 }}><i className="fas fa-chart-line" style={{ marginRight: '0.4rem', color: '#F9C74F' }}></i>Transaction Analytics</h1>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button onClick={() => setViewType('charts')} className="view-btn" style={{ background: viewType === 'charts' ? '#F9C74F' : 'rgba(255,255,255,0.2)', border: 'none', padding: '0.3rem 0.8rem', borderRadius: '6px', color: viewType === 'charts' ? '#0B3B2F' : 'white', cursor: 'pointer', fontSize: '0.75rem' }}><i className="fas fa-chart-bar"></i> Charts</button>
            <button onClick={() => setViewType('table')} className="view-btn" style={{ background: viewType === 'table' ? '#F9C74F' : 'rgba(255,255,255,0.2)', border: 'none', padding: '0.3rem 0.8rem', borderRadius: '6px', color: viewType === 'table' ? '#0B3B2F' : 'white', cursor: 'pointer', fontSize: '0.75rem' }}><i className="fas fa-table"></i> Table</button>
            <button onClick={exportCSV} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', padding: '0.3rem 0.8rem', borderRadius: '6px', color: 'white', cursor: 'pointer', fontSize: '0.75rem' }}><i className="fas fa-download"></i> Export</button>
          </div>
        </div>
      </div>

      {/* Testimonials Management Section */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1rem 1.5rem' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1rem', color: '#0B3B2F', margin: 0 }}>
              <i className="fas fa-star" style={{ color: '#F9C74F', marginRight: '0.5rem' }}></i>
              Testimonials Management
              <span style={{ fontSize: '0.7rem', color: '#666', marginLeft: '0.5rem' }}>({testimonials.length})</span>
            </h2>
            <button
              onClick={openAddTestimonialModal}
              style={{
                background: '#0B3B2F',
                color: 'white',
                border: 'none',
                padding: '0.4rem 1rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#1a5c48'; e.currentTarget.style.transform = 'scale(1.02)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#0B3B2F'; e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <i className="fas fa-plus"></i> Add Testimonial
            </button>
          </div>

          {/* Testimonials List */}
          <div style={{ marginTop: '0.8rem', overflowX: 'auto' }}>
            {testimonials.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: '#999', fontSize: '0.8rem' }}>
                <i className="fas fa-star" style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.5rem', opacity: 0.3 }}></i>
                No testimonials yet. Add your first testimonial!
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.7rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                    <th style={{ textAlign: 'left', padding: '0.4rem', color: '#666' }}>Name</th>
                    <th style={{ textAlign: 'left', padding: '0.4rem', color: '#666' }}>Location</th>
                    <th style={{ textAlign: 'left', padding: '0.4rem', color: '#666' }}>Rating</th>
                    <th style={{ textAlign: 'left', padding: '0.4rem', color: '#666' }}>Testimonial</th>
                    <th style={{ textAlign: 'left', padding: '0.4rem', color: '#666' }}>Status</th>
                    <th style={{ textAlign: 'center', padding: '0.4rem', color: '#666' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {testimonials.map((t) => (
                    <tr key={t.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '0.4rem', fontWeight: 600, color: '#0B3B2F' }}>{t.name}</td>
                      <td style={{ padding: '0.4rem', color: '#666' }}>{t.location || '-'}</td>
                      <td style={{ padding: '0.4rem' }}>
                        <div style={{ display: 'flex', gap: '0.1rem' }}>
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className="fas fa-star" style={{ color: i < t.rating ? '#F9C74F' : '#ddd', fontSize: '0.6rem' }}></i>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '0.4rem', color: '#666', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        "{t.text.length > 40 ? t.text.substring(0, 40) + '...' : t.text}"
                      </td>
                      <td style={{ padding: '0.4rem' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '0.1rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '0.6rem',
                          fontWeight: 600,
                          background: t.is_active ? '#e8f5e9' : '#ffebee',
                          color: t.is_active ? '#2e7d32' : '#c62828'
                        }}>
                          {t.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ padding: '0.4rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.3rem', justifyContent: 'center' }}>
                          <button
                            onClick={() => handleToggleTestimonialStatus(t)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: t.is_active ? '#f59e0b' : '#4caf50',
                              fontSize: '0.7rem'
                            }}
                            title={t.is_active ? 'Deactivate' : 'Activate'}
                          >
                            <i className={`fas ${t.is_active ? 'fa-pause-circle' : 'fa-play-circle'}`}></i>
                          </button>
                          <button
                            onClick={() => openEditTestimonialModal(t)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#2196F3',
                              fontSize: '0.7rem'
                            }}
                            title="Edit"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => {
                              setDeletingTestimonial(t);
                              setShowDeleteConfirm(true);
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#d32f2f',
                              fontSize: '0.7rem'
                            }}
                            title="Delete"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem' }}>
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
          /* Charts View */
          <div>
            {/* Main Line Area Chart */}
            <div className="chart-card" style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ color: '#0B3B2F', fontSize: '0.8rem', margin: 0 }}><i className="fas fa-chart-line" style={{ color: '#F9C74F' }}></i> Trend Analysis</h3>
                <select value={lineGraphView} onChange={(e) => setLineGraphView(e.target.value)} style={{ padding: '0.2rem 0.5rem', borderRadius: '15px', border: '1px solid #F9C74F', background: '#F9C74F10', fontSize: '0.7rem', cursor: 'pointer' }}>
                  <option value="monthly">📅 Monthly</option>
                  <option value="quarterly">📊 Quarterly</option>
                  <option value="yearly">📈 Yearly</option>
                </select>
              </div>
              <div style={{ height: '240px' }}><Line data={getLineGraphData()} options={lineChartOptions} /></div>
            </div>

            {/* Small Charts Grid - 2x2 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.8rem' }}>
              <div className="chart-card">
                <h4 style={{ color: '#0B3B2F', fontSize: '0.7rem', marginBottom: '0.3rem' }}><i className="fas fa-chart-bar" style={{ color: '#F9C74F' }}></i> Monthly Columns</h4>
                <div style={{ height: '160px' }}><Bar data={monthlyColumnData} options={columnChartOptions} /></div>
              </div>

              <div className="chart-card">
                <h4 style={{ color: '#0B3B2F', fontSize: '0.7rem', marginBottom: '0.3rem' }}><i className="fas fa-chart-pie" style={{ color: '#F9C74F' }}></i> Status Distribution</h4>
                <div style={{ height: '160px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ width: '180px', height: '180px' }}><Pie data={statusPieData} options={pieChartOptions} /></div>
                </div>
              </div>

              <div className="chart-card">
                <h4 style={{ color: '#0B3B2F', fontSize: '0.7rem', marginBottom: '0.3rem' }}><i className="fas fa-credit-card" style={{ color: '#F9C74F' }}></i> Payment Methods</h4>
                <div style={{ height: '160px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ width: '180px', height: '180px' }}><Doughnut data={paymentDoughnutData} options={doughnutChartOptions} /></div>
                </div>
              </div>

              <div className="chart-card">
                <h4 style={{ color: '#0B3B2F', fontSize: '0.7rem', marginBottom: '0.3rem' }}><i className="fas fa-chart-simple" style={{ color: '#F9C74F' }}></i> Quarterly Columns</h4>
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
                  <th style={{ textAlign: 'left', padding: '0.5rem', color: '#666' }}>ID</th><th style={{ textAlign: 'left', padding: '0.5rem', color: '#666' }}>Reference</th><th style={{ textAlign: 'left', padding: '0.5rem', color: '#666' }}>Donor</th><th style={{ textAlign: 'left', padding: '0.5rem', color: '#666' }}>Amount</th><th style={{ textAlign: 'left', padding: '0.5rem', color: '#666' }}>Status</th><th style={{ textAlign: 'left', padding: '0.5rem', color: '#666' }}>Payment</th><th style={{ textAlign: 'left', padding: '0.5rem', color: '#666' }}>Date</th><th style={{ textAlign: 'center', padding: '0.5rem', color: '#666' }}>Actions</th>
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
                        <td style={{ padding: '0.5rem' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', padding: '0.15rem 0.4rem', borderRadius: '12px', background: status.bg, color: status.color, fontSize: '0.6rem' }}>
                            <i className={`fas ${status.icon}`} style={{ fontSize: '0.5rem' }}></i>{status.text}
                          </span>
                        </td>
                        <td style={{ padding: '0.5rem' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', padding: '0.15rem 0.4rem', borderRadius: '12px', background: payment.bg, color: payment.color, fontSize: '0.6rem' }}>
                            <i className={`fas ${payment.icon}`} style={{ fontSize: '0.5rem' }}></i>{payment.text}
                          </span>
                        </td>
                        <td style={{ padding: '0.5rem', fontSize: '0.65rem', color: '#666' }}>{formatDate(t.created_at)}</td>
                        <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '0.3rem', justifyContent: 'center' }}>
                            <button 
                              onClick={() => openModal(t)} 
                              style={{ 
                                background: 'rgba(249,199,79,0.1)', 
                                border: 'none', 
                                padding: '0.2rem 0.5rem', 
                                borderRadius: '5px', 
                                cursor: 'pointer', 
                                color: '#F9C74F', 
                                fontSize: '0.6rem',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(249,199,79,0.2)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(249,199,79,0.1)'; }}
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            <button
                              onClick={() => {
                                setDeletingTransaction(t);
                                setShowTransactionDeleteConfirm(true);
                              }}
                              style={{
                                background: 'rgba(244,67,54,0.1)',
                                border: 'none',
                                padding: '0.2rem 0.5rem',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                color: '#d32f2f',
                                fontSize: '0.6rem',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(244,67,54,0.2)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(244,67,54,0.1)'; }}
                              title="Delete Transaction"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </div>
                        </td>
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

      {/* Modal for Transaction Details */}
      {showModal && selectedTransaction && (
        <div className="modal-overlay" onClick={closeModal} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: '16px', maxWidth: '400px', width: '100%', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
            <button onClick={closeModal} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', border: 'none', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', color: 'white', fontSize: '0.8rem' }}><i className="fas fa-times"></i></button>
            <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', padding: '1rem', textAlign: 'center' }}>
              <div style={{ width: '45px', height: '45px', margin: '0 auto', borderRadius: '50%', background: '#F9C74F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fas fa-receipt" style={{ fontSize: '1.2rem', color: '#0B3B2F' }}></i></div>
              <h3 style={{ color: 'white', marginTop: '0.5rem', marginBottom: '0.2rem', fontSize: '1rem' }}>Transaction Details</h3>
              <p style={{ color: '#F9C74F', fontSize: '0.65rem' }}>{selectedTransaction.reference_number}</p>
            </div>
            <div style={{ padding: '1rem' }}>
              <div style={{ background: getStatusBadge(selectedTransaction.status).bg, padding: '0.4rem', borderRadius: '10px', marginBottom: '0.8rem', textAlign: 'center', fontSize: '0.7rem' }}><i className={`fas ${getStatusBadge(selectedTransaction.status).icon}`}></i> Status: {getStatusBadge(selectedTransaction.status).text}</div>
              <div style={{ marginBottom: '0.8rem' }}><div style={{ fontWeight: 600, fontSize: '0.7rem', marginBottom: '0.3rem' }}>Donor Information</div><div style={{ background: '#f9fbf7', borderRadius: '10px', padding: '0.5rem', fontSize: '0.7rem' }}><strong>Name:</strong> {selectedTransaction.full_name}<br/><strong>Email:</strong> {selectedTransaction.email}<br/><strong>Mobile:</strong> {selectedTransaction.mobile_number}</div></div>
              <div style={{ marginBottom: '0.8rem' }}><div style={{ fontWeight: 600, fontSize: '0.7rem', marginBottom: '0.3rem' }}>Donation Details</div><div style={{ background: '#f9fbf7', borderRadius: '10px', padding: '0.5rem', fontSize: '0.7rem' }}><strong>Amount:</strong> {formatCurrency(selectedTransaction.amount)}<br/><strong>Type:</strong> {selectedTransaction.donation_type}<br/><strong>Created:</strong> {formatDate(selectedTransaction.created_at)}</div></div>
              
              {/* Update Status Section */}
              <div style={{ marginBottom: '0.8rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.7rem', marginBottom: '0.3rem' }}>Update Status</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleUpdateTransactionStatus(selectedTransaction.id, 'completed')}
                    style={{ flex: 1, padding: '0.3rem', background: '#4caf50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.65rem', fontWeight: 600 }}
                  >
                    <i className="fas fa-check"></i> Complete
                  </button>
                  <button
                    onClick={() => handleUpdateTransactionStatus(selectedTransaction.id, 'pending')}
                    style={{ flex: 1, padding: '0.3rem', background: '#ff9800', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.65rem', fontWeight: 600 }}
                  >
                    <i className="fas fa-clock"></i> Pending
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={closeModal} style={{ flex: 1, background: '#F9C74F', border: 'none', padding: '0.4rem', borderRadius: '20px', color: '#0B3B2F', fontWeight: 600, cursor: 'pointer', fontSize: '0.7rem' }}>Close</button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setDeletingTransaction(selectedTransaction);
                    setShowTransactionDeleteConfirm(true);
                  }}
                  style={{ flex: 1, background: '#d32f2f', border: 'none', padding: '0.4rem', borderRadius: '20px', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '0.7rem' }}
                >
                  <i className="fas fa-trash-alt"></i> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Delete Confirmation Modal */}
      {showTransactionDeleteConfirm && deletingTransaction && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            maxWidth: '400px',
            width: '100%',
            padding: '2rem',
            textAlign: 'center',
            animation: 'slideInUp 0.3s ease'
          }}>
            <div style={{ width: '60px', height: '60px', margin: '0 auto', borderRadius: '50%', background: '#ffebee', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <i className="fas fa-exclamation-triangle" style={{ fontSize: '1.5rem', color: '#d32f2f' }}></i>
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>Delete Transaction</h3>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>
              Are you sure you want to delete transaction <strong>#{deletingTransaction.id}</strong>? <br />
              Reference: <strong>{deletingTransaction.reference_number}</strong><br />
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => { setShowTransactionDeleteConfirm(false); setDeletingTransaction(null); }}
                disabled={isSubmitting}
                style={{ flex: 1, padding: '0.8rem', background: '#f0f0f0', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTransaction}
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  padding: '0.8rem',
                  background: isSubmitting ? '#ccc' : '#d32f2f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Deleting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-trash-alt"></i>
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Testimonial Modal */}
      {showTestimonialModal && (
        <div className="modal-overlay" onClick={closeTestimonialModal} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', animation: 'fadeIn 0.3s ease'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white', borderRadius: '20px', maxWidth: '500px', width: '100%', maxHeight: '85vh',
            display: 'flex', flexDirection: 'column', position: 'relative', animation: 'slideInUp 0.3s ease'
          }}>
            <button onClick={closeTestimonialModal} style={{
              position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.5)', border: 'none',
              width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', color: 'white', fontSize: '0.875rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
            }}>
              <i className="fas fa-times"></i>
            </button>

            <div style={{
              background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)',
              padding: '1.25rem',
              textAlign: 'center',
              borderRadius: '20px 20px 0 0',
              flexShrink: 0
            }}>
              <div style={{ width: '56px', height: '56px', margin: '0 auto', borderRadius: '50%', background: '#F9C74F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-star" style={{ fontSize: '1.5rem', color: '#0B3B2F' }}></i>
              </div>
              <h2 style={{ color: 'white', marginTop: '0.5rem', fontSize: '1.1rem', fontWeight: 600 }}>
                {isEditMode ? 'Edit Testimonial' : 'Add New Testimonial'}
              </h2>
            </div>

            <div style={{ padding: '1.25rem', overflowY: 'auto', flex: 1 }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={newTestimonial.name}
                  onChange={handleTestimonialChange}
                  style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  placeholder="Enter full name"
                />
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Location</label>
                <input
                  type="text"
                  name="location"
                  value={newTestimonial.location}
                  onChange={handleTestimonialChange}
                  style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  placeholder="e.g., Dar es Salaam, Tanzania"
                />
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Testimonial Text *</label>
                <textarea
                  name="text"
                  value={newTestimonial.text}
                  onChange={handleTestimonialChange}
                  rows="4"
                  style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px', resize: 'vertical' }}
                  placeholder="Share your experience..."
                />
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Rating</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewTestimonial({ ...newTestimonial, rating: star })}
                      style={{
                        padding: '0.3rem 0.6rem',
                        borderRadius: '8px',
                        border: newTestimonial.rating === star ? '2px solid #F9C74F' : '1px solid #ddd',
                        background: newTestimonial.rating === star ? 'rgba(249,199,79,0.1)' : 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <span style={{ fontSize: '0.8rem' }}>{star} ★</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={newTestimonial.is_active}
                    onChange={handleTestimonialChange}
                  />
                  Active (visible on website)
                </label>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Display Order</label>
                <input
                  type="number"
                  name="order"
                  value={newTestimonial.order}
                  onChange={handleTestimonialChange}
                  style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  placeholder="0"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                <button
                  onClick={closeTestimonialModal}
                  disabled={isSubmitting}
                  style={{ flex: 1, background: '#f1f5f9', border: 'none', padding: '0.5rem', borderRadius: '8px', fontWeight: 500, cursor: 'pointer', fontSize: '0.813rem' }}
                >
                  Cancel
                </button>
                <button
                  onClick={isEditMode ? handleUpdateTestimonial : handleAddTestimonial}
                  disabled={isSubmitting}
                  style={{
                    flex: 1,
                    background: isSubmitting ? '#94a3b8' : '#0B3B2F',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    fontWeight: 500,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    fontSize: '0.813rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      {isEditMode ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    <>
                      <i className={`fas ${isEditMode ? 'fa-save' : 'fa-plus'}`}></i>
                      {isEditMode ? 'Update' : 'Add'} Testimonial
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Testimonial Delete Confirmation Modal */}
      {showDeleteConfirm && deletingTestimonial && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            maxWidth: '400px',
            width: '100%',
            padding: '2rem',
            textAlign: 'center',
            animation: 'slideInUp 0.3s ease'
          }}>
            <div style={{ width: '60px', height: '60px', margin: '0 auto', borderRadius: '50%', background: '#ffebee', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <i className="fas fa-exclamation-triangle" style={{ fontSize: '1.5rem', color: '#d32f2f' }}></i>
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>Delete Testimonial</h3>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>
              Are you sure you want to delete the testimonial from <strong>"{deletingTestimonial.name}"</strong>? <br />
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => { setShowDeleteConfirm(false); setDeletingTestimonial(null); }}
                disabled={isSubmitting}
                style={{ flex: 1, padding: '0.8rem', background: '#f0f0f0', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTestimonial}
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  padding: '0.8rem',
                  background: isSubmitting ? '#ccc' : '#d32f2f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Deleting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-trash-alt"></i>
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTransactions;