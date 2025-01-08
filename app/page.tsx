import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { HandMetal, Brain, Video, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80 z-0" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-primary mb-6">
              SignEase
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Breaking communication barriers with real-time Indian Sign Language interpretation
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/translate">Start Translating</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/learn">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<HandMetal className="w-10 h-10" />}
              title="Real-time Recognition"
              description="Advanced gesture recognition using hybrid CNN-LSTM model for accurate ISL interpretation"
            />
            <FeatureCard
              icon={<Brain className="w-10 h-10" />}
              title="AI-Powered"
              description="Context-aware translations ensuring grammatically accurate and meaningful results"
            />
            <FeatureCard
              icon={<Video className="w-10 h-10" />}
              title="3D Avatar"
              description="Interactive 3D avatar demonstrating ISL gestures with natural expressions"
            />
            <FeatureCard
              icon={<MessageSquare className="w-10 h-10" />}
              title="Offline Support"
              description="Edge AI implementation for seamless usage without internet connectivity"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Bridge the Communication Gap?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join us in making communication accessible for everyone. Start using SignEase today.
          </p>
          <Button size="lg" asChild>
            <Link href="/signup">Get Started for Free</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <Card className="p-6 flex flex-col items-center text-center">
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Card>
  )
}