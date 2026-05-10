import { motion } from "motion/react";
import { useState } from "react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { ArrowRight, Mail, MapPin, Sparkles, Globe2, ShieldCheck } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900">
      <Header />
      <main>
        <Hero />
        <AboutKlink />
        <Product />
        <ContactUs />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "#about", label: "About klink" },
    { href: "#product", label: "Product" },
    { href: "#contact", label: "Contact us" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <a href="#top" className="flex items-center gap-2">
          <img src="/logo.png" alt="B&Y k-link" className="h-10 w-auto" />
          <span className="text-xl font-black tracking-tight text-neutral-900">
            B&Y <span className="text-blue-600">k-link</span>
          </span>
        </a>

        <div className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-[#0C3F80]"
            >
              {link.label}
            </a>
          ))}
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg p-2 text-[#0C3F80] hover:bg-neutral-100 md:hidden"
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {open ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></> : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-neutral-200 bg-white md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-4 py-2">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

function Hero() {
  return (
    <section id="top" className="relative h-[80vh] min-h-[560px] w-full overflow-hidden bg-neutral-900">
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1621269050686-13387e760500?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW91bCUyMHNlb25nc3UlMjBkb25nJTIwc3RyZWV0JTIwY2FmZXxlbnwxfHx8fDE3NzQ4NDU3MDF8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Seoul Seongsu-dong"
          className="h-full w-full object-cover opacity-60 brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/40 via-transparent to-neutral-900/60" />
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <span className="mb-6 inline-block rounded-full bg-blue-600 px-3 py-1 text-sm font-medium text-white">
            K-Trend Incubator
          </span>
          <h1 className="text-5xl font-extrabold tracking-tight text-white md:text-7xl lg:text-8xl">
            First Choice,
            <br />
            <span className="text-blue-400">Next Trend.</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-neutral-300 md:text-xl">
            서울의 숨은 보석을 발굴해 태국의 다음 트렌드로 만듭니다.
            <br className="hidden md:block" />
            당신의 선택이 다음 트렌드를 정의합니다.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#product"
              className="inline-flex h-14 items-center justify-center rounded-xl bg-blue-600 px-8 font-bold text-white transition-colors hover:bg-blue-700"
            >
              Explore Product
            </a>
            <a
              href="#contact"
              className="inline-flex h-14 items-center justify-center rounded-xl bg-white px-8 font-bold text-neutral-900 shadow-lg transition-colors hover:bg-neutral-100"
            >
              Contact us
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function AboutKlink() {
  const values = [
    {
      icon: Sparkles,
      title: "Curation",
      desc: "서울 성수동 팝업과 라이징 브랜드를 직접 큐레이션합니다.",
    },
    {
      icon: ShieldCheck,
      title: "Validation",
      desc: "태국 현지 인플루언서와 데이터로 시장성을 검증합니다.",
    },
    {
      icon: Globe2,
      title: "Connection",
      desc: "한국 브랜드와 태국 시장을 가장 빠른 길로 연결합니다.",
    },
  ];

  return (
    <section id="about" className="mx-auto max-w-7xl px-4 py-24 md:px-6">
      <div className="mb-16 flex flex-col items-start gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
          <span className="h-px w-8 bg-blue-600" />
          About klink
        </div>
        <h2 className="text-4xl font-bold leading-tight text-neutral-900 md:text-5xl">
          한국의 트렌드를
          <br />
          가장 빠르게 발견하는 방법
        </h2>
        <p className="mt-2 max-w-2xl text-lg leading-relaxed text-neutral-500">
          B&Y k-link is Korea's leading trend incubator. 데이터 기반 큐레이션과
          인플루언서 검증으로 서울의 라이징 브랜드를 태국 시장의 메인 무대로
          올려놓습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {values.map((v, idx) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="rounded-3xl border border-neutral-200 bg-white p-8 transition-shadow hover:shadow-lg"
          >
            <v.icon size={36} className="mb-6 text-[#0C3F80]" />
            <h3 className="mb-3 text-xl font-bold text-neutral-900">{v.title}</h3>
            <p className="text-sm leading-relaxed text-neutral-500">{v.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Product() {
  const features = [
    {
      tag: "01",
      title: "Trend Curation",
      desc: "서울 현지 팀이 매주 성수동·홍대·압구정의 라이징 브랜드를 직접 발굴하고 셀렉합니다.",
    },
    {
      tag: "02",
      title: "Influencer Validation",
      desc: "태국 마이크로 인플루언서 네트워크가 실제 사용 후기와 숏폼으로 시장 반응을 검증합니다.",
    },
    {
      tag: "03",
      title: "Market Launch",
      desc: "검증된 데이터를 기반으로 통관·물류·B2B 입점까지 한 번에 연결합니다.",
    },
  ];

  return (
    <section id="product" className="bg-neutral-900 py-24 text-white">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-16 flex flex-col items-start gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-400">
            <span className="h-px w-8 bg-blue-400" />
            Product
          </div>
          <h2 className="text-4xl font-bold leading-tight md:text-5xl">
            Seoul to Bangkok,
            <br />
            <span className="text-blue-400">in one pipeline.</span>
          </h2>
          <p className="mt-2 max-w-2xl text-lg leading-relaxed text-neutral-400">
            발굴 → 검증 → 런칭. B&Y k-link는 한국 브랜드가 태국 시장에서
            성공하기까지 필요한 모든 단계를 하나의 파이프라인으로 제공합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((f, idx) => (
            <motion.div
              key={f.tag}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
            >
              <div className="mb-6 text-sm font-bold tracking-widest text-blue-400">
                {f.tag}
              </div>
              <h3 className="mb-3 text-2xl font-bold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-neutral-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactUs() {
  return (
    <section id="contact" className="mx-auto max-w-7xl px-4 py-24 md:px-6">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
        <div>
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-blue-600">
            <span className="h-px w-8 bg-blue-600" />
            Contact us
          </div>
          <h2 className="text-4xl font-bold leading-tight text-neutral-900 md:text-5xl">
            Let's build the
            <br />
            next K-trend together.
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-neutral-500">
            브랜드 입점, 크리에이터 협업, 파트너십 문의 모두 환영합니다.
            아래 채널로 언제든 연락 주세요.
          </p>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-8 md:p-10">
          <ul className="space-y-6">
            <li className="flex items-start gap-4">
              <div className="rounded-xl bg-blue-50 p-3">
                <Mail size={22} className="text-[#0C3F80]" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Email
                </div>
                <a
                  href="mailto:contact@by-klink.com"
                  className="mt-1 block text-lg font-semibold text-neutral-900 hover:text-blue-600"
                >
                  contact@by-klink.com
                </a>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="rounded-xl bg-blue-50 p-3">
                <MapPin size={22} className="text-[#0C3F80]" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Office
                </div>
                <p className="mt-1 text-lg font-semibold text-neutral-900">
                  Seongsu-dong, Seoul, South Korea
                </p>
                <p className="text-sm text-neutral-500">Bangkok Branch, Thailand</p>
              </div>
            </li>
          </ul>

          <a
            href="mailto:contact@by-klink.com"
            className="mt-10 inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#0C3F80] font-bold text-white transition-colors hover:bg-blue-900"
          >
            Send us a message
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="B&Y k-link" className="h-8 w-auto" />
          <span className="text-base font-black tracking-tight text-neutral-900">
            B&Y <span className="text-blue-600">k-link</span>
          </span>
        </div>
        <p className="text-xs text-neutral-400">
          © 2026 B&Y k-link co., ltd. All rights reserved. First Choice, Next Trend.
        </p>
      </div>
    </footer>
  );
}
