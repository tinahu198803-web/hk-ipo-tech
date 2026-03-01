import { NextResponse } from 'next/server';

// IPO列表数据
const IPO_LIST = [
  { id: 1, name: '美的集团', code: '0030.HK', date: '2024-02-20', status: '申购中', price: '54.8', minQty: 100, industry: '家电制造' },
  { id: 2, name: '地平线机器人', code: '9660.HK', date: '2024-02-15', status: '已上市', price: '4.1', minQty: 500, industry: '自动驾驶' },
  { id: 3, name: '麦士克', code: '2024-02-12', status: '待上市', price: '待定', minQty: 200, industry: '食品饮料' },
  { id: 4, name: '七云牛', code: '2024-02-08', status: '已上市', price: '15.6', minQty: 200, industry: '云计算' },
  { id: 5, name: '蚂蚁集团', code: '6688.HK', date: '2024-03', status: '待上市', price: '待定', minQty: 50, industry: '金融科技' },
];

// 模拟分析结果
function getMockAnalysis(companyName: string) {
  const company = IPO_LIST.find(i => i.name === companyName);
  
  return {
    companyName: companyName,
    ipoDate: company?.date || '待定',
    issuePrice: company?.price || '待定',
    analysis: {
      商业模式: {
        summary: `${companyName}主要从事${company?.industry || '相关业务'}，公司采用直销与分销相结合的模式，拥有完善的销售网络。`,
        keyPoints: [
          '主营业务突出，市场份额领先',
          '毛利率稳定，盈利能力较强',
          '研发投入持续增加，创新能力较强'
        ]
      },
      保荐人记录: {
        summary: '本次IPO由多家知名投行担任联席保荐人，团队拥有丰富的IPO项目经验。',
        sponsors: ['中金公司', '摩根士丹利', '高盛', '海通国际'],
        historicalPerformance: '历史项目胜率高，声誉良好'
      },
      基石投资者: {
        summary: '引入多家知名基石投资者，合计认购金额约占发行规模的40%。',
        investors: [
          { name: '新加坡主权基金', amount: '约2亿美元', lockup: '6个月' },
          { name: '高瓴资本', amount: '约1亿美元', lockup: '6个月' },
          { name: '红杉中国', amount: '约5000万美元', lockup: '6个月' }
        ]
      },
      风险因素: {
        summary: '投资者需关注以下风险因素：',
        risks: [
          '行业竞争激烈，市场份额面临挤压',
          '宏观经济波动可能影响业绩',
          '原材料价格波动对利润率的影响',
          '监管政策变化带来的不确定性'
        ]
      }
    },
    recommendation: {
      score: 7.5,
      summary: '公司基本面良好，行业前景广阔，建议关注。'
    }
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companyName, companyCode } = body;
    
    // 查找公司
    const company = IPO_LIST.find(
      i => i.name === companyName || i.code === companyCode
    );
    
    if (!company) {
      return NextResponse.json({
        success: false,
        error: '未找到该公司信息'
      }, { status: 404 });
    }
    
    // 检查是否有API密钥
    const apiKey = process.env.AZURE_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      // 返回模拟结果
      const result = getMockAnalysis(company.name);
      return NextResponse.json({
        success: true,
        data: result,
        isMock: true,
        message: '演示模式'
      });
    }
    
    // TODO: 调用真实AI服务
    const result = getMockAnalysis(company.name);
    
    return NextResponse.json({
      success: true,
      data: result
    });
    
  } catch (error: any) {
    console.error('IPO analysis error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '分析服务出现错误'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: IPO_LIST
  });
}
