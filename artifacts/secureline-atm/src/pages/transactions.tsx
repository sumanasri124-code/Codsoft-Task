import { useMemo, useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, History } from 'lucide-react';
import { useGetAccount, useGetTransactions, getGetAccountQueryKey, getGetTransactionsQueryKey } from '@workspace/api-client-react';
import { AppShell, EmptyState, ErrorState, formatINR, LoadingState, SectionHeading, TransactionRow } from '@/components/atm-ui';

type Filter = 'ALL' | 'DEPOSIT' | 'WITHDRAWAL';
function errorText(error: unknown) { return error instanceof Error ? error.message : 'The terminal could not load your statement.'; }

export default function TransactionsPage() {
  const accountQuery = useGetAccount({ query: { queryKey: getGetAccountQueryKey(), retry: false } });
  const transactionsQuery = useGetTransactions({ query: { queryKey: getGetTransactionsQueryKey(), retry: false } });
  const [filter, setFilter] = useState<Filter>('ALL');
  const transactions = transactionsQuery.data || [];
  const filtered = useMemo(() => filter === 'ALL' ? transactions : transactions.filter((item) => item.type === filter), [filter, transactions]);
  const loading = accountQuery.isLoading || transactionsQuery.isLoading;
  if (loading) return <AppShell account={accountQuery.data}><div className="mx-auto max-w-[1050px] p-5 md:p-10"><LoadingState label="Printing your mini statement" /></div></AppShell>;
  if (accountQuery.error || transactionsQuery.error) return <AppShell account={accountQuery.data}><div className="mx-auto max-w-[1050px] p-5 md:p-10"><ErrorState message={errorText(accountQuery.error || transactionsQuery.error)} onRetry={() => { accountQuery.refetch(); transactionsQuery.refetch(); }} /></div></AppShell>;
  return (
    <AppShell account={accountQuery.data}>
      <div className="mx-auto max-w-[1050px] p-5 md:p-10">
        <SectionHeading eyebrow="Mini statement / 02" title="Your activity." detail="A complete record of every movement through your SecureLine account." action={<div className="rounded-xl border border-[#ded8ca] bg-[#f8f6ef] px-4 py-3 text-right"><p className="font-mono-ui text-[10px] uppercase tracking-[.14em] text-[#8490a0]">Current balance</p><p className="mt-1 font-mono-ui text-sm font-medium text-[#1d293f]" data-testid="text-transactions-balance">{formatINR(accountQuery.data?.balance || 0)}</p></div>} />
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div className="flex rounded-xl border border-[#d8d1c1] bg-[#ebe8dc] p-1" role="tablist">{(['ALL', 'DEPOSIT', 'WITHDRAWAL'] as Filter[]).map((item) => <button type="button" key={item} onClick={() => setFilter(item)} className={`rounded-lg px-3 py-2 text-xs font-extrabold transition sm:px-4 ${filter === item ? 'bg-[#1d293f] text-[#f6f2e8]' : 'text-[#687386] hover:text-[#1d293f]'}`} data-testid={`button-filter-${item.toLowerCase()}`}>{item === 'ALL' ? 'All activity' : item === 'DEPOSIT' ? 'Deposits' : 'Withdrawals'}</button>)}</div><p className="font-mono-ui text-[10px] uppercase tracking-[.14em] text-[#8490a0]" data-testid="text-statement-count">{filtered.length} of {transactions.length} entries</p></div>
        {transactions.length === 0 ? <EmptyState title="Your statement is clear." detail="Deposits and withdrawals will appear here after you use a SecureLine service." icon={History} /> : filtered.length === 0 ? <EmptyState title="No matching entries." detail="Try another statement filter to see your account activity." icon={History} /> : <div className="rounded-2xl border border-[#ded8ca] bg-[#f8f6ef] p-5 md:p-7"><div className="mb-3 grid grid-cols-[auto_1fr_auto] gap-3 border-b border-[#e9e4d9] pb-3 font-mono-ui text-[10px] uppercase tracking-[.15em] text-[#8490a0]"><span>Type</span><span>Details</span><span>Amount</span></div>{filtered.map((transaction) => <TransactionRow key={transaction.id} transaction={transaction} />)}</div>}
        <div className="mt-6 grid gap-3 sm:grid-cols-2"><div className="flex items-center gap-3 rounded-xl border border-[#ded8ca] bg-[#f8f6ef] p-4"><div className="grid h-8 w-8 place-items-center rounded-lg bg-[#e7edc6] text-[#596e1d]"><ArrowDownLeft size={16} /></div><div><p className="text-xs font-bold text-[#687386]">Total received</p><p className="mt-1 font-mono-ui text-sm text-[#53691b]" data-testid="text-statement-deposits">{formatINR(transactions.filter((item) => item.type === 'DEPOSIT' || item.type === 'REGISTRATION').reduce((total, item) => total + item.amount, 0))}</p></div></div><div className="flex items-center gap-3 rounded-xl border border-[#ded8ca] bg-[#f8f6ef] p-4"><div className="grid h-8 w-8 place-items-center rounded-lg bg-[#f5ddda] text-[#a64239]"><ArrowUpRight size={16} /></div><div><p className="text-xs font-bold text-[#687386]">Total withdrawn</p><p className="mt-1 font-mono-ui text-sm text-[#a64239]" data-testid="text-statement-withdrawals">{formatINR(transactions.filter((item) => item.type === 'WITHDRAWAL').reduce((total, item) => total + item.amount, 0))}</p></div></div></div>
      </div>
    </AppShell>
  );
}