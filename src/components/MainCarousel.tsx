"use client"
import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import { useSidebar } from "@/components/ui/sidebar"

interface Slide {
  src: string
  caption: string
  description: string
}

const slides: Slide[] = [
  {
    src: "/images/img1.jpg",
    caption: "Early Life and Beginnings",
    description:
      "Cristiano Ronaldo was born on February 5, 1985, in Madeira, Portugal. He showed incredible talent from a young age and joined Sporting Lisbon's youth academy. His speed, skills, and determination quickly caught the attention of scouts from top European clubs.",
  },
  {
    src: "/images/img2.jpg",
    caption: "Rise to Stardom at Manchester United",
    description:
      "Ronaldo joined Manchester United in 2003 when he was just 18. Under Sir Alex Ferguson's guidance, he became one of the world's top players. He helped the team win three Premier League titles and a UEFA Champions League trophy in 2008.",
  },
  {
    src: "/images/img3.jpg",
    caption: "Real Madrid and Breaking Records",
    description:
      "In 2009, Ronaldo transferred to Real Madrid for a then-world record fee. He became the club’s all-time top scorer, winning four Champions League titles and multiple individual awards. His goal-scoring ability amazed fans across the world.",
  },
  {
    src: "/images/img4.jpg",
    caption: "Legacy and Impact",
    description:
      "Beyond his football skills, Ronaldo is admired for his work ethic, leadership, and charity efforts. He is considered one of the greatest footballers in history, inspiring millions of young athletes to chase their dreams.",
  },
]

export default function MainCarousel() {
  const plugin = React.useMemo(
    () =>
      Autoplay({
        delay: 2500,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    []
  )

  const nextRef = React.useRef<HTMLButtonElement>(null)
  const prevRef = React.useRef<HTMLButtonElement>(null)

  const touchStart = React.useRef<number | null>(null)
  const touchEnd = React.useRef<number | null>(null)
  const swipeThreshold = 50

  const handleTouchStart = React.useCallback((e: React.TouchEvent) => {
    touchStart.current = e.targetTouches[0].clientX
  }, [])

  const handleTouchMove = React.useCallback((e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX
  }, [])

  const handleTouchEnd = React.useCallback(() => {
    if (touchStart.current === null || touchEnd.current === null) return
    const distance = touchStart.current - touchEnd.current

    if (distance > swipeThreshold) {
      nextRef.current?.click()
    }
    if (distance < -swipeThreshold) {
      prevRef.current?.click()
    }

    touchStart.current = null
    touchEnd.current = null
  }, [])

  const { open, isMobile } = useSidebar()
  const sidebarWidth = 256
  const sidebarIconWidth = 48

  const paddingLeft = React.useMemo(() => {
    if (isMobile) return 0
    return open ? sidebarWidth : sidebarIconWidth + 300
  }, [isMobile, open])

  const containerStyle: React.CSSProperties = {
    paddingLeft,
    paddingRight: 0,
    transition: "padding-left 0.3s ease",
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      aria-live="polite"
      style={containerStyle}
    >
      <Carousel
        plugins={[plugin]}
        className="w-full max-w-[90vw] sm:max-w-lg md:max-w-xl"
        aria-roledescription="carousel"
      >
        <CarouselContent
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {slides.map((slide, index) => (
            <CarouselItem key={slide.src}>
              <div className="p-2">
                <Card className="bg-card text-card-foreground shadow-md dark:shadow-lg border border-border transition-colors duration-500">
                  <CardContent>
                    <AnimatePresence mode="wait">
                      <motion.div
                        className="flex flex-col items-center text-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      >
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                          <Image
                            src={slide.src}
                            alt={slide.caption}
                            role="img"
                            aria-describedby={`desc-${index}`}
                            width={400}
                            height={300}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                            className="rounded-md object-cover hover:scale-105 transition-transform duration-500"
                            priority={index === 0}
                            loading={index === 0 ? "eager" : "lazy"}
                            placeholder="blur"
                            blurDataURL="/images/placeholder.jpg"
                          />
                        </motion.div>
                        <motion.h3
                          className="mt-4 text-lg font-bold"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                        >
                          {slide.caption}
                        </motion.h3>
                        <motion.p
                          id={`desc-${index}`}
                          className="mt-2 text-sm px-4 text-justify leading-relaxed"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: 0.4, duration: 0.5 }}
                        >
                          {slide.description}
                        </motion.p>
                      </motion.div>
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious ref={prevRef} aria-label="Previous slide" />
        <CarouselNext ref={nextRef} aria-label="Next slide" />
      </Carousel>
    </div>
  )
}