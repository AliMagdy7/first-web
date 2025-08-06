"use client"
import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const slides = [
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
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false })
  )

  return (
    <div className="flex items-center justify-center min-h-screen pl-[var(--sidebar-width)] transition-colors duration-500">
      <Carousel plugins={[plugin.current]} className="w-full max-w-md">
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="p-2">
                <Card className="bg-card text-card-foreground shadow-md dark:shadow-lg border border-border transition-colors duration-500">
                  <CardContent>
                    <div className="flex flex-col items-center text-center">
                      <Image
                        src={slide.src}
                        alt={slide.caption}
                        width={400}
                        height={300}
                        className="rounded-md object-cover"
                      />
                      <h3 className="mt-4 text-lg font-bold">{slide.caption}</h3>
                      <p className="mt-2 text-sm px-4 text-justify leading-relaxed">
                        {slide.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}