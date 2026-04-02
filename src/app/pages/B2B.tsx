import { motion } from "motion/react";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Download, LayoutDashboard, Database, TrendingUp, PieChart, Users, ArrowUpRight, CheckCircle2 } from "lucide-react";

const DATA_POINTS = [
  { name: "Week 1", orders: 45, conversion: 12 },
  { name: "Week 2", orders: 82, conversion: 18 },
  { name: "Week 3", orders: 120, conversion: 24 },
  { name: "Week 4", orders: 152, conversion: 28 },
];

const SUCCESS_METRICS = [
  { title: "Average Conversion", value: "24.5%", change: "+5.2%", color: "text-green-600" },
  { title: "Pre-order Speed", value: "2.5x", change: "Faster", color: "text-blue-600" },
  { title: "Influencer Reach", value: "1.2M", change: "+120k", color: "text-purple-600" },
  { title: "Retargeting ROI", value: "380%", change: "+45%", color: "text-orange-600" },
];

export default function B2B() {
  return (
    <div className="flex flex-col gap-20 pb-20 bg-neutral-50 min-h-screen">
      {/* Header section */}
      <section className="bg-neutral-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 z-0">
          <ImageWithFallback src="https://images.unsplash.com/photo-1773096324746-c08da58bc620?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3YXJlaG91c2UlMjBsb2dpc3RpY3MlMjBzaGlwcGluZ3xlbnwxfHx8fDE3NzQ4NDU3MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="B2B background" className="h-full w-full object-cover" />
        </div>
        <div className="mx-auto max-w-7xl px-4 md:px-6 relative z-10 text-center md:text-left">
          <Badge className="mb-6 bg-[#0C3F80] border-none px-4 py-1 text-sm font-bold">FOR SELLERS & DISTRIBUTORS</Badge>
          <h1 className="text-4xl font-black md:text-6xl mb-6">Success Dashboard</h1>
          <p className="text-lg text-neutral-400 max-w-2xl mb-10 leading-relaxed">
            "실패 없는 K-브랜드 입점, 데이터로 제안합니다."<br />
            한국에서 유명한지보다, 여기서 잘 팔리는지가 중요합니다. 프리오더 완판 기록 + 실제 소비자 반응 리포트를 확인하세요.
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <Button size="lg" className="h-14 bg-white text-neutral-900 hover:bg-neutral-200 font-bold px-8">
              <Download className="mr-2" size={20} /> Download Sample Proposals
            </Button>
            <Button size="lg" className="h-14 bg-white text-neutral-900 hover:bg-neutral-100 font-bold px-8 shadow-lg border-none">
              Contact MD Team
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SUCCESS_METRICS.map((stat, i) => (
            <Card key={i} className="border-none shadow-xl bg-white p-6 rounded-2xl overflow-hidden">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold text-neutral-400 uppercase tracking-widest">{stat.title}</span>
                <span className="text-3xl font-black text-neutral-900">{stat.value}</span>
                <span className={`text-xs font-bold ${stat.color}`}>{stat.change} vs Last Campaign</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Visual Data Center */}
      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-semibold mb-2 uppercase tracking-widest text-xs">
              <Database size={16} />
              <span>Data Center</span>
            </div>
            <h2 className="text-3xl font-black md:text-4xl text-neutral-900">Market Potential Visualization</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-neutral-200 shadow-sm p-6 rounded-3xl overflow-hidden">
            <CardHeader className="p-0 mb-8">
              <CardTitle className="text-xl font-bold flex items-center justify-between">
                <span>Pre-order Growth Velocity</span>
                <Badge variant="outline" className="text-xs">Live Update</Badge>
              </CardTitle>
            </CardHeader>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DATA_POINTS}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="orders" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="border-neutral-200 shadow-sm p-6 rounded-3xl overflow-hidden">
            <CardHeader className="p-0 mb-8">
              <CardTitle className="text-xl font-bold flex items-center justify-between">
                <span>Cart Conversion Rate (%)</span>
                <Badge variant="outline" className="text-xs text-green-600 border-green-200">Optimal</Badge>
              </CardTitle>
            </CardHeader>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={DATA_POINTS}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="conversion" stroke="#2563eb" strokeWidth={4} dot={{ r: 6, fill: '#2563eb', strokeWidth: 0 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </section>

      {/* B2B Services */}
      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-10 rounded-3xl bg-white border border-neutral-200 flex flex-col gap-6">
            <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <LayoutDashboard size={28} />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900">Success Dashboard</h3>
            <p className="text-neutral-500 leading-relaxed">
              프리오더 속도, 장바구니 전환율 등 유통사 MD가 환영할 만한 지표 시각화. 실시간 데이터를 통한 매수 타이밍 결정.
            </p>
            <div className="flex items-center gap-2 text-blue-600 font-bold mt-auto group cursor-pointer">
              <span>Learn more</span>
              <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </div>

          <div className="p-10 rounded-3xl bg-white border border-neutral-200 flex flex-col gap-6">
            <div className="h-14 w-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
              <Users size={28} />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900">Consumer Feedback</h3>
            <p className="text-neutral-500 leading-relaxed">
              실제 소비자들이 남긴 정성적 데이터 분석 리포트 제공. 태국 소비자들의 기호와 거부 요인 심층 분석.
            </p>
            <div className="flex items-center gap-2 text-blue-600 font-bold mt-auto group cursor-pointer">
              <span>Learn more</span>
              <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </div>

          <div className="p-10 rounded-3xl bg-white border border-neutral-200 flex flex-col gap-6">
            <div className="h-14 w-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
              <TrendingUp size={28} />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900">Trend Predictions</h3>
            <p className="text-neutral-500 leading-relaxed">
              다음에 올 트렌드 예측 모델을 통한 선점 기회 제공. B&Y k-link만의 고유한 큐레이션 로직 기반 데이터.
            </p>
            <div className="flex items-center gap-2 text-blue-600 font-bold mt-auto group cursor-pointer">
              <span>Learn more</span>
              <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 mx-4 md:mx-6 rounded-[40px] py-20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
          <Database size={400} className="translate-x-1/2 -translate-y-1/4" />
        </div>
        <div className="mx-auto max-w-4xl px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-8">Ready to define the next trend?</h2>
          <p className="text-blue-100 text-lg mb-10 leading-relaxed">
            대형 유통망(7-11 등) 담당자를 위한 샘플 및 제안서가 준비되어 있습니다.<br />
            지금 바로 B&Y k-link의 검증된 데이터 파트너가 되세요.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-16 bg-white text-blue-600 hover:bg-neutral-100 font-black px-12 text-lg rounded-2xl w-full sm:w-auto shadow-xl">
              Apply for Sample
            </Button>
            <Button size="lg" variant="link" className="text-white font-bold h-16 underline underline-offset-4">
              Speak with a Trends Consultant
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
