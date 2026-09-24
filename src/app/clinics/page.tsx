"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import React, { useEffect, useId, useRef, useState } from "react"
import { TypingAnimation } from "@/components/magicui/typing-animation"

interface DotPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number
  height?: number
  cx?: number
  cy?: number
  cr?: number
  className?: string
  glow?: boolean
}

function DotPattern({
  width = 16,
  height = 16,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
  glow = false,
  ...props
}: DotPatternProps) {
  const id = useId()
  const containerRef = useRef<SVGSVGElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } =
          containerRef.current.getBoundingClientRect()

        setDimensions({ width, height })
      }
    }

    updateDimensions()

    window.addEventListener("resize", updateDimensions)

    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  const dots = Array.from(
    {
      length:
        Math.ceil(dimensions.width / width) *
        Math.ceil(dimensions.height / height),
    },
    (_, i) => {
      const col = i % Math.ceil(dimensions.width / width)
      const row = Math.floor(i / Math.ceil(dimensions.width / width))

      return {
        x: col * width + cx,
        y: row * height + cy,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 2,
      }
    }
  )

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 h-full w-full z-0",
        className
      )}
      {...props}
    >
      <defs>
        <radialGradient id={`${id}-gradient`}>
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>

      {dots.map((dot) => (
        <motion.circle
          key={`${dot.x}-${dot.y}`}
          cx={dot.x}
          cy={dot.y}
          r={cr}
          fill={glow ? `url(#${id}-gradient)` : "currentColor"}
          className="text-neutral-300 dark:text-neutral-700"
          initial={glow ? { opacity: 0.4, scale: 1 } : {}}
          animate={
            glow
              ? {
                  opacity: [0.4, 1, 0.4],
                  scale: [1, 1.5, 1],
                }
              : {}
          }
          transition={
            glow
              ? {
                  duration: dot.duration,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: dot.delay,
                  ease: "easeInOut",
                }
              : {}
          }
        />
      ))}
    </svg>
  )
}

function LoopingTyping({
  text,
  ...props
}: {
  text: string
  className?: string
}) {
  const [key, setKey] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setKey((prev) => prev + 1)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <TypingAnimation key={key} {...props}>
      {text}
    </TypingAnimation>
  )
}

export default function Clinics() {
  return (
    <div className="relative w-screen h-screen bg-white dark:bg-black overflow-hidden">
      <style jsx global>{`
        html,
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          width: 100%;
          height: 100%;
        }
      `}</style>

      <DotPattern glow={false} width={24} height={24} cr={2} />

      <main className="relative z-10 w-full h-full flex">
        <div className="w-[250px]"></div>

        <div className="flex-1 flex items-center">
          <div className="absolute left-[35%] top-[42%] sm:left-[33%] sm:top-[38%] md:left-[31%] md:top-[43%] lg:left-[29%] lg:top-[45%]">
            <LoopingTyping
              text="Coming soon"
              className="text-2xl font-bold text-gray-800 dark:text-gray-200"
            />
          </div>
        </div>
      </main>
    </div>
  )
}