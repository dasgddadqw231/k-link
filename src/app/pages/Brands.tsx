import { useState } from "react";
import { motion } from "motion/react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Globe, BarChart, Rocket, ShieldCheck, Zap, MessageCircle, CheckCircle2 } from "lucide-react";

const LINE_OA_URL = "https://line.me/R/ti/p/@KLINK_LINE_ID";

const BRAND_BENEFITS = [
  { title: "Market Validation", description: "태국 공식 런칭 전, 실제 소비자 프리오더 데이터를 통해 시장성을 검증하세요.", icon: BarChart },
  { title: "Local Curation", description: "성수동 감성을 담은 큐레이션으로 태국 현지 트렌드에 최적화된 브랜딩 제공.", icon: Globe },
  { title: "Influencer Match", description: "브랜드 이미지에 가장 적합한 태국 TOP 크리에이터와의 자동 매칭 기회.", icon: Zap },
  { title: "Safe Entry", description: "물류, 검역, 통관 이슈 없이 샘플 발송만으로 시작하는 리스크 없는 해외 진출.", icon: Rocket },
];

const BRAND_CATEGORIES = ["Beauty / Skincare", "Fashion / Apparel", "Food & Beverage", "Health / Wellness", "Lifestyle / Home", "Tech / Gadget", "Other"];

type FormState = {
  brandName: string;
  contact: string;
  category: string;
  message: string;
};

