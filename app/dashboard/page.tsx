"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"

interface Translation {
  id: string
  source_text: string
  translated_text: string | null
  source_type: "video" | "text"
  created_at: string
  status: "pending" | "completed" | "failed"
}

export default function DashboardPage() {
  const router = useRouter()
  const [translations, setTranslations] = useState<Translation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth")
      } else {
        fetchTranslations()
      }
    }

    checkUser()
  }, [router])

  const fetchTranslations = async () => {
    const { data, error } = await supabase
      .from("translations")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setTranslations(data)
    }
    setLoading(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="space-x-4">
            <Button onClick={() => router.push("/translate")} variant="secondary">
              New Translation
            </Button>
            <Button onClick={handleSignOut} variant="outline">
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Total Translations</h3>
            <p className="text-3xl font-bold">{translations.length}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Completed</h3>
            <p className="text-3xl font-bold">
              {translations.filter(t => t.status === "completed").length}
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Pending</h3>
            <p className="text-3xl font-bold">
              {translations.filter(t => t.status === "pending").length}
            </p>
          </Card>
        </div>

        <Card className="p-6">
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Translations</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="space-y-4">
                {translations.map((translation) => (
                  <Card key={translation.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{translation.source_text}</p>
                        {translation.translated_text && (
                          <p className="text-muted-foreground mt-1">
                            {translation.translated_text}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground mt-2">
                          {format(new Date(translation.created_at), "PPp")}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-sm ${
                        translation.status === "completed" 
                          ? "bg-green-100 text-green-800" 
                          : translation.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {translation.status}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="completed">
              <div className="space-y-4">
                {translations
                  .filter(t => t.status === "completed")
                  .map((translation) => (
                    <Card key={translation.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{translation.source_text}</p>
                          <p className="text-muted-foreground mt-1">
                            {translation.translated_text}
                          </p>
                          <p className="text-sm text-muted-foreground mt-2">
                            {format(new Date(translation.created_at), "PPp")}
                          </p>
                        </div>
                        <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                          completed
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="pending">
              <div className="space-y-4">
                {translations
                  .filter(t => t.status === "pending")
                  .map((translation) => (
                    <Card key={translation.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{translation.source_text}</p>
                          <p className="text-sm text-muted-foreground mt-2">
                            {format(new Date(translation.created_at), "PPp")}
                          </p>
                        </div>
                        <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                          pending
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}