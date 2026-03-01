'use client';

import { useState } from 'react';
import { FileText, Search, TrendingUp, Users, AlertTriangle, Download, Star, Clock, CheckCircle } from 'lucide-react';

// 模拟IPO数据
const IPO_LIST = [
  { id: 1, name: '美的集团', code: '0030.HK', date: '2024-02-20', status: '申购中', price: '54.8', minQty: 100 },
  { id: 2, name: '地平线机器人', code: '9660.HK', date: '2024-02-15', status: '已上市', price: '4.1', minQty: 500 },
  { id: 3, name: '麦士克', code: '2024-02-12', status: '待上市', price: '待定', minQty: 200 },
  { id: 4, name: '七云牛', code: '2024-02-08', status: '已上市', price: '15.6', minQty: 200 },
];

export default function IPOAnalysisPage() {
  const [searchCode, setSearchCode] = useState('');
  const [selectedIPO, setSelectedIPO] = useState<typeof IPO_LIST[0] | null>(null);

  const handleSearch = () => {
    if (searchCode.trim()) {
      // 搜索逻辑
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-b from-primary-900 to-primary-950 pb-8">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <a href="/" className="text-white flex items-center text-sm mb-4">
            ← 返回首页
          </a>
          <h1 className="text-2xl font-bold text-white">招股书分析</h1>
          <p className="text-primary-100 text-sm mt-1">AI智能解读招股书核心要点</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-6">
        {/* 搜索框 */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="输入股票代码或公司名称"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="btn-gradient text-white px-6 py-3 rounded-xl font-medium flex items-center">
              <Search size={20} className="mr-2" />
              搜索
            </button>
          </div>
        </div>

        {/* IPO列表 */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">近期IPO</h2>
          </div>
          
          <div className="divide-y">
            {IPO_LIST.map((ipo) => (
              <div 
                key={ipo.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedIPO(ipo)}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <FileText className="text-primary-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{ipo.name}</h3>
                    <p className="text-sm text-gray-500">{ipo.code} · {ipo.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    ipo.status === '申购中' ? 'bg-green-100 text-green-700' :
                    ipo.status === '已上市' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {ipo.status}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">{ipo.price === '待定' ? '待定' : `HK$${ipo.price}`}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 分析报告预览 */}
        {selectedIPO && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">{selectedIPO.name} 分析报告</h2>
              <button className="text-primary-600 text-sm flex items-center">
                <Download size={16} className="mr-1" />
                下载报告
              </button>
            </div>

            <div className="space-y-6">
              {/* 商业模式 */}
              <div className="border-l-4 border-primary-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <TrendingUp size={18} className="mr-2 text-primary-600" />
                  商业模式
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {selectedIPO.name}主要从事{selectedIPO.name.includes('美的') ? '家电制造与销售' : '相关业务'}，
                  公司采用直销与分销相结合的模式，拥有完善的销售网络...
                </p>
              </div>

              {/* 保荐人记录 */}
              <div className="border-l-4 border-gold-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <Users size={18} className="mr-2 text-gold-500" />
                  保荐人记录
                </h3>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">历史项目胜率高</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">头部保荐人</span>
                </div>
                <p className="text-gray-600 text-sm">
                  主要保荐人包括：中金公司、摩根士丹利、海通国际等知名投行，
                  团队拥有丰富的IPO项目经验...
                </p>
              </div>

              {/* 基石投资者 */}
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <Star size={18} className="mr-2 text-purple-600" />
                  基石投资者
                </h3>
                <p className="text-gray-600 text-sm">
                  引入多家知名基石投资者，包括：主权基金、长线基金、产业资本等，
                  合计认购金额约占发行规模的40%，显示市场对公司长期价值的认可...
                </p>
              </div>

              {/* 风险因素 */}
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <AlertTriangle size={18} className="mr-2 text-red-500" />
                  风险因素
                </h3>
                <ul className="text-gray-600 text-sm space-y-2">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    行业竞争激烈，市场份额面临持续挤压风险
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    宏观经济波动可能影响公司业绩表现
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    原材料价格波动对利润率带来不确定性
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">完整版报告</p>
                  <p className="text-2xl font-bold text-primary-900">¥29.9</p>
                </div>
                <button className="btn-gradient text-white px-8 py-3 rounded-xl font-medium">
                  解锁完整报告
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 无选择时的提示 */}
        {!selectedIPO && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center mb-24">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">选择一家公司查看分析</h3>
            <p className="text-gray-500">点击上方列表中的公司，查看AI生成的招股书分析报告</p>
          </div>
        )}
      </div>
    </div>
  );
}
