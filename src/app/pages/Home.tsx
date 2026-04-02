import { motion } from "motion/react";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { TrendingUp, Play, Users, ArrowRight, ShieldCheck, Zap, Globe } from "lucide-react";

const RISING_STARS = [
  {
    id: "1",
    name: "Seongsu Glow Serum",
    brand: "Seoul Lab",
    description: "The #1 viral serum from Seongsu-dong pop-up stores, now available for Thai skin types.",
    image: "https://images.unsplash.com/photo-1741896135490-4062a3b21abf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBza2luY2FyZSUyMGJlYXV0eSUyMGNvc21ldGljc3xlbnwxfHx8fDE3NzQ4NDU3MDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    preOrderCount: 152,
    targetCount: 200,
    status: "Trending",
  },
  {
    id: "2",
    name: "K-Street Oversized Tee",
    brand: "Studio M",
    description: "Designed by Seoul's rising street fashion collective. High-quality cotton with unique graphics.",
    image: "https://images.unsplash.com/photo-1582458574655-c5270fbe545d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBsaWZlc3R5bGUlMjBmYXNoaW9uJTIwdHJlbmR5JTIwc2hvcHxlbnwxfHx8fDE3NzQ4NDU3MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    preOrderCount: 85,
    targetCount: 150,
    status: "Limited",
  },
  {
    id: "3",
    name: "Vegan Tint Balm",
    brand: "Pure Seoul",
    description: "Eco-friendly, vegan formula with vibrant K-colors. Exclusive Thai-inspired shades.",
    image: "https://images.unsplash.com/photo-1621269050686-13387e760500?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW91bCUyMHNlb25nc3UlMjBkb25nJTIwc3RyZWV0JTIwY2FmZXxlbnwxfHx8fDE3NzQ4NDU3MDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    preOrderCount: 188,
    targetCount: 200,
    status: "Almost Full",
  }
];

