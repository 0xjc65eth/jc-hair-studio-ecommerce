'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface VideoHeroCarouselProps {
  videos: Array<{
    src: string;
    title: string;
    subtitle: string;
    cta: string;
    ctaLink: string;
  }>;
  autoplayInterval?: number;
  className?: string;
}

export default function VideoHeroCarousel({
  videos = [
    {
      src: '/videos/hero-video-1.mp4',
      title: 'Transforme seu Visual',
      subtitle: 'Descubra o poder dos nossos produtos de mega hair profissionais',
      cta: 'Ver Mega Hair',
      ctaLink: '/mega-hair'
    },
    {
      src: '/videos/hero-video-2.mp4',
      title: 'Qualidade Premium',
      subtitle: 'Produtos profissionais para um resultado perfeito',
      cta: 'Explorar Catálogo',
      ctaLink: '/catalogo'
    }
  ],
  autoplayInterval = 8000,
  className = ''
}: VideoHeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>(new Array(videos.length).fill(null));

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoplay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % videos.length);
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [isAutoplay, autoplayInterval, videos.length]);

  // Handle video playback
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      if (index === currentIndex) {
        if (isPlaying) {
          video.play().catch(console.error);
        } else {
          video.pause();
        }
        video.muted = isMuted;
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [currentIndex, isPlaying, isMuted]);

  const goToPrevious = () => {
    setIsAutoplay(false);
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  const goToNext = () => {
    setIsAutoplay(false);
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoplay(false);
    setCurrentIndex(index);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    setIsAutoplay(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  if (videos.length === 0) return null;

  return (
    <div className={`relative w-full h-screen overflow-hidden bg-black ${className}`}>
      {/* Video Container */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait">
          {videos.map((video, index) => (
            <motion.div
              key={`${video.src}-${index}`}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentIndex ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <video
                ref={(el) => {
                  videoRefs.current[index] = el;
                }}
                src={video.src}
                className="w-full h-full object-cover"
                loop
                muted={isMuted}
                playsInline
                preload="metadata"
                onError={(e) => {
                  console.error('Video error:', e);
                }}
              />

              {/* Dark Overlay for Better Text Readability */}
              <div className="absolute inset-0 bg-black bg-opacity-30" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white z-10 px-6 max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Title */}
              <motion.h1
                className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight"
                style={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                }}
              >
                {videos[currentIndex].title}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="text-lg md:text-xl lg:text-2xl font-light opacity-90 max-w-2xl mx-auto"
                style={{
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                }}
              >
                {videos[currentIndex].subtitle}
              </motion.p>

              {/* CTA Button */}
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <a
                  href={videos[currentIndex].ctaLink}
                  className="inline-block bg-white text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg"
                  style={{
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  }}
                >
                  {videos[currentIndex].cta}
                </a>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      {videos.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
            aria-label="Previous video"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
            aria-label="Next video"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {videos.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white scale-125'
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Video Controls */}
      <div className="absolute bottom-8 right-8 z-20 flex items-center space-x-3">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
        </button>

        {/* Mute/Unmute Button */}
        <button
          onClick={toggleMute}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white bg-opacity-20 z-20">
        <motion.div
          className="h-full bg-white"
          initial={{ width: '0%' }}
          animate={{ width: isAutoplay ? '100%' : '0%' }}
          transition={{
            duration: autoplayInterval / 1000,
            ease: 'linear',
            repeat: isAutoplay ? Infinity : 0,
          }}
          key={currentIndex}
        />
      </div>

      {/* Brand Logo Overlay */}
      <div className="absolute top-8 left-8 z-20">
        <div className="bg-white bg-opacity-10 backdrop-blur-sm px-4 py-2 rounded-lg">
          <h2 className="text-white text-xl font-bold">JC Hair Studio's 62</h2>
        </div>
      </div>
    </div>
  );
}