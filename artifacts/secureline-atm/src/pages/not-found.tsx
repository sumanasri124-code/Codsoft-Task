import { ArrowLeft, CircleAlert, ShieldCheck } from 'lucide-react';
import { Link } from 'wouter';
import { BrandMark } from '@/components/atm-ui';

export default function NotFound() {
  return (
    <div className="noise min-h-[100dvh] bg-[#1d293f] p-6 text-[#f6f2e8] md:p-10">
      <div className="mx-auto flex min-h-[calc(100dvh-48px)] max-w-[1200px] flex-col"><BrandMark /><div className="m-auto max-w-lg text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#d5ed73] text-[#1d293f] shadow-[5px_5px_0_#a8bd4d]"><CircleAlert size={30} /></div><p className="mt-8 font-mono-ui text-[10px] uppercase tracking-[.2em] text-[#d5ed73]">Terminal message / 404</p><h1 className="mt-3 text-5xl font-extrabold tracking-[-.07em]">That screen is not in this machine.</h1><p className="mt-5 text-sm leading-7 text-[#a6b0bf]">The address you entered does not point to a SecureLine service. Return to the access screen to begin again.</p><Link href="/" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#f6f2e8] px-5 py-3.5 text-sm font-extrabold text-[#1d293f] transition hover:-translate-y-0.5" data-testid="link-return-home"><ArrowLeft size={17} /> Return to sign in</Link></div><div className="flex items-center justify-center gap-2 font-mono-ui text-[10px] uppercase tracking-[.16em] text-[#8190a5]"><ShieldCheck size={14} /> SecureLine encrypted terminal</div></div>
    </div>
  );
}
