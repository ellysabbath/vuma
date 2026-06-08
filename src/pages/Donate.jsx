import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Donate = () => {
  // Form state
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [donationType, setDonationType] = useState('one-time');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [apiError, setApiError] = useState('');
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [confirmError, setConfirmError] = useState('');
  const [confirmSuccess, setConfirmSuccess] = useState('');
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [pendingDonations, setPendingDonations] = useState([]);
  const [loadingPending, setLoadingPending] = useState(false);
  const [selectedPendingDonation, setSelectedPendingDonation] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertMessage, setSuccessAlertMessage] = useState('');
  
  // Donation data state - populated from backend response
  const [currentDonation, setCurrentDonation] = useState(null);
  const [transactionCode, setTransactionCode] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  // API Base URL
  const API_BASE_URL = 'https://vuma.pythonanywhere.com/api';

  // M-PESA Number for donations
  const mpesaNumber = "+255 759 913 433";
  const bankDetails = {
    bankName: "CRDB Bank",
    accountName: "VUMA Organization",
    accountNumber: "01 1234567890",
    branch: "Mwanza Branch",
    swiftCode: "CORUTZTZ"
  };

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    
    // Load user data from localStorage (from Profile page)
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser) {
      if (storedUser.email) setEmail(storedUser.email);
      if (storedUser.phone) setMobileNumber(storedUser.phone);
      if (storedUser.first_name || storedUser.last_name) {
        setFullName(`${storedUser.first_name || ''} ${storedUser.last_name || ''}`.trim());
      }
      if (storedUser.city) setLocation(storedUser.city);
    }
  }, []);

  // Preset amounts in TZS
  const presetAmounts = [5000, 10000, 25000, 50000, 100000, 250000];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('sw-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Fetch pending (unconfirmed) donations for the logged-in user
  const fetchPendingDonations = async () => {
    // Get user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userEmail = storedUser.email || email;
    const userMobile = storedUser.phone || mobileNumber;
    
    if (!userEmail && !userMobile) {
      setConfirmError('Please login or enter your email/mobile number to fetch your pending donations');
      return;
    }
    
    setLoadingPending(true);
    setConfirmError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/donations/`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('All donations response:', data);
        
        let allDonations = [];
        if (data.results && Array.isArray(data.results)) {
          allDonations = data.results;
        } else if (Array.isArray(data)) {
          allDonations = data;
        }
        
        // Filter donations by email or mobile number and status = pending
        const userPendingDonations = allDonations.filter(donation => {
          const matchesEmail = donation.email && donation.email.toLowerCase() === (userEmail || '').toLowerCase();
          const matchesMobile = donation.mobile_number && donation.mobile_number === userMobile;
          const isPending = donation.status === 'pending';
          return (matchesEmail || matchesMobile) && isPending;
        });
        
        console.log('User pending donations:', userPendingDonations);
        setPendingDonations(userPendingDonations);
        
        if (userPendingDonations.length === 0) {
          setConfirmError('No pending donations found for your account. Please make a donation first.');
        } else {
          setShowPendingModal(true);
        }
      } else {
        throw new Error('Failed to fetch donations');
      }
    } catch (error) {
      console.error('Error fetching pending donations:', error);
      setConfirmError('Failed to fetch your pending donations. Please try again.');
    } finally {
      setLoadingPending(false);
    }
  };

  // Select a pending donation to confirm
  const selectPendingDonation = (donation) => {
    setSelectedPendingDonation(donation);
    setCurrentDonation(donation);
    setShowPendingModal(false);
    setShowInstructions(true);
    
    // Show a toast notification that donation is loaded
    showTemporaryAlert(`✅ Donation ID ${donation.id} loaded! Enter your transaction code to confirm.`, 'info');
    
    // Scroll to instructions
    setTimeout(() => {
      const instructionsSection = document.getElementById('donation-instructions');
      if (instructionsSection) {
        instructionsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  // Close modal
  const closePendingModal = () => {
    setShowPendingModal(false);
    setPendingDonations([]);
  };

  // Show temporary alert/toast notification
  const showTemporaryAlert = (message, type = 'success') => {
    setSuccessAlertMessage(message);
    setShowSuccessAlert(true);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setShowSuccessAlert(false);
      setSuccessAlertMessage('');
    }, 5000);
  };

  // Generate Receipt
  const generateReceipt = () => {
    if (!currentDonation) return;
    
    const receiptContent = `VUMA ORGANIZATION DONATION RECEIPT
=================================

Receipt No: ${currentDonation.reference_number}
Donation ID: ${currentDonation.id}
Date: ${currentDonation.created_at ? new Date(currentDonation.created_at).toLocaleString() : new Date().toLocaleString()}
Transaction Code: ${transactionCode || currentDonation.transaction_code || 'Not yet provided'}

=================================
DONOR INFORMATION
=================================
Full Name: ${currentDonation.full_name}
Email: ${currentDonation.email}
Mobile Number: ${currentDonation.mobile_number}
Location: ${currentDonation.location}

=================================
DONATION DETAILS
=================================
Amount: ${currentDonation.formatted_amount || formatCurrency(parseFloat(currentDonation.amount))}
Donation Type: ${currentDonation.donation_type === 'one-time' ? 'One-Time' : 'Monthly'}
Status: ${currentDonation.status === 'completed' ? 'Completed ✓' : currentDonation.status}
Reference Number: ${currentDonation.reference_number}

=================================
PAYMENT INSTRUCTIONS
=================================
M-PESA Number: ${mpesaNumber}
Bank: ${bankDetails.bankName}
Account Name: ${bankDetails.accountName}
Account Number: ${bankDetails.accountNumber}
Branch: ${bankDetails.branch}
SWIFT Code: ${bankDetails.swiftCode}

=================================
PAYMENT LOGS
=================================
${currentDonation.logs?.map(log => `- ${new Date(log.created_at).toLocaleString()}: ${log.description}`).join('\n') || 'No logs available'}

=================================
Thank you for your support!
VUMA Organization - www.vuma.org
=================================`;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VUMA_Donation_Receipt_${currentDonation.reference_number}_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showTemporaryAlert('📄 Receipt downloaded successfully!', 'info');
  };

  // Save donation to backend API
  const saveDonationToBackend = async (donationData) => {
    try {
      const requestBody = {
        donation_type: donationData.donationType,
        amount: donationData.amount,
        full_name: donationData.fullName,
        email: donationData.email,
        mobile_number: donationData.mobileNumber,
        location: donationData.location,
        message: donationData.message || '',
      };
      
      console.log('Sending donation request:', requestBody);
      
      const response = await fetch(`${API_BASE_URL}/donations/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        throw new Error(errorData.message || errorData.error || 'Failed to save donation');
      }

      const data = await response.json();
      console.log('Donation save response:', data);
      
      let donationObject = null;
      
      if (data.results && Array.isArray(data.results) && data.results.length > 0) {
        donationObject = data.results[0];
      } else if (Array.isArray(data) && data.length > 0) {
        donationObject = data[0];
      } else if (data.id) {
        donationObject = data;
      } else if (data.data && data.data.id) {
        donationObject = data.data;
      }
      
      if (!donationObject || !donationObject.id) {
        console.error('Could not extract donation with ID from response:', data);
        throw new Error('Donation created but could not retrieve ID. Please contact support.');
      }
      
      console.log('Final donation object with ID:', donationObject);
      return donationObject;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  // Fetch single donation by ID
  const fetchDonationById = async (donationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/donations/${donationId}/`);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched donation by ID:', data);
        return data;
      }
    } catch (error) {
      console.error('Error fetching donation:', error);
    }
    return null;
  };

  // Confirm payment using the API
  const confirmPaymentAPI = async (donationId, paymentMethod, transactionCode) => {
    try {
      const url = `${API_BASE_URL}/donations/${donationId}/confirm_payment/`;
      const payload = {
        payment_method: paymentMethod,
        transaction_code: transactionCode
      };
      
      console.log('Confirming payment with:', {
        donationId,
        paymentMethod,
        transactionCode,
        url,
        payload
      });
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Payment confirmation error response:', errorData);
        
        let errorMessage = 'Failed to confirm payment';
        if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Payment confirmation response:', data);
      return data;
    } catch (error) {
      console.error('Payment confirmation error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const amount = selectedAmount || customAmount;
    
    if (!amount) {
      alert('Please select or enter a donation amount');
      return;
    }
    if (parseFloat(amount) < 1000) {
      alert('Minimum donation amount is 1,000 TZS');
      return;
    }
    if (!fullName || !email || !mobileNumber || !location) {
      alert('Please fill in all required fields (Name, Email, Mobile Number, Location)');
      return;
    }
    
    setIsSubmitting(true);
    setApiError('');
    
    const donationData = {
      donationType: donationType,
      amount: parseFloat(amount),
      fullName: fullName,
      email: email,
      mobileNumber: mobileNumber,
      location: location,
      message: message || '',
    };
    
    try {
      const savedDonation = await saveDonationToBackend(donationData);
      
      if (savedDonation && savedDonation.id) {
        console.log('Donation saved with ID:', savedDonation.id);
        setCurrentDonation(savedDonation);
      } else {
        throw new Error('Could not retrieve donation information. Please contact support.');
      }
      
      setShowInstructions(true);
      
      showTemporaryAlert(`✅ Donation created successfully! Reference: ${savedDonation.reference_number}`, 'success');
      
      setTimeout(() => {
        const instructionsSection = document.getElementById('donation-instructions');
        if (instructionsSection) {
          instructionsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      
    } catch (error) {
      setApiError(error.message || 'Failed to process donation. Please try again.');
      showTemporaryAlert(`❌ Error: ${error.message || 'Failed to process donation'}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentConfirmation = async () => {
    setConfirmError('');
    setConfirmSuccess('');
    
    if (!selectedPaymentMethod) {
      setConfirmError('Please select a payment method (M-PESA or Bank Transfer)');
      showTemporaryAlert('⚠️ Please select a payment method', 'error');
      return;
    }
    if (!transactionCode) {
      setConfirmError('Please enter your transaction code');
      showTemporaryAlert('⚠️ Please enter your transaction code', 'error');
      return;
    }
    if (!currentDonation || !currentDonation.id) {
      setConfirmError('Donation ID is missing. Please select a pending donation or create a new one.');
      showTemporaryAlert('❌ Donation ID is missing. Please try again.', 'error');
      return;
    }
    
    if (transactionCode.trim().length < 4) {
      setConfirmError('Transaction code should be at least 4 characters long');
      showTemporaryAlert('⚠️ Transaction code should be at least 4 characters long', 'error');
      return;
    }
    
    setPaymentConfirmed(true);
    
    // Show confirming status
    showTemporaryAlert('⏳ Confirming your payment... Please wait.', 'info');
    
    try {
      const result = await confirmPaymentAPI(currentDonation.id, selectedPaymentMethod, transactionCode.trim());
      
      // Fetch the updated donation data
      const updatedDonation = await fetchDonationById(currentDonation.id);
      if (updatedDonation) {
        setCurrentDonation(updatedDonation);
      }
      
      const successMsg = `✅ Payment confirmed successfully! Amount: ${currentDonation.formatted_amount || formatCurrency(parseFloat(currentDonation.amount))} via ${selectedPaymentMethod === 'mpesa' ? 'M-PESA' : 'CRDB Bank'}`;
      
      setConfirmSuccess(successMsg);
      
      // Show success alert
      showTemporaryAlert(successMsg, 'success');
      
      // Clear form
      setTransactionCode('');
      setSelectedPaymentMethod('');
      
      // Auto-clear success message after 5 seconds
      setTimeout(() => {
        setConfirmSuccess('');
      }, 5000);
      
    } catch (error) {
      console.error('Payment confirmation failed:', error);
      
      let userFriendlyMessage = error.message || 'Failed to confirm payment';
      
      if (error.message.includes('404')) {
        userFriendlyMessage = `Donation not found. Please check your donation ID and try again.`;
      } else if (error.message.includes('already confirmed')) {
        userFriendlyMessage = '✅ This payment has already been confirmed. No further action needed.';
        // Refresh donation data
        const updatedDonation = await fetchDonationById(currentDonation.id);
        if (updatedDonation) {
          setCurrentDonation(updatedDonation);
        }
        showTemporaryAlert(userFriendlyMessage, 'success');
      } else if (error.message.includes('invalid') || error.message.includes('Invalid')) {
        userFriendlyMessage = '❌ Invalid transaction code or payment method. Please check and try again.';
        showTemporaryAlert(userFriendlyMessage, 'error');
      } else {
        showTemporaryAlert(`❌ ${userFriendlyMessage}`, 'error');
      }
      
      setConfirmError(userFriendlyMessage);
    } finally {
      setPaymentConfirmed(false);
    }
  };

  const closeInstructions = () => {
    setShowInstructions(false);
    setSelectedPendingDonation(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return 'N/A';
    }
  };

  const impactStats = [
    { value: '5,000+', label: 'Youth Reached', icon: 'fas fa-users' },
    { value: '12,450', label: 'Trees Planted', icon: 'fas fa-tree' },
    { value: '50+', label: 'Projects Completed', icon: 'fas fa-project-diagram' },
    { value: '450+', label: 'Tons of Waste Removed', icon: 'fas fa-trash-alt' }
  ];

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7' }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlideIn {
          from { opacity: 0; transform: translateY(-50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
            visibility: hidden;
          }
        }
        .instruction-card { animation: fadeInUp 0.5s ease forwards; }
        .copy-btn { transition: all 0.3s ease; }
        .copy-btn:hover { background: #F9C74F !important; color: #0B3B2F !important; }
        .reference-card { background: linear-gradient(135deg, #0B3B2F, #1a5c48); animation: fadeInUp 0.5s ease; }
        .stat-card { transition: all 0.3s ease; }
        .stat-card:hover { transform: translateY(-5px); background: rgba(11,59,47,0.03); }
        .error-message { animation: fadeInUp 0.3s ease; }
        .success-message { animation: fadeInUp 0.3s ease; }
        .log-entry { transition: background 0.2s ease; }
        .log-entry:hover { background: rgba(249,199,79,0.1); }
        .donation-id-box { background: linear-gradient(135deg, #F9C74F, #f8b500); color: #0B3B2F; padding: 0.5rem 1rem; border-radius: 12px; font-weight: bold; font-size: 1.2rem; text-align: center; }
        .modal-overlay { animation: modalFadeIn 0.3s ease; }
        .modal-content { animation: modalSlideIn 0.3s ease; }
        .pending-donation-item { transition: all 0.2s ease; cursor: pointer; }
        .pending-donation-item:hover { background: rgba(249,199,79,0.1); transform: translateX(5px); }
        .success-alert {
          position: fixed;
          top: 80px;
          right: 20px;
          z-index: 10000;
          animation: slideInRight 0.3s ease;
          max-width: 400px;
          width: calc(100% - 40px);
        }
        .success-alert.fade-out {
          animation: fadeOut 0.5s ease forwards;
        }
      `}</style>

      {/* Success Alert Toast Notification */}
      {showSuccessAlert && (
        <div className={`success-alert ${!showSuccessAlert ? 'fade-out' : ''}`} style={{
          background: successAlertMessage.includes('✅') ? '#e8f5e9' : (successAlertMessage.includes('❌') ? '#ffebee' : (successAlertMessage.includes('⚠️') ? '#fff3e0' : '#e3f2fd')),
          color: successAlertMessage.includes('✅') ? '#2e7d32' : (successAlertMessage.includes('❌') ? '#c62828' : (successAlertMessage.includes('⚠️') ? '#e65100' : '#1565c0')),
          padding: '1rem',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          borderLeft: `4px solid ${successAlertMessage.includes('✅') ? '#4caf50' : (successAlertMessage.includes('❌') ? '#d32f2f' : (successAlertMessage.includes('⚠️') ? '#ff9800' : '#2196f3'))}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <i className="fas fa-bell" style={{ fontSize: '1.2rem' }}></i>
            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{successAlertMessage}</span>
          </div>
          <button
            onClick={() => setShowSuccessAlert(false)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'inherit',
              fontSize: '1rem'
            }}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)',
        color: 'white',
        padding: '4rem 2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(249,199,79,0.1) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-20%',
          left: '-10%',
          width: '250px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(249,199,79,0.08) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
        
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h1 data-aos="fade-up" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1rem' }}>
            Support Our Mission
          </h1>
          <p data-aos="fade-up" data-aos-delay="200" style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)', opacity: 0.9 }}>
            Your donation helps restore Lake Victoria, empower youth, promote climate-smart agriculture, and build sustainable communities across Tanzania.
          </p>
        </div>
      </div>

      {/* Impact Stats */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {impactStats.map((stat, idx) => (
            <div key={idx} data-aos="zoom-in" data-aos-delay={idx * 100} className="stat-card" style={{
              background: 'white',
              borderRadius: '20px',
              padding: '1.5rem',
              textAlign: 'center',
              boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
              cursor: 'pointer'
            }}>
              <i className={stat.icon} style={{ fontSize: '2rem', color: '#F9C74F', marginBottom: '0.5rem' }}></i>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0B3B2F' }}>{stat.value}</div>
              <div style={{ color: '#666', fontSize: '0.85rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Button to View Pending Donations */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <button
            onClick={fetchPendingDonations}
            disabled={loadingPending}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.8rem',
              padding: '0.8rem 1.5rem',
              background: '#0B3B2F',
              border: 'none',
              borderRadius: '50px',
              cursor: loadingPending ? 'not-allowed' : 'pointer',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'white',
              transition: 'all 0.3s ease',
              opacity: loadingPending ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!loadingPending) {
                e.currentTarget.style.background = '#1a5c48';
                e.currentTarget.style.transform = 'scale(1.02)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#0B3B2F';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {loadingPending ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                <span>Loading...</span>
              </>
            ) : (
              <>
                <i className="fas fa-clock"></i>
                <span>View My Pending Donations</span>
              </>
            )}
          </button>
        </div>

        {/* Donation Form */}
        <div data-aos="fade-up" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '2rem',
          alignItems: 'start'
        }}>
          {/* Donation Form Card */}
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '2rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: '#0B3B2F', marginBottom: '0.5rem' }}>Make a Donation</h2>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>Fill out the form to receive a reference number and payment instructions</p>

            {apiError && (
              <div style={{
                background: '#ffebee',
                color: '#d32f2f',
                padding: '0.8rem',
                borderRadius: '12px',
                marginBottom: '1rem',
                fontSize: '0.85rem'
              }}>
                <i className="fas fa-exclamation-circle" style={{ marginRight: '0.5rem' }}></i>
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Donation Type */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600 }}>Donation Type</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setDonationType('one-time')}
                    style={{
                      flex: 1,
                      padding: '0.8rem',
                      borderRadius: '12px',
                      border: donationType === 'one-time' ? '2px solid #F9C74F' : '1px solid #ddd',
                      background: donationType === 'one-time' ? 'rgba(249,199,79,0.1)' : 'white',
                      color: donationType === 'one-time' ? '#F9C74F' : '#666',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    One-Time
                  </button>
                  <button
                    type="button"
                    onClick={() => setDonationType('monthly')}
                    style={{
                      flex: 1,
                      padding: '0.8rem',
                      borderRadius: '12px',
                      border: donationType === 'monthly' ? '2px solid #F9C74F' : '1px solid #ddd',
                      background: donationType === 'monthly' ? 'rgba(249,199,79,0.1)' : 'white',
                      color: donationType === 'monthly' ? '#F9C74F' : '#666',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Monthly
                  </button>
                </div>
              </div>

              {/* Donation Amount */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600 }}>Select Amount (TZS)</label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                  gap: '0.8rem',
                  marginBottom: '1rem'
                }}>
                  {presetAmounts.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => handleAmountSelect(amount)}
                      style={{
                        padding: '0.8rem',
                        borderRadius: '12px',
                        border: selectedAmount === amount ? '2px solid #F9C74F' : '1px solid #ddd',
                        background: selectedAmount === amount ? 'rgba(249,199,79,0.1)' : 'white',
                        color: selectedAmount === amount ? '#F9C74F' : '#333',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {formatCurrency(amount)}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  placeholder="Other amount (TZS) - Minimum 1,000"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '12px',
                    border: '1px solid #ddd',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#F9C74F'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
                />
                <p style={{ fontSize: '0.7rem', color: '#888', marginTop: '0.5rem' }}>
                  <i className="fas fa-info-circle" style={{ marginRight: '0.3rem' }}></i>
                  Minimum donation: 1,000 TZS
                </p>
              </div>

              {/* Personal Information */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600 }}>Your Information</label>
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '12px',
                    border: '1px solid #ddd',
                    marginBottom: '1rem',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#F9C74F'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
                />
                <input
                  type="email"
                  placeholder="Email Address *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '12px',
                    border: '1px solid #ddd',
                    marginBottom: '1rem',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#F9C74F'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
                />
                <input
                  type="tel"
                  placeholder="Mobile Number * (e.g., 0712345678)"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '12px',
                    border: '1px solid #ddd',
                    marginBottom: '1rem',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#F9C74F'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
                />
                <input
                  type="text"
                  placeholder="Location * (City, Region, or District)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '12px',
                    border: '1px solid #ddd',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#F9C74F'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
                />
              </div>

              {/* Message */}
              <div style={{ marginBottom: '1.5rem' }}>
                <textarea
                  placeholder="Leave a message (optional)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '12px',
                    border: '1px solid #ddd',
                    fontSize: '1rem',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#F9C74F'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  background: isSubmitting ? '#0B3B2F' : '#F9C74F',
                  border: 'none',
                  padding: '1rem',
                  borderRadius: '50px',
                  color: isSubmitting ? 'white' : '#0B3B2F',
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: isSubmitting ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 5px 20px rgba(249,199,79,0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-heart" style={{ marginRight: '0.5rem' }}></i>
                    Submit Donation
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Why Donate Section */}
          <div data-aos="fade-up" data-aos-delay="200">
            <div style={{
              background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)',
              borderRadius: '24px',
              padding: '2rem',
              color: 'white',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ marginBottom: '1rem' }}>Why Donate to VUMA?</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {[
                  '100% of donations go directly to programs',
                  'Transparent reporting on impact',
                  'Tax-deductible receipts provided',
                  'Support youth-led environmental initiatives',
                  'Help restore Lake Victoria ecosystem',
                  'Empower smallholder farmers with solar irrigation',
                  'Create green corridors in urban areas'
                ].map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
                    <i className="fas fa-check-circle" style={{ color: '#F9C74F' }}></i>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: '2rem',
              boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
              textAlign: 'center'
            }}>
              <i className="fas fa-hand-holding-heart" style={{ fontSize: '3rem', color: '#F9C74F', marginBottom: '1rem' }}></i>
              <h3 style={{ color: '#0B3B2F', marginBottom: '0.5rem' }}>Other Ways to Give</h3>
              <p style={{ color: '#666', marginBottom: '1rem' }}>
                Contact us for corporate partnerships or legacy giving.
              </p>
              <Link to="/contact" style={{
                color: '#F9C74F',
                textDecoration: 'none',
                fontWeight: 600
              }}>
                Contact Us →
              </Link>
            </div>
          </div>
        </div>

        {/* Donation Instructions Card */}
        {showInstructions && currentDonation && (
          <div id="donation-instructions" className="instruction-card" style={{
            marginTop: '3rem',
            background: 'white',
            borderRadius: '28px',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            border: '2px solid rgba(249,199,79,0.3)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{ color: '#0B3B2F', margin: 0 }}>
                <i className="fas fa-hand-holding-heart" style={{ color: '#F9C74F', marginRight: '0.5rem' }}></i>
                Donation Instructions
              </h2>
              <button
                onClick={closeInstructions}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#999',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#d32f2f'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Donation Info Card */}
            <div className="reference-card" style={{
              borderRadius: '20px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              color: 'white'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <p style={{ marginBottom: '0.3rem', opacity: 0.7, fontSize: '0.7rem' }}>DONATION ID (Use for Payment Confirmation)</p>
                <div className="donation-id-box" style={{
                  display: 'inline-block',
                  background: '#F9C74F',
                  color: '#0B3B2F',
                  padding: '0.8rem 1.5rem',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  fontSize: '1.3rem',
                  textAlign: 'center'
                }}>
                  <i className="fas fa-hashtag" style={{ marginRight: '0.5rem' }}></i>
                  {currentDonation.id || 'ID not found'}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <p style={{ marginBottom: '0.3rem', opacity: 0.7, fontSize: '0.7rem' }}>Reference Number</p>
                  <code style={{ fontSize: '0.9rem', fontWeight: 'bold', background: 'rgba(255,255,255,0.2)', padding: '0.3rem 0.6rem', borderRadius: '8px', display: 'inline-block' }}>
                    {currentDonation.reference_number || 'N/A'}
                  </code>
                </div>
                <div>
                  <p style={{ marginBottom: '0.3rem', opacity: 0.7, fontSize: '0.7rem' }}>Amount</p>
                  <code style={{ fontSize: '1rem', fontWeight: 'bold', background: 'rgba(255,255,255,0.2)', padding: '0.3rem 0.6rem', borderRadius: '8px', display: 'inline-block' }}>
                    {currentDonation.formatted_amount || formatCurrency(parseFloat(currentDonation.amount))}
                  </code>
                </div>
                <div>
                  <p style={{ marginBottom: '0.3rem', opacity: 0.7, fontSize: '0.7rem' }}>Status</p>
                  <span style={{
                    display: 'inline-block',
                    background: currentDonation.status === 'completed' ? '#4caf50' : '#F9C74F',
                    color: currentDonation.status === 'completed' ? 'white' : '#0B3B2F',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    {currentDonation.status === 'completed' ? '✓ COMPLETED' : '⏳ PENDING'}
                  </span>
                </div>
              </div>
            </div>

            {/* Donor Information Card */}
            <div style={{
              background: 'rgba(11,59,47,0.05)',
              borderRadius: '16px',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}>
              <h4 style={{ color: '#0B3B2F', marginBottom: '0.8rem' }}>📋 Donor Information</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.8rem' }}>
                <div><strong>Full Name:</strong> {currentDonation.full_name}</div>
                <div><strong>Email:</strong> {currentDonation.email}</div>
                <div><strong>Mobile:</strong> {currentDonation.mobile_number}</div>
                <div><strong>Location:</strong> {currentDonation.location}</div>
                <div><strong>Donation Type:</strong> {currentDonation.donation_type === 'one-time' ? 'One-Time' : 'Monthly'}</div>
                <div><strong>Created:</strong> {formatDate(currentDonation.created_at)}</div>
              </div>
              {currentDonation.message && (
                <div style={{ marginTop: '0.8rem', padding: '0.5rem', background: 'rgba(249,199,79,0.1)', borderRadius: '8px' }}>
                  <strong>💬 Message:</strong> "{currentDonation.message}"
                </div>
              )}
            </div>

            {/* Payment Logs Card */}
            {currentDonation.logs && currentDonation.logs.length > 0 && (
              <div style={{
                background: '#f9fbf7',
                borderRadius: '16px',
                padding: '1rem',
                marginBottom: '1.5rem',
                border: '1px solid #e0e0e0'
              }}>
                <h4 style={{ color: '#0B3B2F', marginBottom: '0.8rem' }}>
                  <i className="fas fa-history"></i> Payment Activity Log
                </h4>
                <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                  {currentDonation.logs.map((log, idx) => (
                    <div key={log.id} className="log-entry" style={{
                      padding: '0.5rem',
                      borderBottom: idx < currentDonation.logs.length - 1 ? '1px solid #e0e0e0' : 'none',
                      fontSize: '0.75rem'
                    }}>
                      <span style={{ color: '#F9C74F', fontWeight: 'bold' }}>●</span>
                      <span style={{ marginLeft: '0.5rem', color: '#666' }}>{formatDate(log.created_at)}</span>
                      <span style={{ marginLeft: '0.5rem', color: '#0B3B2F' }}>{log.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* M-PESA Instructions */}
            <div style={{
              background: 'linear-gradient(135deg, #f9fbf7, #f0f5ee)',
              borderRadius: '20px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              border: '1px solid #e0e0e0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: '#0B3B2F',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <i className="fas fa-mobile-alt" style={{ fontSize: '1.5rem', color: '#F9C74F' }}></i>
                </div>
                <div>
                  <h3 style={{ color: '#0B3B2F', margin: 0 }}>M-PESA / Mobile Money</h3>
                  <p style={{ color: '#666', margin: 0, fontSize: '0.8rem' }}>Send money directly to our official number</p>
                </div>
              </div>
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: '#888' }}>Send to:</p>
                  <p style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0B3B2F', margin: 0 }}>{mpesaNumber}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(mpesaNumber)}
                  className="copy-btn"
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #F9C74F',
                    background: 'white',
                    cursor: 'pointer',
                    color: '#0B3B2F',
                    fontWeight: 600
                  }}
                >
                  <i className="fas fa-copy"></i> Copy Number
                </button>
              </div>
              <div style={{ marginTop: '1rem' }}>
                <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.3rem' }}>
                  <i className="fas fa-info-circle" style={{ color: '#F9C74F', marginRight: '0.3rem' }}></i>
                  <strong>Instructions:</strong>
                </p>
                <ol style={{ fontSize: '0.75rem', color: '#666', margin: 0, paddingLeft: '1.2rem' }}>
                  <li>Open your M-PESA app</li>
                  <li>Select "Send Money"</li>
                  <li>Enter number: <strong>{mpesaNumber}</strong></li>
                  <li>Enter amount: <strong>{currentDonation.formatted_amount || formatCurrency(parseFloat(currentDonation.amount))}</strong></li>
                  <li>Enter reference: <strong>{currentDonation.reference_number}</strong></li>
                  <li>Enter your name: <strong>{currentDonation.full_name}</strong></li>
                  <li>Complete the transaction</li>
                </ol>
              </div>
            </div>

            {/* Bank Transfer Instructions */}
            <div style={{
              background: 'linear-gradient(135deg, #f9fbf7, #f0f5ee)',
              borderRadius: '20px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              border: '1px solid #e0e0e0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: '#0B3B2F',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <i className="fas fa-university" style={{ fontSize: '1.5rem', color: '#F9C74F' }}></i>
                </div>
                <div>
                  <h3 style={{ color: '#0B3B2F', margin: 0 }}>CRDB Bank Transfer</h3>
                  <p style={{ color: '#666', margin: 0, fontSize: '0.8rem' }}>Direct deposit to our bank account</p>
                </div>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div>
                  <p style={{ fontSize: '0.7rem', color: '#888', marginBottom: '0.2rem' }}>Bank Name</p>
                  <p style={{ fontWeight: 600, color: '#0B3B2F', margin: 0 }}>{bankDetails.bankName}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.7rem', color: '#888', marginBottom: '0.2rem' }}>Account Name</p>
                  <p style={{ fontWeight: 600, color: '#0B3B2F', margin: 0 }}>{bankDetails.accountName}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.7rem', color: '#888', marginBottom: '0.2rem' }}>Account Number</p>
                  <p style={{ fontWeight: 600, color: '#0B3B2F', margin: 0 }}>{bankDetails.accountNumber}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.7rem', color: '#888', marginBottom: '0.2rem' }}>Reference Number</p>
                  <p style={{ fontWeight: 600, color: '#0B3B2F', margin: 0 }}>{currentDonation.reference_number}</p>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(bankDetails.accountNumber)}
                className="copy-btn"
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #F9C74F',
                  background: 'white',
                  cursor: 'pointer',
                  color: '#0B3B2F',
                  fontWeight: 600,
                  width: '100%'
                }}
              >
                <i className="fas fa-copy"></i> Copy Account Number
              </button>
            </div>

            {/* Payment Confirmation Section */}
            {currentDonation.status !== 'completed' && (
              <div style={{
                background: 'rgba(249,199,79,0.15)',
                borderRadius: '20px',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                border: '2px solid #F9C74F'
              }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '1rem', textAlign: 'center' }}>
                  <i className="fas fa-check-circle" style={{ marginRight: '0.5rem', color: '#4caf50' }}></i>
                  Confirm Your Payment
                </h3>
                
                {confirmError && (
                  <div className="error-message" style={{
                    background: '#ffebee',
                    color: '#d32f2f',
                    padding: '0.8rem',
                    borderRadius: '12px',
                    marginBottom: '1rem'
                  }}>
                    <i className="fas fa-exclamation-triangle"></i> {confirmError}
                  </div>
                )}
                
                {confirmSuccess && (
                  <div className="success-message" style={{
                    background: '#e8f5e9',
                    color: '#2e7d32',
                    padding: '0.8rem',
                    borderRadius: '12px',
                    marginBottom: '1rem'
                  }}>
                    <i className="fas fa-check-circle"></i> {confirmSuccess}
                  </div>
                )}
                
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <select
                    value={selectedPaymentMethod}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '0.8rem',
                      borderRadius: '12px',
                      border: '1px solid #ddd',
                      fontSize: '0.9rem'
                    }}
                  >
                    <option value="">Select payment method</option>
                    <option value="mpesa">M-PESA</option>
                    <option value="bank">CRDB Bank Transfer</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Enter Transaction Code (e.g., QRK7L9X2)"
                    value={transactionCode}
                    onChange={(e) => setTransactionCode(e.target.value)}
                    style={{
                      flex: 2,
                      padding: '0.8rem',
                      borderRadius: '12px',
                      border: '1px solid #ddd'
                    }}
                  />
                  <button
                    onClick={handlePaymentConfirmation}
                    disabled={paymentConfirmed}
                    style={{
                      padding: '0.8rem 1.5rem',
                      borderRadius: '50px',
                      background: paymentConfirmed ? '#ccc' : '#0B3B2F',
                      color: 'white',
                      fontWeight: 600,
                      cursor: paymentConfirmed ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {paymentConfirmed ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i> Confirming...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check"></i> Confirm Payment
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={generateReceipt}
                style={{
                  padding: '0.6rem 1.2rem',
                  borderRadius: '50px',
                  border: '1px solid #F9C74F',
                  background: 'white',
                  cursor: 'pointer',
                  color: '#0B3B2F',
                  fontWeight: 600
                }}
              >
                <i className="fas fa-download"></i> Download Receipt
              </button>
              <button
                onClick={() => {
                  window.location.href = `mailto:donations@vuma.org?subject=Donation Payment Confirmation - ${currentDonation.reference_number}&body=Donation ID: ${currentDonation.id}%0D%0AReference: ${currentDonation.reference_number}%0D%0AName: ${currentDonation.full_name}%0D%0AAmount: ${currentDonation.formatted_amount}%0D%0ATransaction Code: ${transactionCode}`;
                }}
                style={{
                  padding: '0.6rem 1.2rem',
                  borderRadius: '50px',
                  border: 'none',
                  background: '#0B3B2F',
                  cursor: 'pointer',
                  color: 'white',
                  fontWeight: 600
                }}
              >
                <i className="fas fa-envelope"></i> Confirm via Email
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pending Donations Modal */}
      {showPendingModal && (
        <div className="modal-overlay" onClick={closePendingModal} style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white',
            borderRadius: '28px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative'
          }}>
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)',
              padding: '1.5rem',
              textAlign: 'center',
              position: 'relative'
            }}>
              <button
                onClick={closePendingModal}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '16px',
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  color: 'white',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <i className="fas fa-times"></i>
              </button>
              <div style={{
                width: '50px',
                height: '50px',
                background: '#F9C74F',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.5rem'
              }}>
                <i className="fas fa-clock" style={{ fontSize: '1.5rem', color: '#0B3B2F' }}></i>
              </div>
              <h2 style={{ color: 'white', margin: 0, fontSize: '1.3rem' }}>Pending Donations</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', margin: '0.3rem 0 0', fontSize: '0.8rem' }}>
                Select a donation to confirm payment
              </p>
            </div>

            {/* Modal Body - List of Pending Donations */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1rem'
            }}>
              {pendingDonations.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <i className="fas fa-inbox" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                  <p style={{ marginTop: '1rem', color: '#666' }}>No pending donations found</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {pendingDonations.map((donation) => (
                    <div
                      key={donation.id}
                      className="pending-donation-item"
                      onClick={() => selectPendingDonation(donation)}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem',
                        background: '#f9fbf7',
                        borderRadius: '16px',
                        border: '1px solid #e0e0e0',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 'bold', color: '#0B3B2F', marginBottom: '0.3rem' }}>
                          <i className="fas fa-hashtag" style={{ fontSize: '0.7rem', marginRight: '0.3rem', color: '#F9C74F' }}></i>
                          ID: {donation.id}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '0.2rem' }}>
                          <i className="fas fa-calendar-alt" style={{ marginRight: '0.3rem' }}></i>
                          {formatDate(donation.created_at)}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#666' }}>
                          <i className="fas fa-tag" style={{ marginRight: '0.3rem' }}></i>
                          Ref: {donation.reference_number}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#F9C74F' }}>
                          {donation.formatted_amount || formatCurrency(parseFloat(donation.amount))}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: '#888', marginTop: '0.2rem' }}>
                          {donation.donation_type === 'one-time' ? 'One-Time' : 'Monthly'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1rem',
              borderTop: '1px solid #e0e0e0',
              textAlign: 'center'
            }}>
              <button
                onClick={closePendingModal}
                style={{
                  padding: '0.6rem 1.5rem',
                  borderRadius: '50px',
                  border: 'none',
                  background: '#0B3B2F',
                  color: 'white',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Testimonials */}
      <div style={{ background: '#f0f5ee', padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 data-aos="fade-up" style={{ color: '#0B3B2F', marginBottom: '2rem' }}>What Donors Say</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              { text: "I've seen firsthand how VUMA transforms communities around Lake Victoria. My donation is making a real difference.", author: "Sarah M.", location: "United States" },
              { text: "Supporting VUMA is the best investment I've made in Africa's environmental future.", author: "James K.", location: "United Kingdom" },
              { text: "The payment confirmation process was very easy. I just entered my transaction code and got confirmation instantly.", author: "Maria G.", location: "Germany" }
            ].map((testimonial, idx) => (
              <div key={idx} data-aos="fade-up" data-aos-delay={idx * 100} style={{
                background: 'white',
                borderRadius: '20px',
                padding: '1.5rem',
                textAlign: 'center',
                boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
              }}>
                <i className="fas fa-quote-left" style={{ fontSize: '2rem', color: '#F9C74F', opacity: 0.5, marginBottom: '1rem' }}></i>
                <p style={{ color: '#666', fontStyle: 'italic', marginBottom: '1rem' }}>"{testimonial.text}"</p>
                <h4 style={{ color: '#0B3B2F', marginBottom: '0.2rem' }}>{testimonial.author}</h4>
                <p style={{ fontSize: '0.8rem', color: '#888' }}>{testimonial.location}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;