const VIRAL_VIDEOS = [
  { id: 1, thumbnail: "https://images.unsplash.com/photo-1642011079531-95ad34d154e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwbGlmZXN0eWxlJTIwdGVlbmFnZXIlMjBzdHJlZXQlMjBmYXNoaW9uJTIwaW5mbHVlbmNlcnxlbnwxfHx8fDE3NzQ4NDU3MDR8MA&ixlib=rb-4.1.0&q=80&w=1080", author: "@Nicha_K", views: "45K" },
  { id: 2, thumbnail: "https://images.unsplash.com/photo-1642011079531-95ad34d154e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwbGlmZXN0eWxlJTIwdGVlbmFnZXIlMjBzdHJlZXQlMjBmYXNoaW9uJTIwaW5mbHVlbmNlcnxlbnwxfHx8fDE3NzQ4NDU3MDR8MA&ixlib=rb-4.1.0&q=80&w=1080", author: "@K_BeautyExpert", views: "128K" },
  { id: 3, thumbnail: "https://images.unsplash.com/photo-1642011079531-95ad34d154e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwbGlmZXN0eWxlJTIwdGVlbmFnZXIlMjBzdHJlZXQlMjBmYXNoaW9uJTIwaW5mbHVlbmNlcnxlbnwxfHx8fDE3NzQ4NDU3MDR8MA&ixlib=rb-4.1.0&q=80&w=1080", author: "@SeoulVibes_TH", views: "82K" },
  { id: 4, thumbnail: "https://images.unsplash.com/photo-1642011079531-95ad34d154e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwbGlmZXN0eWxlJTIwdGVlbmFnZXIlMjBzdHJlZXQlMjBmYXNoaW9uJTIwaW5mbHVlbmNlcnxlbnwxfHx8fDE3NzQ4NDU3MDR8MA&ixlib=rb-4.1.0&q=80&w=1080", author: "@Trend_Finder", views: "31K" },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden bg-neutral-900">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1621269050686-13387e760500?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW91bCUyMHNlb25nc3UlMjBkb25nJTIwc3RyZWV0JTIwY2FmZXxlbnwxfHx8fDE3NzQ4NDU3MDF8MA&ixlib=rb-4.1.0&q=80&w=1080" 
            alt="Seoul Seongsu-dong" 
            className="h-full w-full object-cover opacity-60 brightness-75 transition-transform duration-[10s] hover:scale-110"
          />
        </div>
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <Badge className="mb-6 bg-blue-600 hover:bg-blue-700 text-sm py-1 px-3">K-Trend Incubator</Badge>
            <h1 className="text-5xl font-extrabold tracking-tight text-white md:text-7xl lg:text-8xl">
              First Choice,<br />
              <span className="text-blue-400">Next Trend.</span>
            </h1>
            <p className="mt-6 text-lg text-neutral-300 md:text-xl leading-relaxed">
              We discover Seoul's hidden gems and transform them into Thailand's next big trends. Your choice defines what's next.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button size="lg" className="h-14 bg-blue-600 px-8 hover:bg-blue-700">
                Explore Rising Stars
              </Button>
              <Button size="lg" className="h-14 bg-white text-neutral-900 hover:bg-neutral-100 font-bold border-none shadow-lg">
                Join Creator Lounge
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Curated Selection: Seoul's Rising Stars */}
      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-semibold mb-2">
              <TrendingUp size={20} />
              <span>Curated Selection</span>
            </div>
            <h2 className="text-3xl font-bold md:text-4xl text-neutral-900">Seoul's Rising Stars</h2>
            <p className="mt-2 text-neutral-500 max-w-lg">
              B&Y k-link가 이번 주 서울 성수동 팝업스토어에서 가장 주목받은 라이징 루키들을 픽업했습니다.
            </p>
          </div>
          <Link to="/campaigns" className="flex items-center gap-1 font-medium text-blue-600 hover:underline">
            View all collections <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {RISING_STARS.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="group overflow-hidden border-neutral-200 bg-white transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <ImageWithFallback 
                    src={product.image} 
                    alt={product.name} 
                    className="h-full w-full object-cover transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-neutral-900 backdrop-blur-sm border-none shadow-sm">{product.status}</Badge>
                  </div>
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Link to={`/campaign/${product.id}`}>
                      <Button className="bg-[#0C3F80] text-white hover:bg-blue-900 font-black shadow-2xl px-8 h-12 rounded-xl border border-white/20">View Details</Button>
                    </Link>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="mb-1 text-xs font-bold text-blue-600 uppercase tracking-wider">{product.brand}</div>
                  <h3 className="mb-2 text-xl font-bold text-neutral-900">{product.name}</h3>
                  <p className="mb-6 text-sm text-neutral-500 line-clamp-2">{product.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-neutral-700">The Proof: {product.preOrderCount} Reserved</span>
                      <span className="text-neutral-400">Target {product.targetCount}</span>
                    </div>
                    <Progress value={(product.preOrderCount / product.targetCount) * 100} className="h-2" />
                    <p className="text-[11px] text-neutral-400 font-medium">
                      {product.targetCount - product.preOrderCount} more pre-orders to confirm official import!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Live Viral Feed */}
      <section className="bg-neutral-100 py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold md:text-4xl text-neutral-900 mb-4">Live Viral Feed</h2>
            <p className="text-neutral-500 mx-auto max-w-2xl">
              "이거 진짜 물건이다"라고 반응하는 태국 현지 인플루언서들의 실시간 숏폼 영상을 확인하세요.
            </p>
          </div>

          <div className="flex overflow-x-auto pb-8 gap-6 no-scrollbar snap-x">
            {VIRAL_VIDEOS.map((video) => (
              <div key={video.id} className="min-w-[280px] md:min-w-[320px] snap-center">
                <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-neutral-300 group shadow-lg">
                  <ImageWithFallback 
                    src={video.thumbnail} 
                    alt={`Viral video by ${video.author}`} 
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0C3F80]/50 backdrop-blur-md p-4 rounded-full opacity-90 shadow-xl border border-white/20">
                    <Play className="text-white fill-white ml-1" size={32} />
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <p className="font-bold text-lg mb-1">{video.author}</p>
                    <div className="flex items-center gap-2 text-sm opacity-80">
                      <Users size={14} />
                      <span>{video.views} views</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3-Track CTA Section */}
      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-neutral-100 text-neutral-900 flex flex-col justify-between h-full border border-neutral-200">
            <div>
              <Globe size={40} className="mb-6 text-[#0C3F80]" />
              <h3 className="text-2xl font-black mb-4">For K-Brands</h3>
              <p className="text-neutral-500 text-sm mb-8 leading-relaxed">
                "태국 진출, 샘플 발송만으로 시작하세요."<br />
                복잡한 통관과 물류 없이 현지 시장성을 데이터로 검증합니다.
              </p>
            </div>
            <Link to="/brands">
              <Button size="lg" className="bg-[#0C3F80] text-white hover:bg-blue-900 w-full h-14 font-bold text-base rounded-xl">
                Enter Brand Center
              </Button>
            </Link>
          </div>

          <div className="p-8 rounded-3xl bg-neutral-900 text-white flex flex-col justify-between h-full">
            <div>
              <Zap size={40} className="mb-6 text-blue-400" />
              <h3 className="text-2xl font-black mb-4">For Creators</h3>
              <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
                "아직 아무도 모르는 한국의 핫템, 첫 주인공이 되세요."<br />
                당신의 리뷰가 이 브랜드를 태국 No.1으로 만듭니다.
              </p>
            </div>
            <Link to="/creator">
              <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700 w-full h-14 font-bold text-base rounded-xl">
                Join Creator Lounge
              </Button>
            </Link>
          </div>

          <div className="p-8 rounded-3xl bg-[#0C3F80] text-white flex flex-col justify-between h-full">
            <div>
              <ShieldCheck size={40} className="mb-6 opacity-80" />
              <h3 className="text-2xl font-black mb-4">For Sellers</h3>
              <p className="text-blue-100 text-sm mb-8 leading-relaxed">
                "실패 없는 K-브랜드 입점, 데이터로 제안합니다."<br />
                한국에서 유명한지보다, 태국 현지 데이터가 중요합니다.
              </p>
            </div>
            <Link to="/b2b">
              <Button size="lg" className="bg-white text-[#0C3F80] hover:bg-neutral-100 w-full h-14 font-bold text-base rounded-xl">
                Enter Seller Hub
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
