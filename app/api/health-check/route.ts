import { NextResponse } from 'next/server'

function getMockHealthCheckResult(data: any) {
  const profits = data.profits || []
  const latestProfit = profits[2] || 0
  const totalProfit = profits.reduce((a, b) => a + b, 0)
  const marketCap = data.marketCap || 0
  const revenue = data.revenue || 0
  
  let financialScore = 50
  const financialIssues = []
  
  if (latestProfit >= 3500 && totalProfit >= 8000) {
    financialScore = 90
  } else if (latestProfit >= 2000 || totalProfit >= 5000) {
    financialScore = 70
  } else {
    financialScore = marketCap >= 20 && revenue >= 5 ? 75 : 30
  }
  
  let ownershipScore = data.controllingShareholder > 75 ? 60 : 80
  if (data.isVIE) ownershipScore -= 15
  
  let marketCapScore = marketCap >= 50 ? 95 : marketCap >= 40 ? 85 : 60
  
  let complianceScore = data.isVIE ? 60 : 70
  
  const overallScore = Math.round((financialScore * 0.35) + (ownershipScore * 0.2) + (marketCapScore * 0.3) + (complianceScore * 0.15))
  
  let summary = overallScore >= 80 ? '公司整体情况良好，具备港股上市基本条件。' : overallScore >= 60 ? '公司具备一定上市基础，但存在部分问题需要改进。' : '公司目前离港股上市要求还有较大差距。'
  
  return {
    overallScore,
    summary,
    details: {
      财务指标: { status: financialScore >= 70 ? 'pass' : 'warning', score: financialScore, issues: [], details: `盈利${latestProfit}万` },
      股权架构: { status: ownershipScore >= 70 ? 'pass' : 'warning', score: ownershipScore, issues: [], details: '架构清晰' },
      合规要求: { status: complianceScore >= 70 ? 'pass' : 'warning', score: complianceScore, issues: [], details: '合规' },
      市值达标: { status: marketCapScore >= 70 ? 'pass' : 'warning', score: marketCapScore, issues: [], details: `市值${marketCap}亿` }
    },
    recommendations: [
      { priority: 'medium', category: '财务', suggestion: '建议提升盈利水平' },
      { priority: 'low', category: '市值', suggestion: marketCap < 50 ? '建议提升市值至50亿以上' : '市值已达标' }
    ]
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = getMockHealthCheckResult(body)
    return NextResponse.json({ success: true, data: result, isMock: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
