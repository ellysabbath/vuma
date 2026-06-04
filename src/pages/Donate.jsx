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
  
  // Donation data state - BACKEND generates the reference number
  const [referenceNumber, setReferenceNumber] = useState('');
  const [submittedDonation, setSubmittedDonation] = useState(null);
  const [transactionCode, setTransactionCode] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  // API Base URL
  const API_BASE_URL = 'http://127.0.0.1:8000/api';

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

  // Generate Receipt - uses backend-generated reference number
  const generateReceipt = () => {
    const currentRefNumber = referenceNumber || (submittedDonation?.referenceNumber) || 'N/A';
    const currentAmount = (selectedAmount || customAmount) || (submittedDonation?.amount) || 0;
    const currentFormattedAmount = formatCurrency(parseFloat(currentAmount));
    const currentStatus = submittedDonation?.status || 'Pending Payment';
    const currentDonationType = donationType;
    
    const receiptContent = `VUMA ORGANIZATION DONATION RECEIPT
=================================

Receipt No: ${currentRefNumber}
Date: ${new Date().toLocaleString()}
Transaction Code: ${transactionCode || 'Not yet provided'}

=================================
DONOR INFORMATION
=================================
Full Name: ${fullName}
Email: ${email}
Mobile Number: ${mobileNumber}
Location: ${location}

=================================
DONATION DETAILS
=================================
Amount: ${currentFormattedAmount}
Donation Type: ${currentDonationType === 'one-time' ? 'One-Time' : 'Monthly'}
Status: ${currentStatus}
Reference Number: ${currentRefNumber}

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
Thank you for your support!
VUMA Organization - www.vuma.or.tz
=================================`;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VUMA_Donation_Receipt_${currentRefNumber}_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Save donation to backend API - BACKEND generates reference number
  const saveDonationToBackend = async (donationData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/donations/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donation_type: donationData.donationType,
          amount: donationData.amount,
          full_name: donationData.fullName,
          email: donationData.email,
          mobile_number: donationData.mobileNumber,
          location: donationData.location,
          message: donationData.message || '',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        throw new Error(errorData.message || 'Failed to save donation');
      }

      const data = await response.json();
      console.log('Donation saved successfully. Backend generated reference:', data.reference_number);
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  // Confirm payment with transaction code from M-PESA
  const confirmPaymentAPI = async (refNumber, paymentMethod, transCode) => {
    try {
      const payload = {
        reference_number: refNumber,
        payment_method: paymentMethod,
        transaction_code: transCode
      };
      
      console.log('Sending payment confirmation payload:', payload);
      
      const response = await fetch(`${API_BASE_URL}/donations/status/`, {
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
        throw new Error(errorData.error || errorData.message || 'Failed to confirm payment');
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
      // Save to backend - BACKEND generates reference number automatically
      const savedDonation = await saveDonationToBackend(donationData);
      
      // Use the reference number generated by the backend
      setReferenceNumber(savedDonation.reference_number);
      setSubmittedDonation({
        ...donationData,
        referenceNumber: savedDonation.reference_number,
        formattedAmount: formatCurrency(parseFloat(amount)),
        status: savedDonation.status,
        createdAt: savedDonation.created_at,
      });
      
      setShowInstructions(true);
      
      setTimeout(() => {
        const instructionsSection = document.getElementById('donation-instructions');
        if (instructionsSection) {
          instructionsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      
    } catch (error) {
      setApiError(error.message || 'Failed to process donation. Please try again.');
      alert('Error: ' + (error.message || 'Failed to process donation'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentConfirmation = async () => {
    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }
    if (!transactionCode) {
      alert('Please enter your M-PESA transaction code (e.g., QRK7L9X2)');
      return;
    }
    if (!referenceNumber) {
      alert('Reference number is missing. Please refresh the page and try again.');
      return;
    }
    
    setPaymentConfirmed(true);
    
    try {
      await confirmPaymentAPI(referenceNumber, selectedPaymentMethod, transactionCode);
      alert('✅ Payment confirmed successfully! Thank you for your donation.');
      
      setSubmittedDonation(prev => ({
        ...prev,
        status: 'completed',
        paymentMethod: selectedPaymentMethod,
        transactionCode: transactionCode,
      }));
      
      setTransactionCode('');
      setSelectedPaymentMethod('');
      
    } catch (error) {
      alert('❌ Failed to confirm payment: ' + error.message);
    } finally {
      setPaymentConfirmed(false);
    }
  };

  const closeInstructions = () => {
    setShowInstructions(false);
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
        .instruction-card { animation: fadeInUp 0.5s ease forwards; }
        .copy-btn { transition: all 0.3s ease; }
        .copy-btn:hover { background: #F9C74F !important; color: #0B3B2F !important; }
        .reference-card { background: linear-gradient(135deg, #0B3B2F, #1a5c48); animation: fadeInUp 0.5s ease; }
        .stat-card { transition: all 0.3s ease; }
        .stat-card:hover { transform: translateY(-5px); background: rgba(11,59,47,0.03); }
      `}</style>

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
              <p style={{
                fontSize: '0.7rem',
                color: '#888',
                textAlign: 'center',
                marginTop: '1rem'
              }}>
                <i className="fas fa-cloud-upload-alt" style={{ marginRight: '0.3rem' }}></i>
                Your donation will be securely saved to our database
              </p>
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

        {/* Donation Instructions Section */}
        {showInstructions && submittedDonation && (
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

            {/* Reference Number Card - Generated by Backend */}
            <div className="reference-card" style={{
              borderRadius: '20px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              textAlign: 'center',
              color: 'white'
            }}>
              <p style={{ marginBottom: '0.5rem', opacity: 0.8 }}>Your Donation Reference Number</p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
                <code style={{
                  fontSize: '1.4rem',
                  fontWeight: 'bold',
                  background: 'rgba(255,255,255,0.2)',
                  padding: '0.5rem 1rem',
                  borderRadius: '12px',
                  letterSpacing: '1px'
                }}>
                  {referenceNumber}
                </code>
                <button
                  onClick={() => copyToClipboard(referenceNumber)}
                  className="copy-btn"
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#F9C74F',
                    cursor: 'pointer',
                    color: '#0B3B2F',
                    fontWeight: 600
                  }}
                >
                  <i className="fas fa-copy" style={{ marginRight: '0.3rem' }}></i>
                  {copied ? 'Copied!' : 'Copy Reference'}
                </button>
              </div>
              <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', opacity: 0.7 }}>
                Please use this reference number when making your payment
              </p>
            </div>

            {/* Donation Summary */}
            <div style={{
              background: 'rgba(249,199,79,0.1)',
              borderRadius: '16px',
              padding: '1rem',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              <p><strong style={{ color: '#0B3B2F' }}>Donation Summary:</strong></p>
              <p>
                <strong>Reference:</strong> {referenceNumber} | 
                <strong> Amount:</strong> {submittedDonation.formattedAmount} | 
                <strong> Type:</strong> {donationType === 'one-time' ? 'One-Time' : 'Monthly'} |
                <strong> Donor:</strong> {fullName}
              </p>
              <p style={{ fontSize: '0.8rem', color: '#666' }}>
                Status: <strong style={{ color: submittedDonation.status === 'completed' ? '#4caf50' : '#F9C74F' }}>
                  {submittedDonation.status === 'completed' ? 'Completed ✓' : 'Pending Payment'}
                </strong>
              </p>
            </div>

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
                  <p style={{ margin: 0, fontSize: '0.7rem', color: '#888' }}>Paybill / Send to:</p>
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
                  <li>Select "Send Money" or "Lipa na M-PESA"</li>
                  <li>Enter number: <strong>{mpesaNumber}</strong></li>
                  <li>Enter the donation amount: <strong>{submittedDonation.formattedAmount}</strong></li>
                  <li>Enter reference number: <strong>{referenceNumber}</strong></li>
                  <li>Enter your name: <strong>{fullName}</strong></li>
                  <li>Complete the transaction</li>
                  <li><strong style={{ color: '#0B3B2F' }}>M-PESA will send you a transaction code (e.g., QRK7L9X2)</strong></li>
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
                  <h3 style={{ color: '#0B3B2F', margin: 0 }}>Bank Transfer</h3>
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
                  <p style={{ fontWeight: 600, color: '#0B3B2F', margin: 0 }}>{referenceNumber}</p>
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
            {submittedDonation.status !== 'completed' && (
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
                <p style={{ fontSize: '0.85rem', color: '#666', textAlign: 'center', marginBottom: '1rem' }}>
                  After completing your payment via M-PESA or Bank Transfer, <strong style={{ color: '#0B3B2F' }}>enter the transaction code you received</strong> below to confirm.
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <select
                    value={selectedPaymentMethod}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '0.8rem',
                      borderRadius: '12px',
                      border: '1px solid #ddd',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  >
                    <option value="">Select payment method</option>
                    <option value="mpesa">M-PESA</option>
                    <option value="bank">Bank Transfer</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Enter M-PESA Transaction Code (e.g., QRK7L9X2)"
                    value={transactionCode}
                    onChange={(e) => setTransactionCode(e.target.value)}
                    style={{
                      flex: 2,
                      padding: '0.8rem',
                      borderRadius: '12px',
                      border: '1px solid #ddd',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                  <button
                    onClick={handlePaymentConfirmation}
                    disabled={paymentConfirmed}
                    style={{
                      padding: '0.8rem 1.5rem',
                      borderRadius: '50px',
                      border: 'none',
                      background: paymentConfirmed ? '#ccc' : '#0B3B2F',
                      color: 'white',
                      fontWeight: 600,
                      cursor: paymentConfirmed ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {paymentConfirmed ? (
                      <><i className="fas fa-spinner fa-spin"></i> Confirming...</>
                    ) : (
                      <><i className="fas fa-check"></i> Confirm Payment</>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Confirmation Instructions */}
            <div style={{
              background: 'rgba(76, 175, 80, 0.1)',
              borderRadius: '16px',
              padding: '1rem',
              textAlign: 'center',
              border: '1px solid #4caf50',
              marginBottom: '1rem'
            }}>
              <i className="fas fa-info-circle" style={{ color: '#4caf50', fontSize: '1.2rem', marginRight: '0.5rem' }}></i>
              <span style={{ fontSize: '0.85rem', color: '#555' }}>
                After making payment, <strong>enter the transaction code from M-PESA</strong> above. The code looks like: <strong style={{ color: '#0B3B2F' }}>QRK7L9X2</strong>
              </span>
            </div>

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
                  window.location.href = `mailto:donations@vuma.or.tz?subject=Donation Payment Confirmation - ${referenceNumber}&body=Dear VUMA Team,%0D%0A%0D%0AI have completed my donation payment.%0D%0A%0D%0AReference Number: ${referenceNumber}%0D%0AFull Name: ${fullName}%0D%0AAmount: ${submittedDonation.formattedAmount}%0D%0APayment Method: [M-PESA/Bank Transfer]%0D%0ATransaction Code: [Enter your M-PESA transaction code]%0D%0A%0D%0AThank you!`;
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

      {/* Testimonials */}
      <div style={{ background: '#f0f5ee', padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 data-aos="fade-up" style={{ color: '#0B3B2F', marginBottom: '2rem' }}>What Donors Say</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              { text: "I've seen firsthand how VUMA transforms communities around Lake Victoria. My donation is making a real difference.", author: "Sarah M.", location: "United States" },
              { text: "Supporting VUMA is the best investment I've made in Africa's environmental future. Their solar irrigation program is exceptional.", author: "James K.", location: "United Kingdom" },
              { text: "The M-PESA process was very easy. I just entered my transaction code and got confirmation instantly.", author: "Maria G.", location: "Germany" }
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