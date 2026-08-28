import { useState, type FormEvent } from 'react';
import { ArrowRight, Fingerprint, KeyRound } from 'lucide-react';
import { useLocation } from 'wouter';
import { useLoginAccount, useRegisterAccount } from '@workspace/api-client-react';
import { BrandMark, HelpHint, InputField } from '@/components/atm-ui';
import { setSessionToken } from '@/lib/session';

function errorText(error: unknown) {
  if (!error) return '';
  if (error instanceof Error) return error.message;
  return 'Please check your details and try again.';
}

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [initialDeposit, setInitialDeposit] = useState('');
  const [notice, setNotice] = useState('');
  const login = useLoginAccount();
  const register = useRegisterAccount();
  const pending = login.isPending || register.isPending;
  const activeError = errorText(login.error || register.error);

  const switchMode = (next: 'login' | 'register') => {
    setMode(next); setNotice(''); login.reset(); register.reset();
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice('');
    if (mode === 'login') {
      login.mutate({ data: { username: username.trim(), pin } }, {
        onSuccess: (response) => {
          setSessionToken(response.token);
          setLocation('/dashboard');
        },
      });
    } else {
      register.mutate({ data: { username: username.trim(), pin, initialDeposit: Number(initialDeposit || 0) } }, {
        onSuccess: (response) => {
          setSessionToken(response.token);
          setLocation('/dashboard');
        },
      });
    }
  };

  return (
    <div className="noise min-h-[100dvh] bg-[#1d293f] text-[#f6f2e8]">
      <div className="mx-auto grid min-h-[100dvh] max-w-[1500px] lg:grid-cols-[.92fr_1.08fr]">
        <section className="atm-grid relative hidden overflow-hidden border-r border-[#34435d] px-12 py-12 lg:flex lg:flex-col xl:px-20">
          <BrandMark />
          <div className="relative z-10 mt-auto max-w-[510px] pb-10">
            <p className="font-mono-ui text-xs uppercase tracking-[.22em] text-[#d5ed73]">Java-powered banking terminal</p>
            <h1 className="mt-5 text-6xl font-extrabold leading-[.96] tracking-[-.07em] text-[#f6f2e8] xl:text-7xl">Your money,<br /><span className="text-[#d5ed73]">on your terms.</span></h1>
            <p className="mt-7 max-w-md text-sm leading-7 text-[#a6b0bf]">A focused self-service experience for everyday banking. Sign in, move money, and leave with a clear receipt of what changed.</p>
            <div className="mt-12 flex items-center gap-5 border-t border-[#34435d] pt-5"><div className="font-mono-ui text-[10px] uppercase tracking-[.14em] text-[#8190a5]">Terminal 03</div><div className="h-1 w-1 rounded-full bg-[#d5ed73]" /><div className="font-mono-ui text-[10px] uppercase tracking-[.14em] text-[#8190a5]">Ready for service</div></div>
          </div>
          <div className="absolute -right-20 top-24 h-80 w-80 rounded-full border border-[#40506b] opacity-70" /><div className="absolute -right-4 top-40 h-48 w-48 rounded-full border border-[#40506b]" /><div className="absolute bottom-16 right-16 h-24 w-24 rounded-full bg-[#d5ed73] opacity-10" />
        </section>
        <section className="flex flex-col bg-[#f2efe6] text-[#1d293f]">
          <div className="flex items-center justify-between px-5 py-7 lg:hidden"><BrandMark compact /><div className="font-mono-ui text-[10px] uppercase tracking-[.16em] text-[#8490a0]">Terminal 03</div></div>
          <div className="mx-auto flex w-full max-w-[530px] flex-1 flex-col justify-center px-5 py-8 sm:px-10">
            <div className="mb-9">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#d5ed73] text-[#1d293f] shadow-[4px_4px_0_#a8bd4d]">{mode === 'login' ? <Fingerprint size={23} /> : <KeyRound size={23} />}</div>
              <p className="font-mono-ui text-[10px] uppercase tracking-[.2em] text-[#849a2e]">{mode === 'login' ? 'Secure access / 01' : 'New account / 01'}</p>
              <h2 className="mt-2 text-4xl font-extrabold tracking-[-.06em]">{mode === 'login' ? 'Good to see you.' : 'Start your account.'}</h2>
              <p className="mt-3 text-sm leading-6 text-[#687386]">{mode === 'login' ? 'Enter your credentials to continue to your SecureLine terminal.' : 'Register once, then use your personal terminal whenever you need it.'}</p>
            </div>
            <div className="mb-7 flex rounded-xl border border-[#d8d1c1] bg-[#ebe8dc] p-1" role="tablist">
              <button type="button" onClick={() => switchMode('login')} className={`flex-1 rounded-lg px-3 py-2.5 text-xs font-extrabold transition ${mode === 'login' ? 'bg-[#1d293f] text-[#f6f2e8] shadow-sm' : 'text-[#687386]'}`} data-testid="button-mode-login">Sign in</button>
              <button type="button" onClick={() => switchMode('register')} className={`flex-1 rounded-lg px-3 py-2.5 text-xs font-extrabold transition ${mode === 'register' ? 'bg-[#1d293f] text-[#f6f2e8] shadow-sm' : 'text-[#687386]'}`} data-testid="button-mode-register">Register</button>
            </div>
            {notice && <div className="mb-5 rounded-xl border border-[#c4d965] bg-[#edf4d0] px-4 py-3 text-sm font-bold text-[#52651a]" data-testid="status-auth-success">{notice}</div>}
            {activeError && <div className="mb-5 rounded-xl border border-[#e6b9b3] bg-[#fff7f5] px-4 py-3 text-sm font-semibold leading-5 text-[#a64239]" data-testid="status-auth-error">{activeError}</div>}
            <form onSubmit={submit} className="space-y-5">
              <InputField label="Username" value={username} onChange={setUsername} placeholder="e.g. ananya.rao" maxLength={24} autoComplete="username" />
              <InputField label="4-digit PIN" value={pin} onChange={(value) => setPin(value.replace(/\D/g, '').slice(0, 4))} type="password" placeholder="••••" maxLength={4} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
              {mode === 'register' && <InputField label="Initial deposit (optional)" value={initialDeposit} onChange={(value) => setInitialDeposit(value.replace(/[^\d.]/g, ''))} type="text" placeholder="₹ 0.00" autoComplete="off" />}
              <button type="submit" disabled={pending || username.trim().length < 1 || pin.length !== 4} className="group flex w-full items-center justify-between rounded-xl bg-[#1d293f] px-5 py-4 text-sm font-extrabold text-[#f6f2e8] transition hover:-translate-y-0.5 hover:bg-[#2a3953] disabled:cursor-not-allowed disabled:opacity-50" data-testid="button-submit-auth"><span>{pending ? 'Contacting terminal…' : mode === 'login' ? 'Continue securely' : 'Create account'}</span><ArrowRight size={18} className="transition-transform group-hover:translate-x-1" /></button>
            </form>
            <div className="mt-6"><HelpHint>{mode === 'login' ? 'Your PIN is never displayed or stored in this browser.' : 'Choose a username with 3–24 characters and a 4-digit PIN.'}</HelpHint></div>
            <p className="mt-auto pt-12 text-center font-mono-ui text-[10px] uppercase tracking-[.16em] text-[#a09b8e]">SecureLine ATM · Java Development Internship Task 3</p>
          </div>
        </section>
      </div>
    </div>
  );
}