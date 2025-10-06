'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Play } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { AspectRatio } from '@/components/ui/aspect-ratio'

type DIYProject = {
  title: string
  description: string
  image: string
  difficulty: string
  time: string
  cost: string
  videoUrl: string
  guideUrl: string
}

type Props = {
  projects: DIYProject[]
}

export default function DIYVideosGrid({ projects }: Props) {
  const [open, setOpen] = useState(false)
  const [activeProject, setActiveProject] = useState<DIYProject | null>(null)

  const embedUrl = useMemo(() => {
    if (!activeProject?.videoUrl) return ''
    try {
      const url = new URL(activeProject.videoUrl)
      // Support typical YouTube watch URLs: https://www.youtube.com/watch?v=VIDEO_ID
      const videoId = url.searchParams.get('v') || url.pathname.split('/').pop() || ''
      if (!videoId) return ''
      const params = new URLSearchParams({ autoplay: '1', rel: '0', modestbranding: '1' })
      return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
    } catch {
      return ''
    }
  }, [activeProject])

  const openVideo = (project: DIYProject) => {
    setActiveProject(project)
    if (project.videoUrl) setOpen(true)
  }

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <Card key={index} className="hover:shadow-xl transition-shadow overflow-hidden">
            <div className="aspect-video relative">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-white" onClick={() => openVideo(project)}>
                  <Play className="mr-2 h-5 w-5" />
                  Watch Video
                </Button>
              </div>
              <div className="absolute top-4 left-4">
                <span className="bg-[#F5DD22] text-[#0a4768] px-3 py-1 rounded-full text-sm font-medium">
                  {project.difficulty}
                </span>
              </div>
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-[#0a4768] mb-3">
                {project.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {project.description}
              </p>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 border-[#0a4768] text-[#0a4768] hover:bg-[#0a4768] hover:text-white" onClick={() => openVideo(project)} disabled={!project.videoUrl}>
                  <Play className="mr-2 h-4 w-4" />
                  Video
                </Button>
                <Button asChild variant="outline" size="sm" className="flex-1 border-[#0a4768] text-[#0a4768] hover:bg-[#0a4768] hover:text-white">
                  <Link href={project.guideUrl}>
                    Guide
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={(o) => { if (!o) setActiveProject(null); setOpen(o) }}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden">
          <DialogTitle className="sr-only">{activeProject?.title}</DialogTitle>
          <AspectRatio ratio={16 / 9}>
            {embedUrl ? (
              <iframe
                src={embedUrl}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-black/5 text-sm text-gray-600">
                Video not available
              </div>
            )}
          </AspectRatio>
        </DialogContent>
      </Dialog>
    </>
  )
}


