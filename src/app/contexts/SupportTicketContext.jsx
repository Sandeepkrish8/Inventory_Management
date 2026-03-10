import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the shape of our context
const SupportTicketContext = createContext(undefined);

export const useSupportTickets = () => {
  const context = useContext(SupportTicketContext);
  if (!context) {
    throw new Error('useSupportTickets must be used within a SupportTicketProvider');
  }
  return context;
};

// Initial mock tickets for demo purposes
const MOCK_TICKETS = [
  {
    id: 'TKT-1001',
    subject: 'Cannot access supplier invoice',
    description: 'When I try to download the invoice for supplier ABC, I get a 404 error.',
    userEmail: 'staff@example.com',
    userName: 'Staff User',
    status: 'Open', // 'Open', 'In Progress', 'Resolved', 'Closed'
    priority: 'High', // 'Low', 'Medium', 'High', 'Critical'
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'TKT-1002',
    subject: 'Dashboard loading slowly',
    description: 'The analytics dashboard takes more than 10 seconds to load data today.',
    userEmail: 'viewer@example.com',
    userName: 'Viewer User',
    status: 'In Progress',
    priority: 'Medium',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  }
];

export const SupportTicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);

  // Load tickets on mount
  useEffect(() => {
    const loadTickets = () => {
      try {
        const savedTickets = localStorage.getItem('support_tickets');
        if (savedTickets) {
          setTickets(JSON.parse(savedTickets));
        } else {
          // Initialize with mock data if Empty
          setTickets(MOCK_TICKETS);
          localStorage.setItem('support_tickets', JSON.stringify(MOCK_TICKETS));
        }
      } catch (error) {
        console.error('Failed to load tickets', error);
        setTickets(MOCK_TICKETS);
      }
    };
    loadTickets();
  }, []);

  // Save tickets to local storage whenever they change
  useEffect(() => {
    if (tickets.length > 0) {
      localStorage.setItem('support_tickets', JSON.stringify(tickets));
    }
  }, [tickets]);

  const addTicket = (ticketData) => {
    const newTicket = {
      ...ticketData,
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setTickets(prev => [newTicket, ...prev]);
    return newTicket.id;
  };

  const updateTicketStatus = (id, newStatus) => {
    setTickets(prev => 
      prev.map(ticket => 
        ticket.id === id 
          ? { ...ticket, status: newStatus, updatedAt: new Date().toISOString() } 
          : ticket
      )
    );
  };

  const getTicketsForUser = (userEmail) => {
    return tickets.filter(t => t.userEmail === userEmail);
  };

  const getAllTickets = () => {
    return tickets;
  };

  const value = {
    tickets,
    addTicket,
    updateTicketStatus,
    getTicketsForUser,
    getAllTickets
  };

  return (
    <SupportTicketContext.Provider value={value}>
      {children}
    </SupportTicketContext.Provider>
  );
};
