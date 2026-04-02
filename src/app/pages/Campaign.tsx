import { motion } from "motion/react";
import { useParams, Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ShoppingCart, CheckCircle, Clock, Share2, Instagram, MessageCircle, Star } from "lucide-react";

const PRODUCTS = {
  "1": {
    name: "Seongsu Glow Serum",
    brand: "Seoul Lab",
    description: "The #1 viral serum from Seongsu-dong pop-up stores, now available for Thai skin types.",
    image: "https://images.unsplash.com/photo-1741896135490-4062a3b21abf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBza2luY2FyZSUyMGJlYXV0eSUyMGNvc21ldGljc3xlbnwxfHx8fDE3NzQ4NDU3MDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    price: "฿1,250",
    originalPrice: "฿1,590",
    preOrderCount: 152,
    targetCount: 200,
    daysLeft: 5,
    story: "Seoul Lab's Glow Serum isn't just another skincare product; it's the result of 3 years of research in Seongsu-dong, Seoul's most trend-forward district. After becoming a sensation at multiple pop-up stores, B&Y k-link has brought it to Thailand. We've optimized the formula to handle the tropical humidity while providing that signature 'Glass Skin' look.",
    features: [
      "Optimized for Thai tropical climate",
      "Non-sticky, fast-absorbing formula",
      "Natural brightening ingredients from Jeju Island",
      "Dermatologically tested for sensitive skin"
    ],
    reviews: [
      { id: 1, author: "@Nicha_K", rating: 5, content: "Finally it's here! I saw this on TikTok when my friend visited Seoul. The glow is real.", avatar: "https://images.unsplash.com/photo-1642011079531-95ad34d154e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwbGlmZXN0eWxlJTIwdGVlbmFnZXIlMjBzdHJlZXQlMjBmYXNoaW9uJTIwaW5mbHVlbmNlcnxlbnwxfHx8fDE3NzQ4NDU3MDR8MA&ixlib=rb-4.1.0&q=80&w=1080" },
      { id: 2, author: "@Beam_Beauty", rating: 4, content: "Good texture for Bangkok heat. Not too oily.", avatar: "https://images.unsplash.com/photo-1642011079531-95ad34d154e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwbGlmZXN0eWxlJTIwdGVlbmFnZXIlMjBzdHJlZXQlMjBmYXNoaW9uJTIwaW5mbHVlbmNlcnxlbnwxfHx8fDE3NzQ4NDU3MDR8MA&ixlib=rb-4.1.0&q=80&w=1080" }
    ]
  },
  "2": {
    name: "K-Street Oversized Tee",
    brand: "Studio M",
    description: "Designed by Seoul's rising street fashion collective. High-quality cotton with unique graphics.",
    image: "https://images.unsplash.com/photo-1582458574655-c5270fbe545d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBsaWZlc3R5bGUlMjBmYXNoaW9uJTIwdHJlbmR5JTIwc2hvcHxlbnwxfHx8fDE3NzQ4NDU3MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    price: "฿890",
    originalPrice: "฿1,200",
    preOrderCount: 85,
    targetCount: 150,
    daysLeft: 12,
    story: "Studio M is a collective of young designers in Seoul. Their designs reflect the energetic and experimental street culture of Hongdae and Seongsu. This oversized tee is their first official entry into the international market, exclusive to B&Y k-link.",
    features: [
      "100% Premium Korean Cotton",
      "Hand-screened original graphics",
      "Relaxed fit for all body types",
      "Limited edition run"
    ],
    reviews: []
  },
  "3": {
    name: "Vegan Tint Balm",
    brand: "Pure Seoul",
    description: "Eco-friendly, vegan formula with vibrant K-colors. Exclusive Thai-inspired shades.",
    image: "https://images.unsplash.com/photo-1621269050686-13387e760500?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW91bCUyMHNlb25nc3UlMjBkb25nJTIwc3RyZWV0JTIwY2FmZXxlbnwxfHx8fDE3NzQ4NDU3MDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    price: "฿450",
    originalPrice: "฿650",
    preOrderCount: 188,
    targetCount: 200,
    daysLeft: 2,
    story: "Pure Seoul is at the forefront of the vegan K-beauty movement. This Tint Balm provides moisture and natural color without any animal-derived ingredients. We worked with them to create shades that specifically complement Thai skin tones.",
    features: [
      "100% Vegan & Cruelty-free",
      "Moisturizing with shea butter",
      "Long-lasting stain effect",
      "Sustainably packaged"
    ],
    reviews: []
  }
};