export default function Brands() {
  const [form, setForm] = useState<FormState>({
    brandName: "",
    contact: "",
    category: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const msg = encodeURIComponent(
      `[브랜드 입점 문의]\n브랜드명: ${form.brandName}\n담당자: ${form.contact}\n카테고리: ${form.category}${form.message ? `\n추가 메시지: ${form.message}` : ""}`
    );
    window.open(`${LINE_OA_URL}?text=${msg}`, "_blank");
    setSubmitted(true);
  }

  return (
    <div className="flex flex-col gap-24 pb-24 bg-white text-neutral-900 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden bg-neutral-900 text-white">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-40 z-0">
          <ImageWithFallback src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBvZmZpY2UlMjBzZW91bCUyMGJ1c2luZXNzfGVufDB8fHx8MTc3NDg0NTcwMXww&ixlib=rb-4.1.0&q=80&w=1080" alt="Seoul Business" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/40 to-transparent" />
        </div>
        <div className="mx-auto max-w-7xl px-4 md:px-6 relative z-10">
          <Badge className="mb-6 bg-blue-600 border-none px-4 py-1 text-sm font-bold uppercase tracking-widest">FOR KOREAN BRANDS</Badge>
          <h1 className="text-5xl font-black md:text-7xl mb-8 leading-[1.1]">
            Global Expansion,<br />
            <span className="text-blue-400">Zero Risk.</span>
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mb-12 leading-relaxed">
            "당신의 브랜드가 태국의 다음 트렌드가 됩니다."<br />
            복잡한 해외 진출 프로세스 없이, 샘플 발송만으로 태국 소비자들의 반응을 확인하세요.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#contact">
              <Button size="lg" className="h-16 bg-white text-neutral-900 hover:bg-neutral-200 font-black px-12 text-lg rounded-2xl shadow-2xl">
                Register My Brand
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-black md:text-5xl mb-6">Why B&Y k-link?</h2>
          <p className="text-neutral-500 max-w-2xl mx-auto">한국의 라이징 브랜드들이 태국 시장 첫 파트너로 B&Y k-link를 선택하는 이유입니다.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {BRAND_BENEFITS.map((benefit, i) => (
            <div key={i} className="flex flex-col gap-6 p-10 rounded-3xl bg-neutral-50 border border-neutral-100 transition-colors">
              <div className="h-16 w-16 bg-blue-600/10 text-blue-600 rounded-2xl flex items-center justify-center">
                <benefit.icon size={32} />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900">{benefit.title}</h3>
              <p className="text-neutral-500 leading-relaxed text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-neutral-50 py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">From Seongsu to Bangkok in 4 Steps.</h2>
              <div className="space-y-12 mt-12">
                {[
                  { step: "01", title: "Brand Curation", desc: "B&Y MD팀이 브랜드의 스토리와 제품력을 분석하여 입점 적합성 판단." },
                  { step: "02", title: "Pre-order Campaign", desc: "태국 현지 타겟층을 대상으로 2주간의 프리오더 캠페인 진행." },
                  { step: "03", title: "Influencer Validation", desc: "캠페인 기간 중 인플루언서 실사용 리뷰 및 숏폼 영상 제작 지원." },
                  { step: "04", title: "Official Distribution", desc: "검증된 데이터를 기반으로 태국 내 대형 유통망 공식 입점 연계." },
                ].map((s, i) => (
                  <div key={i} className="flex gap-6">
                    <span className="text-4xl font-black text-blue-600 opacity-20">{s.step}</span>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{s.title}</h4>
                      <p className="text-neutral-500">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-[60px] overflow-hidden shadow-2xl">
                <ImageWithFallback src="https://images.unsplash.com/photo-1621269050686-13387e760500?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW91bCUyMHNlb25nc3UlMjBkb25nJTIwc3RyZWV0JTIwY2FmZXxlbnwxfHx8fDE3NzQ4NDU3MDF8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="Bangkok Store" className="h-full w-full object-cover" />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-3xl shadow-xl border border-neutral-100 max-w-xs">
                <div className="flex items-center gap-2 text-blue-600 font-bold mb-2">
                  <ShieldCheck size={20} />
                  <span>Verified Data</span>
                </div>
                <p className="text-sm text-neutral-600 font-medium">실제 주문 건수와 전환율 데이터를 통해 실패 없는 진출을 보장합니다.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 브랜드 문의 폼 ── */}
      <section id="contact" className="mx-auto max-w-3xl w-full px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[40px] bg-neutral-900 text-white p-10 md:p-14"
        >
          <div className="flex items-center gap-3 mb-2">
            <MessageCircle size={28} className="text-blue-400" />
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">브랜드 입점 문의</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">태국 진출, 지금 시작하세요</h2>
          <p className="text-neutral-400 mb-10 text-sm leading-relaxed">
            아래 정보를 입력하면 B&Y k-link MD팀이 Official Line으로 연락드립니다.<br />
            샘플 발송만으로 시작할 수 있습니다.
          </p>

          {submitted ? (
            <div className="flex flex-col items-center gap-6 py-10">
              <div className="h-20 w-20 rounded-full bg-blue-600/20 flex items-center justify-center">
                <CheckCircle2 size={48} className="text-blue-400" />
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-white mb-2">문의 완료!</p>
                <p className="text-neutral-400">Line 앱에서 메시지를 전송해주시면 MD팀이 검토 후 연락드립니다.</p>
              </div>
              <Button
                variant="outline"
                className="border-neutral-600 text-neutral-300 hover:bg-neutral-700"
                onClick={() => setSubmitted(false)}
              >
                다시 문의하기
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 브랜드명 */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">브랜드명</label>
                  <input
                    name="brandName"
                    value={form.brandName}
                    onChange={handleChange}
                    required
                    placeholder="Seoul Lab"
                    className="h-12 rounded-xl bg-neutral-800 border border-neutral-700 px-4 text-white placeholder:text-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                {/* 담당자 */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">담당자 이름</label>
                  <input
                    name="contact"
                    value={form.contact}
                    onChange={handleChange}
                    required
                    placeholder="홍길동"
                    className="h-12 rounded-xl bg-neutral-800 border border-neutral-700 px-4 text-white placeholder:text-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* 카테고리 */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">제품 카테고리</label>
                <div className="flex flex-wrap gap-2">
                  {BRAND_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, category: cat }))}
                      className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${form.category === cat
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-neutral-800 border-neutral-700 text-neutral-300 hover:border-blue-500"
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* 추가 메시지 */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">추가 메시지 (선택)</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={3}
                  placeholder="브랜드 소개나 궁금한 점을 자유롭게 적어주세요."
                  className="rounded-xl bg-neutral-800 border border-neutral-700 px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={!form.category}
                className="mt-4 h-14 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 font-black rounded-xl text-lg"
              >
                <MessageCircle className="mr-2" size={20} />
                Line으로 문의하기
              </Button>
              <p className="text-center text-xs text-neutral-500">버튼을 누르면 Line 앱이 열립니다. 메시지를 전송해주세요.</p>
            </form>
          )}
        </motion.div>
      </section>
    </div>
  );
}
