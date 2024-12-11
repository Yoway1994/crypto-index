const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888'

export async function analyzeToken(address: string) {
  const response = await fetch(`${API_URL}/api/analyze-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ address }),
  })

  if (!response.ok) {
    throw new Error('Analysis failed')
  }

  return response.json()
}

export async function checkHealth() {
  const response = await fetch(`${API_URL}/health`)
  
  if (!response.ok) {
    throw new Error('Health check failed')
  }

  return response.json()
} 