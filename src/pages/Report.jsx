import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, RadialLinearScale, PointElement, LineElement, Filler } from 'chart.js';
import { Pie, PolarArea, Bar } from 'react-chartjs-2';
// Import the logo
import vumaLogo from '../assets/vuma.png';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

const AnnualReport = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeSection, setActiveSection] = useState('overview');
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reportData, setReportData] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoBase64, setLogoBase64] = useState(null);
  const [allPartners, setAllPartners] = useState([]);
  const reportRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    fetchReportData();
    fetchAllPartners();
  }, [id]);

  // Load logo as base64 for PDF
  useEffect(() => {
    const loadLogo = async () => {
      try {
        const response = await fetch(vumaLogo);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoBase64(reader.result);
          setLogoLoaded(true);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Error loading logo:', error);
        setLogoLoaded(true);
      }
    };
    loadLogo();
  }, []);

  // Fetch all partners from the API
  const fetchAllPartners = async () => {
    try {
      const response = await fetch('https://vuma.pythonanywhere.com/api/partners/');
      const data = await response.json();
      if (data.success) {
        setAllPartners(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching partners:', error);
    }
  };

  const fetchReportData = async () => {
    setLoading(true);
    setError('');
    try {
      let url = 'https://vuma.pythonanywhere.com/api/annual-reports/';
      
      if (id) {
        url = `https://vuma.pythonanywhere.com/api/annual-reports/${id}/`;
      } else {
        url = 'https://vuma.pythonanywhere.com/api/annual-reports/latest/';
      }

      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        const transformedData = transformReportData(data.data);
        setReportData(transformedData);
        // Auto-generate PDF after data loads and logo is ready
        setTimeout(() => {
          if (logoLoaded) {
            generatePDF();
          }
        }, 2000);
      } else {
        setError(data.message || 'Failed to load report');
      }
    } catch (error) {
      console.error('Error fetching report:', error);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const transformReportData = (apiData) => {
    const impactMetrics = {};
    if (apiData.impact_metrics && apiData.impact_metrics.length > 0) {
      apiData.impact_metrics.forEach((metric, index) => {
        const key = `metric_${index}`;
        impactMetrics[key] = {
          value: metric.value || '0',
          label: metric.label || 'Metric'
        };
      });
    } else {
      impactMetrics['no_data'] = { value: '0', label: 'No data available' };
    }

    const programs = apiData.programs && apiData.programs.length > 0 
      ? apiData.programs.map((program, index) => ({
          id: program.id || index + 1,
          title: program.title || 'Program',
          objective: program.objective || 'Program objective',
          activities: program.activities 
            ? program.activities.map(a => a.description) 
            : ['Activity details not available'],
          impact: program.impacts 
            ? program.impacts.map(i => i.description) 
            : ['Impact details not available'],
          color: program.color || `hsl(${index * 120}, 70%, 45%)`,
          icon: program.icon || 'fa-circle'
        }))
      : [];

    const stories = apiData.stories && apiData.stories.length > 0
      ? apiData.stories.map((story) => ({
          id: story.id,
          name: story.name || 'Anonymous',
          age: story.age || null,
          title: story.title || 'Story of Impact',
          challenge: story.challenge || 'No challenge details available',
          solution: story.solution || 'No solution details available',
          outcome: story.outcome || 'No outcome details available',
          quote: story.quote || 'No quote available',
          image: story.image || null
        }))
      : [];

    const incomes = apiData.incomes || [];
    const expenditures = apiData.expenditures || [];
    
    const totalIncome = incomes.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
    const totalExpenditure = expenditures.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

    const incomeBreakdown = incomes.map(item => ({
      source: item.source || 'Unknown',
      amount: parseFloat(item.amount || 0),
      percentage: parseFloat(item.percentage || 0)
    }));

    const expenditureBreakdown = expenditures.map(item => ({
      category: item.category || 'Unknown',
      amount: parseFloat(item.amount || 0),
      percentage: parseFloat(item.percentage || 0)
    }));

    // Get partners from the report's partners relation
    const reportPartners = apiData.partners && apiData.partners.length > 0
      ? apiData.partners.map(partner => ({
          name: partner.name || 'Partner',
          logo: partner.logo || null,
          id: partner.id
        }))
      : [];

    const boardMembers = apiData.board_members && apiData.board_members.length > 0
      ? apiData.board_members.map(member => ({
          name: member.name || 'Board Member',
          role: member.role || 'Member',
          bio: member.bio || 'No bio available'
        }))
      : [];

    return {
      year: apiData.report_year || new Date().getFullYear(),
      organization: apiData.organization_name || 'Organization',
      tagline: apiData.tagline || 'Annual Report',
      impactMetrics: impactMetrics,
      programs: programs,
      stories: stories,
      financials: {
        totalIncome: totalIncome,
        incomeBreakdown: incomeBreakdown,
        totalExpenditure: totalExpenditure,
        expenditureBreakdown: expenditureBreakdown
      },
      partners: reportPartners,
      boardMembers: boardMembers,
      executiveMessage: {
        name: apiData.executive_name || 'Executive Director',
        title: apiData.executive_title || 'Executive Director',
        message: apiData.executive_message || 'No executive message available.'
      }
    };
  };

  const generatePDF = async () => {
    if (!reportData) return;
    
    setIsDownloading(true);
    try {
      const input = contentRef.current;
      if (!input) {
        console.error('Content ref not found');
        setIsDownloading(false);
        return;
      }

      // Wait for logo to load
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create a clone of the content for PDF generation
      const clone = input.cloneNode(true);
      clone.style.transform = 'scale(1)';
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      clone.style.width = '1200px';
      clone.style.background = '#ffffff';
      document.body.appendChild(clone);

      // Ensure images in clone are loaded
      const images = clone.querySelectorAll('img');
      for (const img of images) {
        img.crossOrigin = 'anonymous';
        if (img.alt && img.alt.includes('Logo') && logoBase64) {
          img.src = logoBase64;
        }
        await new Promise(resolve => {
          if (img.complete) {
            resolve();
          } else {
            img.onload = resolve;
            img.onerror = resolve;
          }
        });
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        logging: false,
        width: 1200,
        height: clone.scrollHeight,
        windowHeight: clone.scrollHeight,
        allowTaint: true,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          const imgs = clonedDoc.querySelectorAll('img');
          imgs.forEach(img => {
            img.crossOrigin = 'anonymous';
          });
        }
      });

      document.body.removeChild(clone);

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4',
        hotfixes: ['px_scaling']
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdfHeight;
      }

      const fileName = `${reportData.organization}_Annual_Report_${reportData.year}.pdf`;
      pdf.save(fileName);
      
      setSuccessMessage('PDF downloaded successfully!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    generatePDF();
  };

  // Format currency in TSh
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('sw-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const renderMetricCard = (key, metric) => {
    const icons = {
      beneficiaries: 'fa-users',
      communities: 'fa-map-marker-alt',
      children: 'fa-child',
      women: 'fa-female',
      water: 'fa-tint',
      volunteers: 'fa-hands-helping'
    };

    const iconKey = icons[key] ? key : 'beneficiaries';

    return (
      <div 
        key={key}
        data-aos="fade-up" 
        data-aos-delay={100}
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '1.5rem',
          textAlign: 'center',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
          border: '1px solid #f0f0f0',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
        }}
      >
        <div style={{
          width: '60px',
          height: '60px',
          margin: '0 auto 1rem',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <i className={`fas ${icons[iconKey] || 'fa-star'}`} style={{ fontSize: '1.5rem', color: 'white' }}></i>
        </div>
        <h3 style={{ fontSize: '2rem', fontWeight: 700, color: '#0B3B2F', marginBottom: '0.25rem' }}>
          {metric.value}
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#666', margin: 0 }}>{metric.label}</p>
      </div>
    );
  };

  const renderProgramCard = (program) => {
    return (
      <div 
        key={program.id}
        data-aos="fade-up"
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
          borderTop: `4px solid ${program.color}`,
          transition: 'all 0.3s ease',
          height: '100%'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: `${program.color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <i className={`fas ${program.icon}`} style={{ fontSize: '1.25rem', color: program.color }}></i>
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0B3B2F', margin: 0 }}>{program.title}</h3>
        </div>

        <p style={{ fontSize: '0.9rem', color: '#555', lineHeight: '1.6', marginBottom: '1rem' }}>
          {program.objective}
        </p>

        <div style={{ marginBottom: '1rem' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0B3B2F', marginBottom: '0.5rem' }}>
            <i className="fas fa-check-circle" style={{ color: program.color, marginRight: '0.5rem' }}></i>
            Activities
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {program.activities.map((activity, idx) => (
              <li key={idx} style={{
                fontSize: '0.85rem',
                color: '#555',
                padding: '0.25rem 0',
                paddingLeft: '1.5rem',
                position: 'relative'
              }}>
                <span style={{
                  position: 'absolute',
                  left: 0,
                  color: program.color
                }}>•</span>
                {activity}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0B3B2F', marginBottom: '0.5rem' }}>
            <i className="fas fa-chart-line" style={{ color: program.color, marginRight: '0.5rem' }}></i>
            Impact
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {program.impact.map((item, idx) => (
              <li key={idx} style={{
                fontSize: '0.85rem',
                color: '#555',
                padding: '0.25rem 0',
                paddingLeft: '1.5rem',
                position: 'relative'
              }}>
                <span style={{
                  position: 'absolute',
                  left: 0,
                  color: program.color
                }}>✦</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const renderStoryCard = (story) => {
    return (
      <div 
        key={story.id}
        data-aos="fade-up"
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
          border: '1px solid #f0f0f0',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
        }}
      >
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 1rem',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #F9C74F, #F8961E)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <i className="fas fa-user" style={{ fontSize: '2rem', color: 'white' }}></i>
        </div>
        
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0B3B2F', textAlign: 'center', marginBottom: '0.25rem' }}>
          {story.title}
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#666', textAlign: 'center', marginBottom: '1rem' }}>
          {story.name}{story.age ? `, ${story.age} years old` : ''}
        </p>

        <div style={{ marginBottom: '0.75rem' }}>
          <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: '#d32f2f', marginBottom: '0.25rem' }}>
            <i className="fas fa-exclamation-circle" style={{ marginRight: '0.5rem' }}></i>
            Challenge
          </h4>
          <p style={{ fontSize: '0.85rem', color: '#555', lineHeight: '1.5', margin: 0 }}>{story.challenge}</p>
        </div>

        <div style={{ marginBottom: '0.75rem' }}>
          <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: '#2196F3', marginBottom: '0.25rem' }}>
            <i className="fas fa-lightbulb" style={{ marginRight: '0.5rem' }}></i>
            Solution
          </h4>
          <p style={{ fontSize: '0.85rem', color: '#555', lineHeight: '1.5', margin: 0 }}>{story.solution}</p>
        </div>

        <div style={{ marginBottom: '0.75rem' }}>
          <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4caf50', marginBottom: '0.25rem' }}>
            <i className="fas fa-heart" style={{ marginRight: '0.5rem' }}></i>
            Outcome
          </h4>
          <p style={{ fontSize: '0.85rem', color: '#555', lineHeight: '1.5', margin: 0 }}>{story.outcome}</p>
        </div>

        <div style={{
          background: '#f8fafc',
          padding: '0.75rem',
          borderRadius: '12px',
          borderLeft: `4px solid #F9C74F`,
          marginTop: '0.5rem'
        }}>
          <i className="fas fa-quote-left" style={{ color: '#F9C74F', fontSize: '0.8rem', marginRight: '0.5rem' }}></i>
          <span style={{ fontStyle: 'italic', fontSize: '0.85rem', color: '#333' }}>{story.quote}</span>
        </div>
      </div>
    );
  };

  // Income Chart - Bar Chart (Histogram)
  const renderIncomeBarChart = () => {
    const incomeBreakdown = reportData.financials.incomeBreakdown;
    
    if (incomeBreakdown.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
          <p>No income data available</p>
        </div>
      );
    }

    const data = {
      labels: incomeBreakdown.map(item => item.source),
      datasets: [
        {
          label: 'Income (TSh)',
          data: incomeBreakdown.map(item => item.amount),
          backgroundColor: [
            'rgba(76, 175, 80, 0.7)',
            'rgba(33, 150, 243, 0.7)',
            'rgba(255, 152, 0, 0.7)',
            'rgba(156, 39, 176, 0.7)',
            'rgba(233, 30, 99, 0.7)',
            'rgba(0, 188, 212, 0.7)'
          ],
          borderColor: [
            '#4caf50',
            '#2196F3',
            '#FF9800',
            '#9C27B0',
            '#E91E63',
            '#00BCD4'
          ],
          borderWidth: 2,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'Income Breakdown (Histogram)',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return formatCurrency(value);
            },
          },
        },
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 0,
          },
        },
      },
    };

    return (
      <div style={{ height: '300px' }}>
        <Bar data={data} options={options} />
      </div>
    );
  };

  // Expenditure Chart - Polar Area Chart
  const renderExpenditurePolarChart = () => {
    const expenditureBreakdown = reportData.financials.expenditureBreakdown;
    
    if (expenditureBreakdown.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
          <p>No expenditure data available</p>
        </div>
      );
    }

    const data = {
      labels: expenditureBreakdown.map(item => item.category),
      datasets: [
        {
          label: 'Expenditure (TSh)',
          data: expenditureBreakdown.map(item => item.amount),
          backgroundColor: [
            'rgba(76, 175, 80, 0.8)',
            'rgba(33, 150, 243, 0.8)',
            'rgba(255, 152, 0, 0.8)',
            'rgba(156, 39, 176, 0.8)',
            'rgba(233, 30, 99, 0.8)'
          ],
          borderColor: [
            '#4caf50',
            '#2196F3',
            '#FF9800',
            '#9C27B0',
            '#E91E63'
          ],
          borderWidth: 2,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: {
              size: 12,
            },
          },
        },
        title: {
          display: true,
          text: 'Expenditure Breakdown (Polar Chart)',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
    };

    return (
      <div style={{ height: '300px' }}>
        <PolarArea data={data} options={options} />
      </div>
    );
  };

  // Income vs Expenditure - Pie Chart
  const renderIncomeExpenditurePieChart = () => {
    const totalIncome = reportData.financials.totalIncome;
    const totalExpenditure = reportData.financials.totalExpenditure;

    if (totalIncome === 0 && totalExpenditure === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
          <p>No financial data available</p>
        </div>
      );
    }

    const data = {
      labels: ['Total Income', 'Total Expenditure'],
      datasets: [
        {
          data: [totalIncome, totalExpenditure],
          backgroundColor: [
            'rgba(76, 175, 80, 0.8)',
            'rgba(244, 67, 54, 0.8)',
          ],
          borderColor: [
            '#4caf50',
            '#f44336',
          ],
          borderWidth: 2,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: {
              size: 14,
            },
          },
        },
        title: {
          display: true,
          text: 'Income vs Expenditure Overview',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.label || '';
              let value = context.parsed || 0;
              let percentage = (value / context.dataset.data.reduce((a, b) => a + b, 0) * 100).toFixed(1);
              return `${label}: ${formatCurrency(value)} (${percentage}%)`;
            },
          },
        },
      },
    };

    return (
      <div style={{ height: '300px' }}>
        <Pie data={data} options={options} />
      </div>
    );
  };

  // Loading State
  if (loading) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '3px solid #F9C74F',
            borderTopColor: '#0B3B2F',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ marginTop: '1rem', color: '#666' }}>Loading annual report...</p>
          <p style={{ fontSize: '0.8rem', color: '#999' }}>Preparing PDF for download...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !reportData) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '3rem', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
            <i className="fas fa-exclamation-circle" style={{ fontSize: '4rem', color: '#d32f2f', marginBottom: '1rem' }}></i>
            <h2>Report Not Found</h2>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>{error || 'The annual report you are looking for does not exist.'}</p>
            <button 
              onClick={() => navigate('/')}
              style={{
                padding: '0.75rem 2rem',
                background: '#0B3B2F',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 500,
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#1a5c48';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#0B3B2F';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <i className="fas fa-arrow-left" style={{ marginRight: '0.5rem' }}></i>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter partners that are active and have logos
  const displayPartners = allPartners.filter(p => p.status === 'active' && p.logo_base64);

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }} ref={reportRef}>
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
              background: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              animation: 'scaleIn 0.5s ease'
            }}>
              <i className="fas fa-check" style={{ fontSize: '2.5rem', color: 'white' }}></i>
            </div>
            <h3 style={{ color: '#0B3B2F', marginBottom: '0.5rem' }}>Success!</h3>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>{successMessage}</p>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '0.75rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <i 
            className="fas fa-arrow-left" 
            style={{ cursor: 'pointer', fontSize: '1.2rem', color: '#0B3B2F' }}
            onClick={() => navigate('/')}
          ></i>
          <h1 style={{ fontSize: '1rem', fontWeight: 600, color: '#0B3B2F', margin: 0 }}>
            {reportData.organization} - Annual Report {reportData.year}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handlePrint}
            style={{
              background: '#0B3B2F',
              color: 'white',
              border: 'none',
              padding: '0.4rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.813rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1a5c48';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#0B3B2F';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <i className="fas fa-print"></i>
            Print
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            style={{
              background: isDownloading ? '#94a3b8' : '#F9C74F',
              color: '#0B3B2F',
              border: 'none',
              padding: '0.4rem 1rem',
              borderRadius: '8px',
              cursor: isDownloading ? 'not-allowed' : 'pointer',
              fontSize: '0.813rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (!isDownloading) {
                e.currentTarget.style.background = '#f8961e';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isDownloading) {
                e.currentTarget.style.background = '#F9C74F';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {isDownloading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Generating...
              </>
            ) : (
              <>
                <i className="fas fa-file-pdf"></i>
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div ref={contentRef} style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        
        {/* Cover Section */}
        <section data-aos="fade-up" style={{
          background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)',
          borderRadius: '16px',
          padding: '1.5rem 2rem',
          color: 'white',
          textAlign: 'center',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '-30%', right: '-10%', width: '30%', height: '150%', background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }}></div>
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              padding: '8px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}>
              <img 
                src={vumaLogo} 
                alt={`${reportData.organization} Logo`}
                crossOrigin="anonymous"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  borderRadius: '50%'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  const parent = e.target.parentNode;
                  const fallbackDiv = document.createElement('div');
                  fallbackDiv.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#F9C74F;border-radius:50%;';
                  const icon = document.createElement('i');
                  icon.className = 'fas fa-handshake';
                  icon.style.fontSize = '2rem';
                  icon.style.color = '#0B3B2F';
                  fallbackDiv.appendChild(icon);
                  parent.appendChild(fallbackDiv);
                }}
              />
            </div>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.1rem' }}>
                {reportData.organization}
              </h1>
              <p style={{ fontSize: '1rem', color: '#F9C74F', marginBottom: '0.1rem' }}>
                {reportData.tagline}
              </p>
              <div style={{
                display: 'inline-block',
                background: 'rgba(255,255,255,0.12)',
                padding: '0.25rem 1.5rem',
                borderRadius: '50px',
                marginTop: '0.2rem'
              }}>
                <span style={{ fontSize: '0.9rem' }}>
                  <i className="fas fa-calendar-alt" style={{ marginRight: '0.5rem' }}></i>
                  Annual Report {reportData.year}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Navigation */}
        <section style={{
          background: 'white',
          borderRadius: '16px',
          padding: '1rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          {[
            { id: 'message', label: "Executive Message", icon: 'fa-envelope' },
            { id: 'impact', label: 'Our Impact', icon: 'fa-chart-bar' },
            { id: 'programs', label: 'Programs', icon: 'fa-project-diagram' },
            { id: 'stories', label: 'Stories', icon: 'fa-book-open' },
            { id: 'financials', label: 'Financials', icon: 'fa-coins' },
            { id: 'partners', label: 'Partners', icon: 'fa-handshake' }
          ].map(item => (
            <a
              key={item.id}
              href={`#${item.id}`}
              style={{
                padding: '0.4rem 1rem',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#0B3B2F',
                fontSize: '0.8rem',
                fontWeight: 500,
                transition: 'all 0.3s ease',
                background: '#f8fafc'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#0B3B2F';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.color = '#0B3B2F';
              }}
            >
              <i className={`fas ${item.icon}`} style={{ marginRight: '0.5rem' }}></i>
              {item.label}
            </a>
          ))}
        </section>

        {/* Executive Message */}
        <section id="message" data-aos="fade-up" style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="fas fa-user-circle" style={{ fontSize: '1.8rem', color: 'white' }}></i>
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#0B3B2F', margin: 0 }}>
                Executive Message
              </h2>
              <p style={{ color: '#666', margin: 0, fontSize: '0.9rem' }}>
                From {reportData.executiveMessage.name}, {reportData.executiveMessage.title}
              </p>
            </div>
          </div>
          <div style={{
            whiteSpace: 'pre-line',
            lineHeight: '1.8',
            color: '#444',
            fontSize: '0.95rem'
          }}>
            {reportData.executiveMessage.message}
          </div>
          <div style={{
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '2px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '0.85rem', color: '#666' }}>
              <i className="fas fa-calendar-check" style={{ marginRight: '0.5rem' }}></i>
              {reportData.year}
            </span>
            <span style={{ fontSize: '0.85rem', color: '#666' }}>
              <i className="fas fa-signature" style={{ marginRight: '0.5rem' }}></i>
              {reportData.executiveMessage.name}
            </span>
          </div>
        </section>



        {/* Partners Section */}
        <section id="partners" data-aos="fade-up" style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: 700,
            color: '#0B3B2F',
            textAlign: 'center',
            marginBottom: '0.5rem'
          }}>
            Our Partners
          </h2>
          <p style={{
            textAlign: 'center',
            color: '#666',
            marginBottom: '1.5rem',
            fontSize: '0.95rem'
          }}>
            Working together for lasting change
          </p>
          {displayPartners.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
              <p>No active partners with logos available</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem'
            }}>
              {displayPartners.map((partner, idx) => (
                <div
                  key={partner.id || idx}
                  style={{
                    padding: '1rem',
                    textAlign: 'center',
                    borderRadius: '12px',
                    background: '#f8fafc',
                    border: '1px solid #f0f0f0',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100px'
                  }}
                >
                  {partner.logo_base64 ? (
                    <img 
                      src={partner.logo_base64} 
                      alt={partner.name}
                      style={{ 
                        maxWidth: '100px', 
                        maxHeight: '60px', 
                        objectFit: 'contain',
                        marginBottom: '0.5rem'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: '#0B3B2F',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '0.5rem'
                    }}>
                      <i className="fas fa-handshake" style={{ fontSize: '1.3rem', color: 'white' }}></i>
                    </div>
                  )}
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0B3B2F', margin: 0 }}>
                    {partner.name}
                  </h4>
                </div>
              ))}
            </div>
          )}
        </section>

       
        {/* Footer */}
        <footer style={{
          textAlign: 'center',
          padding: '1.5rem 0',
          borderTop: '1px solid #e2e8f0',
          color: '#666',
          fontSize: '0.8rem'
        }}>
          <div style={{ marginBottom: '0.3rem' }}>
            <i className="fas fa-handshake" style={{ color: '#0B3B2F', fontSize: '1.2rem', display: 'block', marginBottom: '0.3rem' }}></i>
            <strong>{reportData.organization}</strong> - Annual Report {reportData.year}
          </div>
          <p>
            © {reportData.year} {reportData.organization}. All rights reserved.
          </p>
          <p style={{ fontSize: '0.7rem', marginTop: '0.2rem' }}>
            <i className="fas fa-map-marker-alt" style={{ marginRight: '0.25rem' }}></i>
            Mwanza, Tanzania &bull;
            <i className="fas fa-envelope" style={{ marginLeft: '0.5rem', marginRight: '0.25rem' }}></i>
            info@vumafoundation.org &bull;
            <i className="fas fa-phone" style={{ marginLeft: '0.5rem', marginRight: '0.25rem' }}></i>
            +255 759 913 433
          </p>
        </footer>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        
        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
        
        @media print {
          body * {
            visibility: hidden;
          }
          #report-content, #report-content * {
            visibility: visible;
          }
          #report-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
        
        @media (max-width: 768px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
          h1 { font-size: 1.5rem !important; }
          h2 { font-size: 1.3rem !important; }
        }
      `}</style>
    </div>
  );
};

export default AnnualReport;