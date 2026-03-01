import { NextResponse } from 'next/server';
import { HEALTH_CHECK_SYSTEM_PROMPT, generateHealthCheckPrompt } from '../../lib/health-check';

// 模拟体检结果（当没有API密钥时使用）
function getMockHealthCheckResult(data: any) {
  const profits = data.profits || [];
  const latestProfit = profits[2] || 0;
  const totalProfit = profits.reduce((a: number, b: number) => a + b, 0);
  const marketCap = data.marketCap || 0;
  const revenue = data.revenue || 0;
  
  // 计算财务指标得分
  let financialScore = 50;
  const financialIssues: string[] = [];
  
  if (latestProfit >= 3500 && totalProfit >= 8000) {
    financialScore = 90;
  } else if (latestProfit >= 2000 || totalProfit >= 5000) {
    financialScore = 70;
    if (latestProfit < 3500) financialIssues.push('最近一年盈利未达到3500万要求');
    if (totalProfit < 8000) financialIssues.push('三年累计盈利未达到8000万要求');
  } else {
    financialIssues.push('不满足盈利测试要求');
    if (marketCap >= 40 && revenue >= 5) {
      financialScore = 80;
    } else if (marketCap >= 20 && revenue >= 5) {
      financialScore = 75;
    } else {
      financialScore = 30;
      financialIssues.push('不满足市值收益测试要求');
    }
  }
  
  // 计算股权架构得分
  let ownershipScore = 80;
  const ownershipIssues: string[] = [];
  if (data.controllingShareholder > 75) {
    ownershipScore -= 20;
    ownershipIssues.push('控股股东持股比例过高，可能影响独立性');
  }
  if (data.isVIE) {
    ownershipScore -= 15;
    ownershipIssues.push('采用VIE架构需关注监管合规');
  }
  if (data.hasOffshore) {
    ownershipIssues.push('存在境外股东，需确认是否需要返程投资登记');
  }
  
  // 计算市值得分
  let marketCapScore = 60;
  const marketCapIssues: string[] = [];
  if (marketCap >= 50) {
    marketCapScore = 95;
  } else if (marketCap >= 40) {
    marketCapScore = 85;
    marketCapIssues.push('市值50亿以上可纳入港股通');
  } else if (marketCap >= 20) {
    marketCapScore = 70;
    marketCapIssues.push('市值略低，建议提升至50亿以上');
  } else {
    marketCapIssues.push('市值较低，需提升至50亿以上才能纳入港股通');
  }
  
  // 合规得分
  let complianceScore = 70;
  const complianceIssues: string[] = [];
  if (data.isVIE) {
    complianceIssues.push('需关注VIE架构合规性');
    complianceScore -= 10;
  }
  if (['教育', '互联网新闻', '游戏'].includes(data.industry)) {
    complianceIssues.push('部分行业可能面临监管限制');
    complianceScore -= 15;
  }
  
  // 计算总分
  const overallScore = Math.round(
    (financialScore * 0.35) + 
    (ownershipScore * 0.2) + 
    (marketCapScore * 0.3) + 
    (complianceScore * 0.15)
  );
  
  // 生成总体评估
  let summary = '';
  if (overallScore >= 80) {
    summary = '公司整体情况良好，具备港股上市基本条件，建议尽快启动上市筹备工作。';
  } else if (overallScore >= 60) {
    summary = '公司具备一定上市基础，但存在部分问题需要改进，建议针对性优化后再启动。';
  } else {
    summary = '公司目前离港股上市要求还有较大差距，建议优先解决关键问题后再考虑上市。';
  }
  
  return {
    overallScore,
    summary,
    details: {
      财务指标: {
        status: financialScore >= 70 ? 'pass' : financialScore >= 50 ? 'warning' : 'fail',
        score: financialScore,
        issues: financialIssues,
        details: `最近一年盈利${latestProfit}万，三年累计${totalProfit}万。`
      },
      股权架构: {
        status: ownershipScore >= 70 ? 'pass' : ownershipScore >= 50 ? 'warning' : 'fail',
        score: ownershipScore,
        issues: ownershipIssues,
        details: `控股股东持股${data.controllingShareholder}%。${data.isVIE ? '采用VIE架构。' : ''}`
      },
      合规要求: {
        status: complianceScore >= 70 ? 'pass' : complianceScore >= 50 ? 'warning' : 'fail',
        score: complianceScore,
        issues: complianceIssues,
        details: `行业类型：${data.industry}。`
      },
      市值达标: {
        status: marketCapScore >= 70 ? 'pass' : 'warning',
        score: marketCapScore,
        issues: marketCapIssues,
        details: `预计市值${marketCap}亿，营收${revenue}亿。`
      }
    },
    recommendations: [
      {
        priority: overallScore < 70 ? 'high' : 'medium',
        category: '财务优化',
        suggestion: financialScore < 70 ? '建议提升盈利水平或选择适合的上市财务测试路径' : '财务状况良好，保持即可'
      },
      {
        priority: data.isVIE ? 'high' : 'low',
        category: '架构调整',
        suggestion: data.isVIE ? '建议咨询专业律师，确保VIE架构合规性' : '股权架构清晰，继续保持'
      },
      {
        priority: marketCap < 50 ? 'medium' : 'low',
        category: '市值提升',
        suggestion: marketCap < 50 ? '建议在上市前完成Pre-IPO融资，提升市值至50亿以上' : '市值已达标'
      }
    ].filter(r => r.suggestion)
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      companyName, 
      industry, 
      isVIE, 
      profits, 
      marketCap, 
      revenue, 
      controllingShareholder,
      hasOffshore 
    } = body;
    
    // 检查必要的API密钥是否存在
    const apiKey = process.env.AZURE_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      // 如果没有API密钥，返回模拟结果
      console.log('No API key found, returning mock result');
      const mockResult = getMockHealthCheckResult({
        companyName,
        industry,
        isVIE,
        profits,
        marketCap,
        revenue,
        controllingShareholder,
        hasOffshore
      });
      
      return NextResponse.json({
        success: true,
        data: mockResult,
        isMock: true,
        message: '演示模式（请配置Azure OpenAI密钥以启用真实AI分析）'
      });
    }
    
    // 如果有API密钥，调用真实的AI服务
    const { OpenAI } = await import('openai');
    
    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: process.env.AZURE_OPENAI_ENDPOINT || undefined,
      defaultQuery: process.env.AZURE_OPENAI_API_VERSION ? {
        'api-version': process.env.AZURE_OPENAI_API_VERSION
      } : undefined
    });
    
    const userPrompt = generateHealthCheckPrompt({
      companyName,
      industry,
      isVIE,
      profits,
marketCap,
      revenue,
      controllingShareholder,
      hasOffshore
    });
    
    const completion = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4',
      messages: [
        { role: 'system', content: HEALTH_CHECK_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });
    
    const aiResponse = completion.choices[0]?.message?.content || '';
    
    // 尝试解析JSON响应
    let result;
    try {
      // 提取JSON部分
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found');
      }
    } catch (parseError) {
      // 如果解析失败，返回模拟结果并附加AI原始回复
      const mockResult = getMockHealthCheckResult({
        companyName,
        industry,
        isVIE,
        profits,
        marketCap,
        revenue,
        controllingShareholder,
        hasOffshore
      });
      
      return NextResponse.json({
        success: true,
        data: mockResult,
        aiRawResponse: aiResponse,
        message: 'AI响应解析失败，已返回智能分析结果'
      });
    }
    
    return NextResponse.json({
      success: true,
      data: result
    });
    
  } catch (error: any) {
    console.error('Health check error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || '体检服务出现错误'
    }, { status: 500 });
  }
}
