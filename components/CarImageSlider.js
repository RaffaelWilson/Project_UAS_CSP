'use client'
import { useState } from 'react'
import { getImageUrl } from '../lib/supabase'

export default function CarImageSlider({ images, carName }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const imageList = Array.isArray(images) ? images : [images || '/images/car1.jpeg']

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % imageList.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + imageList.length) % imageList.length)
  }

  const goToImage = (index) => {
    setCurrentIndex(index)
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Main Image */}
      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <img
          src={getImageUrl(imageList[currentIndex])}
          alt={`${carName} - Image ${currentIndex + 1}`}
          style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}
        />
        
        {/* Navigation Arrows */}
        {imageList.length > 1 && (
          <>
            <button
              onClick={prevImage}
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.5)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              ‹
            </button>
            <button
              onClick={nextImage}
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.5)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              ›
            </button>
          </>
        )}
        
        {/* Image Counter */}
        {imageList.length > 1 && (
          <div style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px'
          }}>
            {currentIndex + 1} / {imageList.length}
          </div>
        )}
      </div>

      {/* Thumbnail Preview */}
      {imageList.length > 1 && (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {imageList.map((img, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              style={{
                border: currentIndex === index ? '3px solid #8B0000' : '2px solid #ddd',
                borderRadius: '8px',
                padding: '2px',
                background: 'none',
                cursor: 'pointer'
              }}
            >
              <img
                src={getImageUrl(img)}
                alt={`Thumbnail ${index + 1}`}
                style={{
                  width: '60px',
                  height: '45px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  opacity: currentIndex === index ? 1 : 0.7
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}