'use client'

import { useState } from "react";

export default function Home() {
  const [pingResult, setPingResult] = useState<string>('')
  const [tokenAddress, setTokenAddress] = useState<string>('')
  const [analysisResult, setAnalysisResult] = useState<string>('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handlePing = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888'
      const response = await fetch(`${apiUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      setPingResult(JSON.stringify(data, null, 2))
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Could not connect to server'
      setPingResult(`Error: ${errorMessage}`)
    }
  }

  const handleAnalyzeToken = async () => {
    if (!tokenAddress) {
      setAnalysisResult('Please enter a token address')
      return
    }

    setIsAnalyzing(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888'
      const response = await fetch(`${apiUrl}/api/analyze-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: tokenAddress }),
      })
      
      const data = await response.json()
      setAnalysisResult(JSON.stringify(data, null, 2))
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze token'
      setAnalysisResult(`Error: ${errorMessage}`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="grid grid-rows-[auto_1fr] min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        {/* 標題 */}
        <h1 className="text-4xl font-bold text-center mb-12">
          Crypto Index Analysis
        </h1>

        {/* 健康檢查區塊 */}
        <div className="border border-black/[.08] rounded-xl p-8 space-y-4">
          <h2 className="text-2xl font-semibold">
            Server Status
          </h2>
          <div className="space-y-4">
            <button
              onClick={handlePing}
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] text-sm sm:text-base h-10 sm:h-12 px-6"
            >
              Check Server Status
            </button>
            {pingResult && (
              <pre className="bg-black/[.05] p-6 rounded-xl overflow-x-auto font-mono text-sm min-h-[100px] whitespace-pre-wrap">
                {pingResult}
              </pre>
            )}
          </div>
        </div>

        {/* Token 分析區塊 */}
        <div className="border border-black/[.08] rounded-xl p-8 space-y-4">
          <h2 className="text-2xl font-semibold">
            Token Analysis
          </h2>
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                placeholder="E1kvzJNxShvvWTrudokpzuc789vRiDXfXG3duCuY6ooE"
                className="flex-1 px-4 h-12 border border-black/[.08] rounded-full focus:outline-none focus:ring-2 focus:ring-black/[.12] font-mono text-sm text-black"
              />
              <button
                onClick={handleAnalyzeToken}
                disabled={isAnalyzing}
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] text-sm sm:text-base h-12 px-6 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Token'}
              </button>
            </div>
            {analysisResult && (
              <pre className="bg-black/[.05] p-6 rounded-xl overflow-x-auto font-mono text-sm min-h-[200px] whitespace-pre-wrap break-words">
                {analysisResult}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