export default function Campaign() {
  const { id } = useParams();
  const product = PRODUCTS[id as keyof typeof PRODUCTS] || PRODUCTS["1"];

  const progress = (product.preOrderCount / product.targetCount) * 100;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-[4/5] overflow-hidden rounded-3xl bg-neutral-200 shadow-lg"
          >
            <ImageWithFallback 
              src={product.image} 
              alt={product.name} 
              className="h-full w-full object-cover"
            />
          </motion.div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-xl bg-neutral-200 overflow-hidden cursor-pointer opacity-50 hover:opacity-100 transition-opacity">
                <ImageWithFallback src={product.image} alt="Thumbnail" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Info & CTA */}
        <div className="flex flex-col gap-8">
          <div>
            <Badge className="mb-4 bg-blue-100 text-blue-600 hover:bg-blue-100 border-none font-bold">
              THE TESTING LAB
            </Badge>
            <div className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-1">{product.brand}</div>
            <h1 className="text-4xl font-black text-neutral-900 md:text-5xl lg:text-6xl">{product.name}</h1>
          </div>

          <div className="flex items-baseline gap-4">
            <span className="text-3xl font-black text-blue-600">{product.price}</span>
            <span className="text-xl text-neutral-400 line-through font-medium">{product.originalPrice}</span>
            <Badge variant="outline" className="border-blue-600 text-blue-600 font-bold">
              Early Bird 30% OFF
            </Badge>
          </div>

          <div className="rounded-2xl bg-neutral-100 p-6 border border-neutral-200">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="text-blue-600" size={18} />
                <span className="font-bold text-neutral-700">{product.daysLeft} days left</span>
              </div>
              <div className="text-sm font-medium text-neutral-500">
                <span className="text-neutral-900 font-bold">{product.preOrderCount}</span> / {product.targetCount} Reserved
              </div>
            </div>
            <Progress value={progress} className="h-3 mb-4" />
            <p className="text-sm text-neutral-500 font-medium">
              {progress >= 100 
                ? "Target achieved! This product will be officially imported." 
                : `${product.targetCount - product.preOrderCount} more orders needed to confirm official import to Thailand.`}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button size="lg" className="h-16 bg-blue-600 hover:bg-blue-700 text-lg font-bold">
              <ShoppingCart className="mr-2" size={20} /> Pre-order Now
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 h-12 border-neutral-200 text-neutral-600">
                <Share2 className="mr-2" size={18} /> Share Trend
              </Button>
              <Button variant="outline" className="h-12 border-neutral-200 px-4 text-neutral-600">
                <Star size={18} />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4 py-6 border-y border-neutral-100">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <CheckCircle size={20} />
              </div>
              <p className="text-sm font-semibold text-neutral-700">"K-Beauty 전문가들이 태국 피부 타입을 위해 엄선한 Exclusive Item"</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-600">
                <CheckCircle size={20} />
              </div>
              <p className="text-sm font-semibold text-neutral-700">100% Authentic Korean Product</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-20">
        <Tabs defaultValue="story" className="w-full">
          <TabsList className="mb-8 w-full justify-start border-b border-neutral-200 bg-transparent p-0 rounded-none">
            <TabsTrigger value="story" className="px-8 py-3 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none">The Story</TabsTrigger>
            <TabsTrigger value="features" className="px-8 py-3 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none">Details</TabsTrigger>
            <TabsTrigger value="reviews" className="px-8 py-3 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none">Social Buzz</TabsTrigger>
          </TabsList>
          
          <TabsContent value="story" className="max-w-3xl">
            <div className="prose prose-neutral">
              <h3 className="text-2xl font-bold mb-4">Why this matters in Thailand?</h3>
              <p className="text-neutral-600 leading-relaxed mb-6">{product.story}</p>
              <p className="text-neutral-600 leading-relaxed">
                As a 'Trend Incubator', B&Y k-link doesn't just sell products. We validate them through the community. Your pre-order is your vote for this brand to establish its first official presence in the Thai market.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="features">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white border border-neutral-100">
                  <div className="h-2 w-2 rounded-full bg-blue-600" />
                  <span className="font-medium text-neutral-700">{feature}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {product.reviews.length > 0 ? (
                product.reviews.map((review) => (
                  <div key={review.id} className="p-6 rounded-2xl bg-white border border-neutral-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <ImageWithFallback src={review.avatar} alt={review.author} className="h-12 w-12 rounded-full object-cover" />
                      <div>
                        <div className="font-bold text-neutral-900">{review.author}</div>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />)}
                        </div>
                      </div>
                    </div>
                    <p className="text-neutral-600 italic">"{review.content}"</p>
                    <div className="mt-4 flex items-center gap-4 text-neutral-400">
                      <Instagram size={18} />
                      <MessageCircle size={18} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 py-12 text-center text-neutral-400 font-medium bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
                  Be the first to share your buzz about this rising star!
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
