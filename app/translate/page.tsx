"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Type, Camera } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import Webcam from "react-webcam"
import { loadHandposeModel, detectHandGestures } from "@/lib/ml/handpose"
import { supabase } from "@/lib/supabase"

export default function TranslatePage() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [text, setText] = useState("")
  const [isWebcamActive, setIsWebcamActive] = useState(false)
  const [detectedGestures, setDetectedGestures] = useState<string[]>([])
  const [isModelLoading, setIsModelLoading] = useState(false)
  const webcamRef = useRef<Webcam>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isWebcamActive) {
      initializeHandpose();
    }
  }, [isWebcamActive]);

  const initializeHandpose = async () => {
    setIsModelLoading(true);
    try {
      await loadHandposeModel();
      if (webcamRef.current) {
        startGestureDetection();
      }
    } catch (error) {
      console.error('Failed to load handpose model:', error);
    }
    setIsModelLoading(false);
  };

  const startGestureDetection = async () => {
    const video = webcamRef.current?.video;
    if (!video) return;

    const detectFrame = async () => {
      try {
        const gesture = await detectHandGestures(video);
        if (gesture) {
          setDetectedGestures(prev => [...prev, gesture.name]);
        }
      } catch (error) {
        console.error('Error detecting gestures:', error);
      }
      
      if (isWebcamActive) {
        requestAnimationFrame(detectFrame);
      }
    };

    detectFrame();
  };

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setLoading(true);

      try {
        // Create a translation record
        const { data, error } = await supabase
          .from('translations')
          .insert([
            {
              source_type: 'video',
              source_text: file.name,
              status: 'pending'
            }
          ])
          .select()

        if (error) throw error;

        // Process video frames here
        // This would typically be handled by a backend service
        // For now, we'll just update the status after a delay
        setTimeout(async () => {
          await supabase
            .from('translations')
            .update({ 
              status: 'completed',
              translated_text: 'Sample translation for video'
            })
            .eq('id', data[0].id)

          setLoading(false);
        }, 2000);

      } catch (error) {
        console.error('Error processing video:', error);
        setLoading(false);
      }
    }
  }

  const handleTextSubmit = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('translations')
        .insert([
          {
            source_type: 'text',
            source_text: text,
            status: 'pending'
          }
        ])
        .select()

      if (error) throw error;

      // Simulate processing delay
      setTimeout(async () => {
        await supabase
          .from('translations')
          .update({ 
            status: 'completed',
            translated_text: 'Sample ISL translation'
          })
          .eq('id', data[0].id)

        setLoading(false);
      }, 1500);

    } catch (error) {
      console.error('Error translating text:', error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Sign Language Translator</h1>
        
        <Tabs defaultValue="video" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="video">Video to Text</TabsTrigger>
            <TabsTrigger value="text">Text to Sign</TabsTrigger>
          </TabsList>
          
          <TabsContent value="video">
            <Card className="p-6">
              <div className="flex flex-col items-center gap-4">
                {isWebcamActive ? (
                  <div className="w-full max-w-2xl">
                    <Webcam
                      ref={webcamRef}
                      mirrored
                      className="w-full rounded-lg"
                    />
                    {detectedGestures.length > 0 && (
                      <div className="mt-4">
                        <h3 className="font-semibold mb-2">Detected Signs:</h3>
                        <p>{detectedGestures.join(" ")}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-64 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted">
                    {videoFile ? (
                      <video
                        src={URL.createObjectURL(videoFile)}
                        controls
                        className="max-h-full"
                      />
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          Upload a video or use webcam
                        </p>
                      </div>
                    )}
                  </div>
                )}
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                  id="video-upload"
                />
                <div className="flex gap-4">
                  <Button asChild disabled={loading || isWebcamActive}>
                    <label htmlFor="video-upload">
                      {loading ? "Processing..." : "Upload Video"}
                    </label>
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setIsWebcamActive(!isWebcamActive)}
                    disabled={loading}
                  >
                    {isWebcamActive ? (
                      <>Stop Webcam</>
                    ) : (
                      <>
                        <Camera className="w-4 h-4 mr-2" />
                        Use Webcam
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="text">
            <Card className="p-6">
              <div className="flex flex-col gap-4">
                <Textarea
                  placeholder="Enter text to translate to ISL..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={handleTextSubmit}
                    disabled={loading || !text.trim()}
                  >
                    {loading ? "Translating..." : "Translate to ISL"}
                  </Button>
                </div>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <Type className="h-12 w-12 text-muted-foreground" />
                  <p className="ml-2 text-muted-foreground">
                    3D Avatar will appear here
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}