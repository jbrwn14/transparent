// script.js

// Global variables
let selectedTrade = null;
let selectedRoom = null;

const baseCosts = {
    electrical: 8500,
    plumbing: 12200,
    hvac: 15600,
    flooring: 9800,
    lighting: 6400,
    painting: 4200
};

const tradeColors = {
    electrical: '#3498db',
    plumbing: '#2ecc71',
    hvac: '#e74c3c',
    flooring: '#f39c12',
    lighting: '#9b59b6',
    painting: '#1abc9c'
};

const roomTrades = {
    kitchen: ['electrical', 'plumbing', 'lighting'],
    living: ['electrical', 'flooring', 'painting'],
    bathroom: ['plumbing', 'hvac', 'lighting'],
    bedroom: ['flooring', 'painting', 'lighting']
};

// Navigation functions
function scrollToDemo() {
    document.getElementById('demo').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

function scheduleDemo() {
    alert('Demo scheduling would open calendar booking system.\n\nIn the full application, this would:\n• Open Calendly or similar booking system\n• Send confirmation emails\n• Set up video call with sales team\n• Prepare personalized demo materials');
}

function startTrial() {
    alert('Free trial signup would redirect to registration.\n\nIn the full application, this would:\n• Redirect to signup form\n• Create trial account\n• Send welcome email with getting started guide\n• Provide immediate access to limited features');
}

// Demo functionality
function selectTrade(trade) {
    // Remove active class from all buttons
    document.querySelectorAll('.trade-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to selected button
    const selectedButton = document.querySelector(`.trade-button.${trade}`);
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
    
    selectedTrade = trade;
    highlightTradeInRooms(trade);
    updateCostHighlight(trade);
}

function highlightTradeInRooms(trade) {
    const rooms = document.querySelectorAll('.room');
    
    rooms.forEach(room => {
        // Reset room styling
        room.style.border = '3px solid';
        room.style.transform = 'scale(1)';
        room.style.zIndex = '1';
        room.style.boxShadow = 'none';
        room.style.opacity = '1';
        
        // Get room type from class
        const roomType = Array.from(room.classList).find(cls => cls !== 'room');
        
        // Check if this room contains the selected trade
        if (roomContainsTrade(roomType, trade)) {
            room.style.border = `5px solid ${tradeColors[trade]}`;
            room.style.transform = 'scale(1.05)';
            room.style.zIndex = '10';
            room.style.boxShadow = `0 0 20px ${tradeColors[trade]}40`;
        } else {
            room.style.opacity = '0.6';
        }
    });
}

function roomContainsTrade(roomType, trade) {
    return roomTrades[roomType] && roomTrades[roomType].includes(trade);
}

function updateCostHighlight(trade) {
    // Reset all cost item highlights
    document.querySelectorAll('.cost-item').forEach(item => {
        item.style.background = 'transparent';
        item.style.transform = 'scale(1)';
    });
    
    // Highlight selected trade cost
    const costItems = document.querySelectorAll('.cost-item');
    costItems.forEach(item => {
        const label = item.querySelector('.cost-label');
        if (label && label.textContent.toLowerCase().includes(trade)) {
            item.style.background = `${tradeColors[trade]}10`;
            item.style.transform = 'scale(1.02)';
            item.style.transition = 'all 0.3s ease';
        }
    });
}

function selectRoom(room) {
    selectedRoom = room;
    
    // Reset all rooms
    const rooms = document.querySelectorAll('.room');
    rooms.forEach(r => {
        r.style.opacity = '0.6';
        r.style.transform = 'scale(1)';
        r.style.zIndex = '1';
    });
    
    // Highlight selected room
    const selectedRoomEl = document.querySelector(`.room.${room}`);
    if (selectedRoomEl) {
        selectedRoomEl.style.opacity = '1';
        selectedRoomEl.style.transform = 'scale(1.1)';
        selectedRoomEl.style.zIndex = '10';
        selectedRoomEl.style.boxShadow = '0 0 25px rgba(52, 152, 219, 0.5)';
    }
    
    // Show room-specific information
    showRoomInfo(room);
}

function showRoomInfo(room) {
    const roomInfo = {
        kitchen: {
            description: 'Kitchen renovation including electrical outlets, plumbing fixtures, and LED lighting',
            trades: roomTrades.kitchen,
            totalCost: 14100
        },
        living: {
            description: 'Living room upgrade with new flooring, paint, and electrical improvements',
            trades: roomTrades.living,
            totalCost: 7800
        },
        bathroom: {
            description: 'Complete bathroom remodel with new plumbing, HVAC, and lighting',
            trades: roomTrades.bathroom,
            totalCost: 10500
        },
        bedroom: {
            description: 'Bedroom renovation with flooring, paint, and accent lighting',
            trades: roomTrades.bedroom,
            totalCost: 5400
        }
    };
    
    const info = roomInfo[room];
    if (info) {
        // You could add a room info panel here
        console.log(`Selected ${room}: ${info.description}`);
        console.log(`Trades involved: ${info.trades.join(', ')}`);
        console.log(`Estimated cost: $${info.totalCost.toLocaleString()}`);
    }
}

function updateCosts() {
    const laborRate = parseFloat(document.getElementById('laborRate')?.value) || 85;
    const markupPercent = parseFloat(document.getElementById('markupPercent')?.value) || 25;
    const projectType = document.getElementById('projectType')?.value || 'luxury';
    
    // Adjust base costs based on project type
    let multiplier = 1;
    switch(projectType) {
        case 'luxury': 
            multiplier = 1.3; 
            break;
        case 'standard': 
            multiplier = 1; 
            break;
        case 'commercial': 
            multiplier = 1.5; 
            break;
    }
    
    let totalCost = 0;
    
    Object.keys(baseCosts).forEach(trade => {
        const baseCost = baseCosts[trade] * multiplier;
        const laborCost = baseCost * 0.4; // Assume 40% is labor
        const materialCost = baseCost * 0.6; // Assume 60% is materials
        
        // Adjust labor cost based on rate (base rate is $65/hr)
        const adjustedLaborCost = (laborCost / 65) * laborRate;
        const finalCost = (materialCost + adjustedLaborCost) * (1 + markupPercent / 100);
        
        const costElement = document.getElementById(`${trade}Cost`);
        if (costElement) {
            costElement.textContent = `$${Math.round(finalCost).toLocaleString()}`;
        }
        
        totalCost += finalCost;
    });
    
    const totalElement = document.getElementById('totalCost');
    if (totalElement) {
        totalElement.textContent = `$${Math.round(totalCost).toLocaleString()}`;
    }
}

function generateQuote() {
    const customerName = document.getElementById('customerName')?.value || 'Valued Customer';
    const projectAddress = document.getElementById('projectAddress')?.value || 'Project Address';
    const projectDate = document.getElementById('projectDate')?.value || 'TBD';
    const totalCost = document.getElementById('totalCost')?.textContent || '$0';
    
    // Simulate quote generation
    const quoteData = {
        customer: customerName,
        address: projectAddress,
        startDate: projectDate,
        totalCost: totalCost,
        trades: Object.keys(baseCosts).map(trade => {
            const costElement = document.getElementById(`${trade}Cost`);
            return {
                name: trade.charAt(0).toUpperCase() + trade.slice(1),
                cost: costElement ? costElement.textContent : '$0'
            };
        })
    };
    
    // In a real application, this would generate a PDF
    alert(`Professional Quote Generated!\n\n` +
          `Customer: ${quoteData.customer}\n` +
          `Project: ${quoteData.address}\n` +
          `Start Date: ${quoteData.startDate}\n` +
          `Total Cost: ${quoteData.totalCost}\n\n` +
          `Quote includes detailed 3D visualizations, material specifications, ` +
          `timeline, and warranty information.\n\n` +
          `In the full application, this would generate a professionally ` +
          `formatted PDF with your company branding.`);
}

function presentToCustomer() {
    const customerName = document.getElementById('customerName')?.value || 'Customer';
    
    if (confirm(`Switch to Customer Presentation Mode?\n\n` +
                `This will display a clean, professional interface optimized for customer viewing:\n\n` +
                `• Interactive 3D visualization\n` +
                `• Clear cost breakdowns\n` +
                `• Professional branding\n` +
                `• Touch-friendly controls\n` +
                `• Digital signature capture\n\n` +
                `Present to ${customerName}?`)) {
        
        // Simulate presentation mode
        document.body.style.transform = 'scale(1.02)';
        document.body.style.transition = 'transform 0.5s ease';
        
        setTimeout(() => {
            document.body.style.transform = 'scale(1)';
            alert(`Customer Presentation Mode Activated!\n\n` +
                  `In the full application, this would:\n\n` +
                  `• Hide contractor-specific controls and pricing\n` +
                  `• Show professional company branding\n` +
                  `• Enable touch-friendly interaction for tablets\n` +
                  `• Provide financing options and calculators\n` +
                  `• Allow digital signature capture\n` +
                  `• Generate customer-facing proposals\n` +
                  `• Send follow-up emails automatically`);
        }, 500);
    }
}

function resetVisualization() {
    selectedTrade = null;
    selectedRoom = null;
    
    // Reset all rooms
    const rooms = document.querySelectorAll('.room');
    rooms.forEach(room => {
        room.style.opacity = '1';
        room.style.transform = 'scale(1)';
        room.style.border = '3px solid';
        room.style.boxShadow = 'none';
        room.style.zIndex = '1';
    });
    
    // Reset trade buttons
    document.querySelectorAll('.trade-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Reset cost highlights
    document.querySelectorAll('.cost-item').forEach(item => {
        item.style.background = 'transparent';
        item.style.transform = 'scale(1)';
    });
    
    // Reset cost colors
    Object.keys(baseCosts).forEach(trade => {
        const element = document.getElementById(`${trade}Cost`);
        if (element) {
            element.style.color = '#2c3e50';
            element.style.fontWeight = 'bold';
        }
    });
    
    updateCosts();
}

// Animation and interaction effects
function addInteractionEffects() {
    // Add hover effects to rooms
    const rooms = document.querySelectorAll('.room');
    rooms.forEach(room => {
        room.addEventListener('mouseenter', function() {
            if (!selectedTrade && !selectedRoom) {
                this.style.boxShadow = '0 0 15px rgba(0,0,0,0.3)';
                this.style.transform = 'scale(1.02)';
            }
        });
        
        room.addEventListener('mouseleave', function() {
            if (!selectedTrade && !selectedRoom) {
                this.style.boxShadow = 'none';
                this.style.transform = 'scale(1)';
            }
        });
    });
    
    // Add smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Form validation
function validateForm() {
    const customerName = document.getElementById('customerName')?.value;
    const projectAddress = document.getElementById('projectAddress')?.value;
    
    if (!customerName || !projectAddress) {
        alert('Please enter customer name and project address before generating a quote.');
        return false;
    }
    
    return true;
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('QuoteVision Pro initialized');
    
    // Set default date to next month
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const dateInput = document.getElementById('projectDate');
    if (dateInput) {
        dateInput.value = nextMonth.toISOString().split('T')[0];
    }
    
    // Initialize costs
    updateCosts();
    
    // Add interaction effects
    addInteractionEffects();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case 'Escape':
                resetVisualization();
                break;
            case '1':
                if (e.ctrlKey) selectTrade('electrical');
                break;
            case '2':
                if (e.ctrlKey) selectTrade('plumbing');
                break;
            case '3':
                if (e.ctrlKey) selectTrade('hvac');
                break;
            case '4':
                if (e.ctrlKey) selectTrade('flooring');
                break;
            case '5':
                if (e.ctrlKey) selectTrade('lighting');
                break;
            case '6':
                if (e.ctrlKey) selectTrade('painting');
                break;
        }
    });
    
    // Add form event listeners
    const inputs = ['laborRate', 'markupPercent', 'projectType'];
    inputs.forEach(inputId => {
        const element = document.getElementById(inputId);
        if (element) {
            element.addEventListener('change', updateCosts);
            element.addEventListener('input', updateCosts);
        }
    });
});

// Performance optimization - debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced update costs for better performance
const debouncedUpdateCosts = debounce(updateCosts, 300);

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        selectTrade,
        selectRoom,
        updateCosts,
        generateQuote,
        presentToCustomer,
        resetVisualization
    };
}
