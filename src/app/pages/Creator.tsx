import { useState } from "react";
import { motion } from "motion/react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Star, Zap, Users, Play, Sparkles, TrendingUp, ShieldCheck, Heart, MessageCircle, CheckCircle2 } from "lucide-react";

const LINE_OA_URL = "https://line.me/R/ti/p/@KLINK_LINE_ID";

const BENEFITS = [
  { title: "Be the First", description: "아직 아무도 모르는 한국의 핫템을 가장 먼저 체험하고 트렌드 세터가 되세요.", icon: Zap },
  { title: "Exclusive Access", description: "B&Y k-link가 엄선한 라이징 브랜드와의 독점 협찬 기회 제공.", icon: Star },
  { title: "Performance Data", description: "본인의 콘텐츠로 발생한 프리오더 전환 확인 및 인센티브 지급 근거 마련.", icon: TrendingUp },
  { title: "Community Support", description: "한국 트렌드에 관심 있는 다른 크리에이터들과의 네트워킹 및 서울 현지 정보 공유.", icon: Users },
];

const UNRELEASED_STARS = [
  { id: 1, name: "Ice-Cooling Mist", brand: "Arctic Seoul", category: "Beauty", applicants: 45, slots: 10, image: "https://images.unsplash.com/photo-1741896135490-4062a3b21abf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBza2luY2FyZSUyMGJlYXV0eSUyMGNvc21ldGljc3xlbnwxfHx8fDE3NzQ4NDU3MDF8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 2, name: "Minimalist Messenger Bag", brand: "Seongsu Object", category: "Fashion", applicants: 120, slots: 20, image: "https://images.unsplash.com/photo-1582458574655-c5270fbe545d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBsaWZlc3R5bGUlMjBmYXNoaW9uJTIwdHJlbmR5JTIwc2hvcHxlbnwxfHx8fDE3NzQ4NDU3MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080" },
];

const CATEGORIES = ["Beauty / Skincare", "Fashion", "Food & Beverage", "Lifestyle", "Tech / Gadget", "Other"];

type FormState = {
  name: string;
  handle: string;
  platform: string;
  followers: string;
  category: string;
};

export default function Creator() {
  const [form, setForm] = useState<FormState>({
    name: "",
    handle: "",
    platform: "TikTok",
    followers: "",
    category: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const msg = encodeURIComponent(
      `[체험단 신청]\n이름: ${form.name}\n계정: @${form.handle} (${form.platform})\n팔로워: ${form.followers}\n관심 카테고리: ${form.category}`
    );
    window.open(`${LINE_OA_URL}?text=${msg}`, "_blank");
    setSubmitted(true);
  }

  return (
    <div className="flex flex-col gap-24 pb-24 bg-neutral-900 text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden border-b border-neutral-800">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 z-0">
          <ImageWithFallback src="https://images.unsplash.com/photo-1642011079531-95ad34d154e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwbGlmZXN0eWxlJTIwdGVlbmFnZXIlMjBzdHJlZXQlMjBmYXNoaW9uJTIwaW5mbHVlbmNlcnxlbnwxfHx8fDE3NzQ4NDU3MDR8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="Influencer vibe" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/50 to-transparent" />
        </div>
        <div className="mx-auto max-w-7xl px-4 md:px-6 relative z-10">
          <Badge className="mb-6 bg-[#0C3F80] hover:bg-[#0C3F80] border-none px-4 py-1 text-sm font-bold uppercase tracking-widest">FOR INFLUENCERS & MAKERS</Badge>
          <h1 className="text-5xl font-black md:text-7xl mb-8 leading-[1.1]">
            Be the First,<br />
            <span className="text-blue-400">Make the Trend.</span>
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mb-12 leading-relaxed">
            "당신의 리뷰가 이 브랜드를 태국 No.1으로 만듭니다."<br />
            B&Y k-link와 함께 한국의 숨은 보석을 찾아내고, 태국의 새로운 트렌드를 주도할 크리에이터들을 찾습니다.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#apply">
              <Button size="lg" className="h-16 bg-[#0C3F80] text-white hover:bg-blue-900 font-black px-12 text-lg rounded-2xl shadow-2xl">
                Apply to Program
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-black md:text-5xl mb-6">Creator Benefits</h2>
          <p className="text-neutral-500 max-w-2xl mx-auto">왜 B&Y k-link 크리에이터 파트너가 되어야 할까요? 우리가 제공하는 특별한 기회를 확인하세요.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {BENEFITS.map((benefit, i) => (
            <div key={i} className="flex flex-col gap-6 p-10 rounded-3xl bg-neutral-800 border border-neutral-700 transition-colors">
              <div className="h-16 w-16 bg-[#0C3F80]/20 text-blue-400 rounded-2xl flex items-center justify-center">
                <benefit.icon size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white">{benefit.title}</h3>
              <p className="text-neutral-400 leading-relaxed text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Unreleased Rising Stars */}
      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2 text-blue-400 font-semibold mb-2 uppercase tracking-widest text-xs">
              <Sparkles size={16} />
              <span>Coming Soon</span>
            </div>
            <h2 className="text-3xl font-black md:text-5xl">Be the First to Test</h2>
            <p className="mt-4 text-neutral-500 max-w-xl">아직 태국 시장에 공식 출시되지 않은 한국의 라이징 브랜드들을 만나보세요. 한정된 슬롯에 지금 바로 신청하세요.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {UNRELEASED_STARS.map((star) => (
            <Card key={star.id} className="bg-neutral-800 border-none rounded-[32px] overflow-hidden group">
              <div className="flex flex-col md:flex-row h-full">
                <div className="w-full md:w-2/5 aspect-square md:aspect-auto overflow-hidden">
                  <ImageWithFallback src={star.image} alt={star.name} className="h-full w-full object-cover transition-all duration-500" />
                </div>
                <CardContent className="flex-1 p-8 flex flex-col justify-between">
                  <div>
                    <Badge variant="outline" className="mb-4 border-neutral-700 text-neutral-400 font-bold">{star.category}</Badge>
                    <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">{star.brand}</div>
                    <h3 className="text-3xl font-black text-white mb-2">{star.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-neutral-400 mt-4">
                      <div className="flex items-center gap-1">
                        <Users size={16} />
                        <span>{star.applicants} Applicants</span>
                      </div>
                      <div className="flex items-center gap-1 text-blue-400 font-bold">
                        <Heart size={16} fill="currentColor" />
                        <span>Only {star.slots} Slots Left!</span>
                      </div>
                    </div>
                  </div>
                  <a href="#apply">
                    <Button className="mt-8 h-14 bg-blue-600 hover:bg-blue-700 font-black rounded-xl text-lg w-full">Apply Now</Button>
                  </a>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ── 체험단 신청 폼 ── */}
      <section id="apply" className="mx-auto max-w-3xl w-full px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[40px] bg-neutral-800 border border-neutral-700 p-10 md:p-14"
        >
          <div className="flex items-center gap-3 mb-2">
            <MessageCircle size={28} className="text-blue-400" />
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">체험단 신청</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">크리에이터 파트너 신청</h2>
          <p className="text-neutral-400 mb-10 text-sm leading-relaxed">
            아래 정보를 입력하면 담당자가 Official Line으로 연락드립니다.<br />
            신청 후 선발된 크리에이터에게만 제품이 발송됩니다.
          </p>

          {submitted ? (
            <div className="flex flex-col items-center gap-6 py-10">
              <div className="h-20 w-20 rounded-full bg-blue-600/20 flex items-center justify-center">
                <CheckCircle2 size={48} className="text-blue-400" />
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-white mb-2">신청 완료!</p>
                <p className="text-neutral-400">Line 앱에서 메시지를 전송해주시면 담당자가 검토 후 연락드립니다.</p>
              </div>
              <Button
                variant="outline"
                className="border-neutral-600 text-neutral-300 hover:bg-neutral-700"
                onClick={() => setSubmitted(false)}
              >
                다시 신청하기
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 이름 */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">이름 / Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="홍길동"
                    className="h-12 rounded-xl bg-neutral-700 border border-neutral-600 px-4 text-white placeholder:text-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                {/* 계정 */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">소셜 계정 Handle</label>
                  <div className="flex gap-2">
                    <span className="flex items-center px-3 rounded-xl bg-neutral-700 border border-neutral-600 text-neutral-400 text-sm">@</span>
                    <input
                      name="handle"
                      value={form.handle}
                      onChange={handleChange}
                      required
                      placeholder="your_handle"
                      className="flex-1 h-12 rounded-xl bg-neutral-700 border border-neutral-600 px-4 text-white placeholder:text-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 플랫폼 */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">주요 플랫폼</label>
                  <select
                    name="platform"
                    value={form.platform}
                    onChange={handleChange}
                    className="h-12 rounded-xl bg-neutral-700 border border-neutral-600 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option>TikTok</option>
                    <option>Instagram</option>
                    <option>YouTube</option>
                    <option>TikTok + Instagram</option>
                  </select>
                </div>
                {/* 팔로워 */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">팔로워 수</label>
                  <select
                    name="followers"
                    value={form.followers}
                    onChange={handleChange}
                    required
                    className="h-12 rounded-xl bg-neutral-700 border border-neutral-600 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="" disabled>선택하세요</option>
                    <option>1,000 – 10,000</option>
                    <option>10,000 – 50,000</option>
                    <option>50,000 – 100,000</option>
                    <option>100,000+</option>
                  </select>
                </div>
              </div>

              {/* 관심 카테고리 */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">관심 카테고리</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, category: cat }))}
                      className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${form.category === cat
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-neutral-700 border-neutral-600 text-neutral-300 hover:border-blue-500"
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={!form.category}
                className="mt-4 h-14 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 font-black rounded-xl text-lg"
              >
                <MessageCircle className="mr-2" size={20} />
                Line으로 신청하기
              </Button>
              <p className="text-center text-xs text-neutral-500">신청 버튼을 누르면 Line 앱이 열립니다. 메시지를 전송해주세요.</p>
            </form>
          )}
        </motion.div>
      </section>

      {/* Bottom CTA */}
      <section className="text-center px-4">
        <h2 className="text-4xl md:text-6xl font-black mb-12">Start your trend journey.</h2>
        <a href="#apply">
          <Button size="lg" className="h-20 bg-blue-600 hover:bg-blue-700 font-black px-16 text-2xl rounded-2xl shadow-blue-600/20 shadow-2xl transition-all hover:scale-105 active:scale-95">
            Join B&Y k-link Makers
          </Button>
        </a>
      </section>
    </div>
  );
}
