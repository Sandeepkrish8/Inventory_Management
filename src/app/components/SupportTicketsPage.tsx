import React, { useState } from 'react';
import { useSupportTickets } from '@/app/contexts/SupportTicketContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { format } from 'date-fns';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/app/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/app/components/ui/dropdown-menu';
import { MoreVertical, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { EmptyState } from '@/app/components/EmptyState';
import { HelpCircle } from 'lucide-react';

export function SupportTicketsPage() {
  const { getAllTickets, updateTicketStatus } = useSupportTickets();
  const tickets = getAllTickets();

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Open': return 'destructive';
      case 'In Progress': return 'warning';
      case 'Resolved': return 'success';
      case 'Closed': return 'secondary';
      default: return 'default';
    }
  };

  const getPriorityBadgeVariant = (priority) => {
    switch (priority) {
      case 'Critical': return 'destructive';
      case 'High': return 'warning';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'default';
    }
  };

  if (tickets.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Support Tickets</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage user issues and support requests</p>
        </div>
        
        <EmptyState
          icon={HelpCircle}
          title="No active tickets"
          description="There are currently no support tickets raised by users."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl flex items-center gap-2 font-bold text-slate-900 dark:text-white">
          <HelpCircle className="w-6 h-6 text-teal-500" />
          Support Tickets
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Manage user issues and support requests across the system
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Support Tickets</CardTitle>
          <CardDescription>A list of all tickets submitted by users.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-200 dark:border-slate-800">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">{ticket.id}</TableCell>
                    <TableCell className="text-slate-500">
                      {format(new Date(ticket.createdAt), 'MMM d, yyyy h:mm a')}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{ticket.userName}</div>
                        <div className="text-xs text-slate-500">{ticket.userEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate font-medium" title={ticket.subject}>
                        {ticket.subject}
                      </div>
                      <div className="max-w-[200px] truncate text-xs text-slate-500" title={ticket.description}>
                        {ticket.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPriorityBadgeVariant(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => updateTicketStatus(ticket.id, 'Open')}>
                            <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                            Mark as Open
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateTicketStatus(ticket.id, 'In Progress')}>
                            <Clock className="mr-2 h-4 w-4 text-amber-500" />
                            Mark In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateTicketStatus(ticket.id, 'Resolved')}>
                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                            Mark as Resolved
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateTicketStatus(ticket.id, 'Closed')}>
                            <CheckCircle className="mr-2 h-4 w-4 text-slate-500" />
                            Mark as Closed
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
