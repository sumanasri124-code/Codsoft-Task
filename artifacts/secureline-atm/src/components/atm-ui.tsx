import { type ReactNode, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowDownLeft, ArrowUpRight, Banknote, CircleHelp, History, LayoutGrid, LogOut, Menu, ShieldCheck, X } from 'lucide-react';
import { useLogoutAccount } from '@workspace/api-client-react';
import type { Account, Transaction } from '@workspace/api-client-react';
import { clearSessionToken } from '@/lib/session';

export const formatINR = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount);

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));

export const formatTime = (value: string) =>
  new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit' }).format(new Date(value));

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3" data-testid="brand-secureline">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#d5ed73] text-[#1d293f] shadow-[4px_4px_0_#a8bd4d]">
        <ShieldCheck size={22} strokeWidth={2.5} />
      </div>
      {!compact && <div><p className="font-mono-ui text-[10px] uppercase tracking-[.22em] text-[#a6b0bf]">SecureLine</p><p className="text-[17px] font-extrabold tracking-[-.04em] text-[#f6f2e8]">ATM</p></div>}
    </div>
  );
}

export function LoadingState({ label = 'Connecting to SecureLine' }: { label?: string }) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center gap-5 rounded-2xl border border-[#ded8ca] bg-[#f8f6ef]" data-testid="status-loading">
      <div className="flex gap-1.5" aria-label="Loading">
        <span className="h-2 w-2 animate-pulse rounded-full bg-[#1d293f]" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-[#849a2e] [animation-delay:120ms]" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-[#1d293f] [animation-delay:240ms]" />
      </div>
      <p className="font-mono-ui text-xs uppercase tracking-[.16em] text-[#687386]">{label}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="rounded-2xl border border-[#e6b9b3] bg-[#fff7f5] p-7" data-testid="status-error">
      <p className="font-mono-ui text-[11px] uppercase tracking-[.16em] text-[#a64239]">Terminal message / 04</p>
      <h3 className="mt-2 text-lg font-extrabold text-[#1d293f]">We could not complete that request.</h3>
      <p className="mt-2 max-w-lg text-sm leading-6 text-[#687386]">{message || 'The banking service is temporarily unavailable. Please try again.'}</p>
      {onRetry && <button type="button" onClick={onRetry} className="terminal-focus mt-5 rounded-lg bg-[#1d293f] px-4 py-2.5 text-sm font-bold text-[#f6f2e8] transition hover:-translate-y-0.5" data-testid="button-retry">Try again</button>}
    </div>
  );
}

export function EmptyState({ title, detail, icon: Icon = History }: { title: string; detail: string; icon?: typeof History }) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#cfc8b8] bg-[#f8f6ef] px-6 text-center" data-testid="status-empty">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-[#e7edc6] text-[#556b1e]"><Icon size={21} /></div>
      <h3 className="mt-4 text-base font-extrabold text-[#1d293f]">{title}</h3>
      <p className="mt-1 max-w-sm text-sm leading-6 text-[#687386]">{detail}</p>
    </div>
  );
}

