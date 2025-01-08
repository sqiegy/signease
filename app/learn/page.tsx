"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { BookOpen, Video, MessageSquare } from "lucide-react"

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Learn ISL</h1>
          <Button asChild variant="outline">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <BookOpen className="w-12 h-12 text-primary" />
              <h2 className="text-xl font-semibold">Basics</h2>
              <p className="text-muted-foreground">Learn the fundamental signs and gestures of Indian Sign Language</p>
              <Button className="w-full">Start Learning</Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Video className="w-12 h-12 text-primary" />
              <h2 className="text-xl font-semibold">Video Tutorials</h2>
              <p className="text-muted-foreground">Watch comprehensive video lessons from expert ISL instructors</p>
              <Button className="w-full">Watch Videos</Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <MessageSquare className="w-12 h-12 text-primary" />
              <h2 className="text-xl font-semibold">Practice</h2>
              <p className="text-muted-foreground">Interactive exercises to practice your ISL skills</p>
              <Button className="w-full">Start Practice</Button>
            </div>
          </Card>
        </div>

        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-bold mb-4">Learning Path</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">1</div>
              <div>
                <h3 className="font-semibold">Basic Signs</h3>
                <p className="text-muted-foreground">Learn everyday signs and basic communication</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">2</div>
              <div>
                <h3 className="font-semibold">Sentence Structure</h3>
                <p className="text-muted-foreground">Understand ISL grammar and sentence formation</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">3</div>
              <div>
                <h3 className="font-semibold">Advanced Communication</h3>
                <p className="text-muted-foreground">Master complex conversations and expressions</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}