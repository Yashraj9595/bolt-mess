"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface OTPTesterProps {
  email: string
  onOTPReceived: (otp: string) => void
}

export function OTPTester({ email, onOTPReceived }: OTPTesterProps) {
  const [generatedOTP, setGeneratedOTP] = useState("123456")
  
  const handleGenerateOTP = () => {
    const newOTP = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedOTP(newOTP)
  }

  return (
    <div className="fixed bottom-2 right-2 z-50 bg-black/80 text-white p-2 rounded-lg text-xs shadow-lg">
      <div className="mb-1 font-mono">
        <span className="opacity-70">Email: </span>
        {email}
      </div>
      <div className="flex items-center gap-2 mb-1">
        <span className="opacity-70">OTP: </span>
        <span className="font-mono font-bold">{generatedOTP}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleGenerateOTP}
          className="h-6 text-xs px-1 text-blue-400 hover:text-blue-300"
        >
          Generate
        </Button>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onOTPReceived(generatedOTP)}
        className="w-full h-6 text-xs bg-blue-600 hover:bg-blue-500 text-white"
      >
        Use this OTP
      </Button>
    </div>
  )
} 