export function AppShell({ account, children }: { account?: Account; children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const [open, setOpen] = useState(false);
  const logout = useLogoutAccount();
  const nav = [
    { href: '/dashboard', label: 'Overview', icon: LayoutGrid },
    { href: '/transactions', label: 'Mini statement', icon: History },
  ];
  const handleLogout = () => logout.mutate(undefined, { onSuccess: () => { clearSessionToken(); setLocation('/'); } });
  return (
    <div className="noise flex min-h-[100dvh] bg-[#f2efe6] text-[#1d293f]">
      <aside className={`${open ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-40 flex w-[270px] flex-col bg-[#1d293f] px-6 py-7 transition-transform duration-300 md:relative md:translate-x-0`} data-testid="sidebar-navigation">
        <div className="flex items-center justify-between"><BrandMark /><button className="text-[#a6b0bf] md:hidden" onClick={() => setOpen(false)} aria-label="Close navigation" data-testid="button-close-navigation"><X size={20} /></button></div>
        <div className="mt-14">
          <p className="font-mono-ui mb-3 text-[10px] uppercase tracking-[.2em] text-[#8190a5]">Your terminal</p>
          <nav className="space-y-1">
            {nav.map(({ href, label, icon: Icon }) => <Link key={href} href={href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition ${location === href ? 'bg-[#d5ed73] text-[#1d293f]' : 'text-[#bfc8d3] hover:bg-[#2c3a52] hover:text-[#f6f2e8]'}`} data-testid={`link-${label.toLowerCase().replaceAll(' ', '-')}`}><Icon size={18} /><span>{label}</span>{location === href && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#1d293f]" />}</Link>)}
          </nav>
        </div>
        <div className="mt-auto">
          <div className="mb-5 rounded-xl border border-[#34435d] bg-[#24324a] p-4">
            <p className="font-mono-ui text-[10px] uppercase tracking-[.16em] text-[#8190a5]">Session secured</p>
            <p className="mt-2 flex items-center gap-2 text-xs font-bold text-[#d5ed73]"><span className="h-1.5 w-1.5 rounded-full bg-[#d5ed73]" /> Encrypted connection</p>
          </div>
          <button type="button" onClick={handleLogout} disabled={logout.isPending} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-[#bfc8d3] transition hover:bg-[#2c3a52] hover:text-[#f6f2e8] disabled:opacity-50" data-testid="button-logout"><LogOut size={18} /> {logout.isPending ? 'Ending session…' : 'End session'}</button>
        </div>
      </aside>
      {open && <button aria-label="Close navigation overlay" onClick={() => setOpen(false)} className="fixed inset-0 z-30 bg-[#1d293f]/40 md:hidden" data-testid="button-navigation-overlay" />}
      <main className="min-w-0 flex-1">
        <header className="flex h-[78px] items-center justify-between border-b border-[#ded8ca] bg-[#f2efe6]/90 px-5 backdrop-blur md:px-10">
          <button className="rounded-lg p-2 text-[#1d293f] md:hidden" onClick={() => setOpen(true)} aria-label="Open navigation" data-testid="button-open-navigation"><Menu size={22} /></button>
          <div className="hidden md:block"><p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[#8490a0]">Self-service terminal</p><p className="mt-1 text-sm font-bold">Welcome back, <span data-testid="text-shell-username">{account?.username || 'account holder'}</span></p></div>
          <div className="ml-auto flex items-center gap-3"><div className="hidden items-center gap-2 rounded-full border border-[#d5cfbf] bg-[#f8f6ef] px-3 py-2 text-xs font-bold text-[#687386] sm:flex"><span className="h-2 w-2 rounded-full bg-[#849a2e]" /> Online</div><div className="grid h-9 w-9 place-items-center rounded-full bg-[#1d293f] text-xs font-extrabold text-[#d5ed73]" data-testid="avatar-account">{account?.username?.slice(0, 2).toUpperCase() || 'SL'}</div></div>
        </header>
        {logout.error && <div className="mx-5 mt-5 rounded-xl border border-[#e6b9b3] bg-[#fff7f5] px-4 py-3 text-xs font-bold text-[#a64239] md:mx-10" data-testid="status-logout-error">The session could not be ended. Please try again.</div>}
        {children}
      </main>
    </div>
  );
}

export function TransactionRow({ transaction }: { transaction: Transaction }) {
  const incoming = transaction.type === 'DEPOSIT' || transaction.type === 'REGISTRATION';
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-[#e9e4d9] py-4 last:border-0" data-testid={`row-transaction-${transaction.id}`}>
      <div className={`grid h-9 w-9 place-items-center rounded-full ${incoming ? 'bg-[#e7edc6] text-[#596e1d]' : 'bg-[#f5ddda] text-[#a64239]'}`}>{incoming ? <ArrowDownLeft size={17} /> : <ArrowUpRight size={17} />}</div>
      <div className="min-w-0"><p className="truncate text-sm font-extrabold text-[#1d293f]" data-testid={`text-description-${transaction.id}`}>{transaction.description}</p><p className="mt-1 text-xs text-[#8490a0]">{formatDate(transaction.timestamp)} · {formatTime(transaction.timestamp)}</p></div>
      <div className="text-right"><p className={`font-mono-ui text-sm font-medium ${incoming ? 'text-[#53691b]' : 'text-[#a64239]'}`} data-testid={`text-amount-${transaction.id}`}>{incoming ? '+' : '−'}{formatINR(transaction.amount)}</p><p className="mt-1 text-[10px] text-[#8490a0]">Bal. {formatINR(transaction.balanceAfter)}</p></div>
    </div>
  );
}

export function SectionHeading({ eyebrow, title, detail, action }: { eyebrow: string; title: string; detail?: string; action?: ReactNode }) {
  return <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="font-mono-ui text-[10px] uppercase tracking-[.2em] text-[#849a2e]">{eyebrow}</p><h1 className="mt-2 text-3xl font-extrabold tracking-[-.055em] text-[#1d293f] md:text-[40px]">{title}</h1>{detail && <p className="mt-2 max-w-xl text-sm leading-6 text-[#687386]">{detail}</p>}</div>{action}</div>;
}

export function OperationButton({ label, detail, icon: Icon, onClick, tone = 'dark' }: { label: string; detail: string; icon: typeof Banknote; onClick: () => void; tone?: 'dark' | 'lime' }) {
  return <button type="button" onClick={onClick} className={`group flex min-h-[116px] flex-col justify-between rounded-2xl border p-5 text-left transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_26px_-18px_#1d293f] ${tone === 'lime' ? 'border-[#c4d965] bg-[#d5ed73] text-[#1d293f]' : 'border-[#2e3c53] bg-[#24324a] text-[#f6f2e8]'}`} data-testid={`button-operation-${label.toLowerCase().replaceAll(' ', '-')}`}><span className={`grid h-9 w-9 place-items-center rounded-lg ${tone === 'lime' ? 'bg-[#1d293f] text-[#d5ed73]' : 'bg-[#34445e] text-[#d5ed73]'}`}><Icon size={18} /></span><span><span className="block text-sm font-extrabold">{label}</span><span className={`mt-1 block text-xs ${tone === 'lime' ? 'text-[#53621f]' : 'text-[#a6b0bf]'}`}>{detail}</span></span></button>;
}

export function Modal({ title, eyebrow, onClose, children }: { title: string; eyebrow: string; onClose: () => void; children: ReactNode }) {
  return <div className="fixed inset-0 z-50 grid place-items-center bg-[#1d293f]/55 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" data-testid="dialog-operation"><div className="animate-rise w-full max-w-md rounded-2xl border border-[#d8d1c1] bg-[#f8f6ef] p-6 shadow-2xl sm:p-8"><div className="flex items-start justify-between"><div><p className="font-mono-ui text-[10px] uppercase tracking-[.2em] text-[#849a2e]">{eyebrow}</p><h2 className="mt-2 text-2xl font-extrabold tracking-[-.05em] text-[#1d293f]">{title}</h2></div><button type="button" onClick={onClose} className="rounded-lg p-2 text-[#687386] transition hover:bg-[#ebe6d9] hover:text-[#1d293f]" aria-label="Close dialog" data-testid="button-close-dialog"><X size={18} /></button></div>{children}</div></div>;
}

export function InputField({ label, value, onChange, type = 'text', placeholder, maxLength, autoComplete }: { label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string; maxLength?: number; autoComplete?: string }) {
  return <label className="block"><span className="mb-2 block text-xs font-extrabold uppercase tracking-[.12em] text-[#687386]">{label}</span><input className="terminal-focus w-full rounded-xl border border-[#d1cabc] bg-[#fcfaf5] px-4 py-3.5 text-sm font-semibold text-[#1d293f] outline-none transition placeholder:text-[#a7a294] focus:border-[#849a2e]" value={value} onChange={(event) => onChange(event.target.value)} type={type} placeholder={placeholder} maxLength={maxLength} autoComplete={autoComplete} data-testid={`input-${label.toLowerCase().replaceAll(' ', '-')}`} /></label>;
}

export function HelpHint({ children }: { children: ReactNode }) {
  return <div className="flex items-start gap-2 rounded-xl bg-[#ebe8dc] p-3 text-xs leading-5 text-[#687386]"><CircleHelp size={15} className="mt-0.5 shrink-0 text-[#849a2e]" />{children}</div>;
}