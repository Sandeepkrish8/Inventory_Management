import React, { useState } from 'react';
import { mockTransactions } from '@/app/data/mockData';
import { Transaction } from '@/app/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/app/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/app/components/ui/select';
import { ArrowDownCircle, ArrowUpCircle, Filter } from 'lucide-react';
import { format } from 'date-fns';

export const TransactionsPage: React.FC = () => {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [typeFilter, setTypeFilter] = useState<'all' | 'stock_in' | 'stock_out'>('all');

  const filteredTransactions = transactions.filter((transaction) => {
    if (typeFilter === 'all') return true;
    return transaction.type === typeFilter;
  });

  // Sort by date (most recent first)
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900">Inventory Transactions</h2>
          <p className="text-slate-500 mt-1">View stock movement history</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <ArrowUpCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Stock In</p>
                <p className="text-2xl font-semibold text-slate-900">
                  {transactions
                    .filter(t => t.type === 'stock_in')
                    .reduce((sum, t) => sum + t.quantity, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <ArrowDownCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Stock Out</p>
                <p className="text-2xl font-semibold text-slate-900">
                  {transactions
                    .filter(t => t.type === 'stock_out')
                    .reduce((sum, t) => sum + t.quantity, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <Filter className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Transactions</p>
                <p className="text-2xl font-semibold text-slate-900">
                  {transactions.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <Select value={typeFilter} onValueChange={(value: any) => setTypeFilter(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="stock_in">Stock In Only</SelectItem>
                <SelectItem value="stock_out">Stock Out Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {sortedTransactions.length} Transaction{sortedTransactions.length !== 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead>Performed By</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {format(new Date(transaction.date), 'MMM dd, yyyy HH:mm')}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={transaction.type === 'stock_in' ? 'default' : 'secondary'}
                        className="gap-1"
                      >
                        {transaction.type === 'stock_in' ? (
                          <ArrowUpCircle className="w-3 h-3" />
                        ) : (
                          <ArrowDownCircle className="w-3 h-3" />
                        )}
                        {transaction.type === 'stock_in' ? 'Stock In' : 'Stock Out'}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.productName}</TableCell>
                    <TableCell className="text-right font-medium">
                      <span className={transaction.type === 'stock_in' ? 'text-green-600' : 'text-orange-600'}>
                        {transaction.type === 'stock_in' ? '+' : '-'}{transaction.quantity}
                      </span>
                    </TableCell>
                    <TableCell>{transaction.performedBy}</TableCell>
                    <TableCell>
                      {transaction.reference && (
                        <Badge variant="outline">{transaction.reference}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-600">{transaction.notes || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
