import { useState, type FormEvent } from 'react';
import { Banknote, Eye, KeyRound, Plus, WalletCards } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useQueryClient } from '@tanstack/react-query';
import { getGetAccountQueryKey, getGetDashboardQueryKey, getGetTransactionsQueryKey, useChangePin, useDepositMoney, useGetAccount, useGetDashboard, useWithdrawMoney } from '@workspace/api-client-react';
import { AppShell, ErrorState, formatDate, formatINR, InputField, LoadingState, Modal, OperationButton, SectionHeading, TransactionRow } from '@/components/atm-ui';

type Operation = 'deposit' | 'withdraw' | 'balance' | 'pin' | null;
function errorText(error: unknown) { return error instanceof Error ? error.message : 'The terminal could not complete that operation.'; }

export default function DashboardPage() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const accountQuery = useGetAccount({ query: { queryKey: getGetAccountQueryKey(), retry: false } });
  const dashboardQuery = useGetDashboard({ query: { queryKey: getGetDashboardQueryKey(), retry: false } });
  const deposit = useDepositMoney();
  const withdraw = useWithdrawMoney();
  const changePin = useChangePin();
  const [operation, setOperation] = useState<Operation>(null);
  const [amount, setAmount] = useState('');
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [feedback, setFeedback] = useState('');
  const account = dashboardQuery.data?.account || accountQuery.data;
  const loading = accountQuery.isLoading || dashboardQuery.isLoading;

  const closeOperation = () => { setOperation(null); setAmount(''); setCurrentPin(''); setNewPin(''); deposit.reset(); withdraw.reset(); changePin.reset(); };
  const refreshBanking = () => {
    queryClient.invalidateQueries({ queryKey: getGetAccountQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetDashboardQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetTransactionsQueryKey() });
  };
  const submitAmount = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = Number(amount);
    if (!value || value <= 0) return;
    const mutation = operation === 'deposit' ? deposit : withdraw;
    mutation.mutate({ data: { amount: value } }, { onSuccess: (result) => { setFeedback(result.message); refreshBanking(); closeOperation(); } });
  };
  const submitPin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    changePin.mutate({ data: { currentPin, newPin } }, { onSuccess: (result) => { setFeedback(result.message); closeOperation(); } });
  };
  if (loading) return <AppShell account={account}><div className="mx-auto max-w-[1250px] p-5 md:p-10"><LoadingState /></div></AppShell>;
  if (!account) return <AppShell><div className="mx-auto max-w-[1250px] p-5 md:p-10"><ErrorState message={errorText(accountQuery.error || dashboardQuery.error)} onRetry={() => { accountQuery.refetch(); dashboardQuery.refetch(); }} /><button type="button" onClick={() => setLocation('/')} className="mt-4 text-sm font-bold text-[#53691b] underline" data-testid="button-return-auth">Return to sign in</button></div></AppShell>;

  const recent = dashboardQuery.data?.recentTransactions || [];
  const activeMutationError = deposit.error || withdraw.error || changePin.error;
  return (
    <AppShell account={account}>
      <div className="mx-auto max-w-[1250px] p-5 md:p-10">
        {feedback && <div className="animate-fade mb-6 flex items-center justify-between rounded-xl border border-[#c4d965] bg-[#edf4d0] px-4 py-3 text-sm font-bold text-[#52651a]" data-testid="status-operation-success"><span>{feedback}</span><button type="button" onClick={() => setFeedback('')} className="text-xs underline" data-testid="button-dismiss-feedback">Dismiss</button></div>}
        <SectionHeading eyebrow="Overview / 02" title="Good morning." detail="One clear view of your account, plus the everyday moves you came here to make." action={<div className="font-mono-ui rounded-lg border border-[#d8d1c1] bg-[#f8f6ef] px-3 py-2 text-[10px] uppercase tracking-[.13em] text-[#8490a0]" data-testid="text-last-activity">Last active · {formatDate(account.lastActivity)}</div>} />
        <section className="grid gap-5 lg:grid-cols-[1.45fr_1fr]">
          <div className="relative overflow-hidden rounded-2xl bg-[#1d293f] p-6 text-[#f6f2e8] shadow-[0_18px_40px_-22px_#1d293f] md:p-8" data-testid="card-account-balance">
            <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border border-[#40506b]" /><div className="absolute -right-3 -top-7 h-40 w-40 rounded-full border border-[#40506b]" />
            <div className="relative"><div className="flex items-start justify-between"><div><p className="font-mono-ui text-[10px] uppercase tracking-[.2em] text-[#9aa6b7]">Available balance</p><p className="mt-5 font-mono-ui text-4xl font-medium tracking-[-.06em] text-[#f6f2e8] md:text-5xl" data-testid="text-account-balance">{formatINR(account.balance)}</p></div><div className="grid h-11 w-11 place-items-center rounded-xl bg-[#d5ed73] text-[#1d293f]"><WalletCards size={22} /></div></div><div className="mt-10 flex flex-wrap items-end justify-between gap-4 border-t border-[#34435d] pt-4"><div><p className="font-mono-ui text-[10px] uppercase tracking-[.15em] text-[#8190a5]">Account number</p><p className="mt-1 font-mono-ui text-sm tracking-[.12em] text-[#d7dce2]" data-testid="text-account-number">{account.accountNumber}</p></div><div className="text-right"><p className="font-mono-ui text-[10px] uppercase tracking-[.15em] text-[#8190a5]">Member since</p><p className="mt-1 text-xs font-bold text-[#d7dce2]">{formatDate(account.createdAt)}</p></div></div></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-[#ded8ca] bg-[#f8f6ef] p-5"><p className="font-mono-ui text-[10px] uppercase tracking-[.14em] text-[#8490a0]">Deposited</p><p className="mt-4 text-xl font-extrabold text-[#53691b]" data-testid="text-total-deposited">{formatINR(dashboardQuery.data?.totalDeposited || 0)}</p><p className="mt-1 text-xs text-[#8490a0]">All time</p></div>
            <div className="rounded-2xl border border-[#ded8ca] bg-[#f8f6ef] p-5"><p className="font-mono-ui text-[10px] uppercase tracking-[.14em] text-[#8490a0]">Withdrawn</p><p className="mt-4 text-xl font-extrabold text-[#a64239]" data-testid="text-total-withdrawn">{formatINR(dashboardQuery.data?.totalWithdrawn || 0)}</p><p className="mt-1 text-xs text-[#8490a0]">All time</p></div>
            <div className="col-span-2 rounded-2xl border border-[#ded8ca] bg-[#f8f6ef] p-5"><div className="flex items-center justify-between"><div><p className="font-mono-ui text-[10px] uppercase tracking-[.14em] text-[#8490a0]">Terminal activity</p><p className="mt-3 text-xl font-extrabold text-[#1d293f]" data-testid="text-transaction-count">{dashboardQuery.data?.transactionCount || 0} <span className="text-sm font-semibold text-[#8490a0]">transactions</span></p></div><div className="h-2 w-24 overflow-hidden rounded-full bg-[#e2dfd3]"><div className="h-full w-2/3 rounded-full bg-[#849a2e]" /></div></div></div>
          </div>
        </section>
        <section className="mt-10">
          <SectionHeading eyebrow="Operations / 03" title="Choose a service." detail="Each action is recorded instantly to your mini statement." />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <OperationButton label="Deposit money" detail="Add funds to your account" icon={Plus} onClick={() => setOperation('deposit')} tone="lime" />
            <OperationButton label="Withdraw money" detail="Take out available funds" icon={Banknote} onClick={() => setOperation('withdraw')} />
            <OperationButton label="Balance enquiry" detail="View your live balance" icon={Eye} onClick={() => setOperation('balance')} />
            <OperationButton label="Change PIN" detail="Update your 4-digit PIN" icon={KeyRound} onClick={() => setOperation('pin')} />
          </div>
        </section>
        <section className="mt-10 rounded-2xl border border-[#ded8ca] bg-[#f8f6ef] p-5 md:p-7">
          <div className="mb-2 flex items-end justify-between"><div><p className="font-mono-ui text-[10px] uppercase tracking-[.2em] text-[#849a2e]">Recent activity / 04</p><h2 className="mt-2 text-xl font-extrabold tracking-[-.04em]">Latest movements</h2></div><Link href="/transactions" className="text-xs font-extrabold text-[#53691b] underline underline-offset-4" data-testid="link-view-all-transactions">View all</Link></div>
          {recent.length ? recent.slice(0, 4).map((transaction) => <TransactionRow key={transaction.id} transaction={transaction} />) : <div className="py-8 text-center text-sm text-[#687386]" data-testid="status-no-recent-transactions">Your first transaction will appear here.</div>}
        </section>
      </div>
      {operation === 'deposit' || operation === 'withdraw' ? <Modal eyebrow={`Money movement / ${operation === 'deposit' ? '05' : '06'}`} title={operation === 'deposit' ? 'Deposit money' : 'Withdraw money'} onClose={closeOperation}><form onSubmit={submitAmount} className="mt-7 space-y-5"><InputField label="Amount in Indian rupees" value={amount} onChange={(value) => setAmount(value.replace(/[^\d.]/g, ''))} placeholder="₹ 1,000.00" autoComplete="off" />{activeMutationError && <p className="rounded-lg bg-[#fff0ed] px-3 py-2 text-xs font-semibold leading-5 text-[#a64239]" data-testid="status-operation-error">{errorText(activeMutationError)}</p>}<button type="submit" disabled={!Number(amount) || deposit.isPending || withdraw.isPending} className="w-full rounded-xl bg-[#1d293f] px-4 py-3.5 text-sm font-extrabold text-[#f6f2e8] transition hover:bg-[#2a3953] disabled:opacity-50" data-testid="button-confirm-amount">{deposit.isPending || withdraw.isPending ? 'Processing securely…' : `Confirm ${operation}`}</button></form></Modal> : null}
      {operation === 'balance' && <Modal eyebrow="Balance enquiry / 05" title="Your live balance" onClose={closeOperation}><div className="mt-7 rounded-xl bg-[#1d293f] p-5 text-[#f6f2e8]"><p className="font-mono-ui text-[10px] uppercase tracking-[.15em] text-[#a6b0bf]">Available now</p><p className="mt-2 font-mono-ui text-3xl tracking-[-.05em] text-[#d5ed73]" data-testid="text-enquiry-balance">{formatINR(account.balance)}</p></div><button type="button" onClick={closeOperation} className="mt-5 w-full rounded-xl border border-[#cfc8b8] px-4 py-3 text-sm font-extrabold text-[#1d293f] transition hover:bg-[#ebe8dc]" data-testid="button-close-enquiry">Done</button></Modal>}
      {operation === 'pin' && <Modal eyebrow="Security update / 05" title="Change your PIN" onClose={closeOperation}><form onSubmit={submitPin} className="mt-7 space-y-5"><InputField label="Current PIN" value={currentPin} onChange={(value) => setCurrentPin(value.replace(/\D/g, '').slice(0, 4))} type="password" maxLength={4} placeholder="••••" autoComplete="current-password" /><InputField label="New PIN" value={newPin} onChange={(value) => setNewPin(value.replace(/\D/g, '').slice(0, 4))} type="password" maxLength={4} placeholder="••••" autoComplete="new-password" />{activeMutationError && <p className="rounded-lg bg-[#fff0ed] px-3 py-2 text-xs font-semibold leading-5 text-[#a64239]" data-testid="status-pin-error">{errorText(activeMutationError)}</p>}<button type="submit" disabled={currentPin.length !== 4 || newPin.length !== 4 || changePin.isPending} className="w-full rounded-xl bg-[#1d293f] px-4 py-3.5 text-sm font-extrabold text-[#f6f2e8] transition hover:bg-[#2a3953] disabled:opacity-50" data-testid="button-confirm-pin">{changePin.isPending ? 'Updating securely…' : 'Update PIN'}</button></form></Modal>}
    </AppShell>
  );
}