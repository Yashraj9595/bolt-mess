"use client"

import { LoadingScreen } from "./loading-screen"

export function PageLoading() {
  return (
    <LoadingScreen 
      message="Loading page..." 
      showLogo={false} 
    />
  )
} 