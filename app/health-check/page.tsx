'use client';

import { useState } from 'react';
import { Search, FileText, Activity, CheckCircle, AlertCircle, Clock, Loader2, ChevronDown, ChevronUp, Download, Share2 } from 'lucide-react';

type HealthCheckData = {
  companyName: string;
  industry: string;
  isVIE: boolean;
  profits: number[];
  marketCap: number;
  revenue: number;
  controllingShareholder: number;
  hasOffshore: boolean;
};

type ResultData = {
  overallScore: number;
  summary: string;
  details: {
    财务指标: { status: string; score: number; issues: string[]; details: string };
    股权架构: { status: string; score: number; issues: string[]; details: string };
    合规要求: { status: string; score: number; issues: string[]; details: string };
    市值达标: { status: string; score: number; issues: string[]; details: string };
  };
  recommendations: { priority: string; category: string; suggestion: string }[];
};

export default function HealthCheckPage() {
  const [formData, setFormData] = useState<HealthCheckData>({
    companyName: '',
    industry: '',
    isVIE: false,
    profits: [0, 0, 0],
    marketCap: 0,
    revenue: 0,
    controllingShareholder: 0,
    hasOffshore: false
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResultData | null>(null);
  const [error, setError] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    财务指标: true,
    股权架构: true,
    合规要求: true,
    市值达标: true
  });

  const handleInputChange = (field: keyof HealthCheckData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProfitChange = (index: number, value: string) => {
    const newProfits = [...formData.profits];
    newProfits[index] = parseInt(value) || 0;
    setFormData(prev => ({ ...prev, profits: newProfits }));
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSubmit = async () => {
    // 表单验证
    if (!formData.companyName) {
      setError('请输入公司名称');
      return;
    }
    if (!formData.industry) {
      setError('请选择行业类型');
      return;
    }
    if (formData.profits.every(p => p === 0) && formData.marketCap === 0) {
      setError('请至少填写财务数据或市值');
      return;
    }

    setError('');
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/health-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || '体检服务出现错误');
      }
    } catch (err: any) {
      setError('网络错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'bg-green-100 text-green-700 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'fail': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pass': return '通过';
      case 'warning': return '需要注意';
      case 'fail': return '不通过';
      default: return '未知';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPriorityBadge = (priority: string)=> {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-gradient-to-b from-primary-900 to-primary-950 pb-8">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <a href="/" className="text-white flex items-center text-sm mb-4">
            ← 返回首页
          </a>
          <h1 className="text-2xl font-bold text-white">港股通体检</h1>
          <p className="text-primary-100 text-sm mt-1">输入公司信息，AI专家为您进行入通可行性分析</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-6">
        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center">
            <AlertCircle className="text-red-500 mr-2" size={20} />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* 表单 */}
        {!result && (
          <>
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">基本信息</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">公司名称 *</label>
                  <input 
                    type="text" 
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="请输入公司名称" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">行业类型 *</label>
                  <select 
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">请选择行业</option>
                    <option value="科技">科技</option>
                    <option value="金融">金融</option>
                    <option value="消费">消费</option>
                    <option value="医疗健康">医疗健康</option>
                    <option value="新能源">新能源</option>
                    <option value="房地产">房地产</option>
                    <option value="教育">教育</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">是否采用VIE架构</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="vie" 
                        checked={formData.isVIE === true}
                        onChange={() => handleInputChange('isVIE', true)}
                        className="mr-2" 
                      /> 是
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="vie" 
                        checked={formData.isVIE === false}
                        onChange={() => handleInputChange('isVIE', false)}
                        className="mr-2" 
                      /> 否
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">财务数据（万港元）</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">最近一年盈利</label>
                    <input 
                      type="number" 
                      value={formData.profits[2] || ''}
                      onChange={(e) => handleProfitChange(2, e.target.value)}
                      placeholder="最近一年" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">前一年盈利</label>
                    <input 
                      type="number" 
                      value={formData.profits[1] || ''}
                      onChange={(e) => handleProfitChange(1, e.target.value)}
                      placeholder="前一年" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">大前年盈利</label>
                    <input 
                      type="number" 
                      value={formData.profits[0] || ''}
                      onChange={(e) => handleProfitChange(0, e.target.value)}
                      placeholder="大前年" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">预计市值（亿港元）</label>
                  <input 
                    type="number" 
                    value={formData.marketCap || ''}
                    onChange={(e) => handleInputChange('marketCap', parseInt(e.target.value) || 0)}
                    placeholder="请输入" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">最近一年营收（亿港元）</label>
                  <input 
                    type="number" 
                    value={formData.revenue || ''}
                    onChange={(e) => handleInputChange('revenue', parseInt(e.target.value) || 0)}
                    placeholder="请输入" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" 
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">股权架构</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">控股股东持股比例（%）</label>
                  <input 
                    type="number" 
                    value={formData.controllingShareholder || ''}
                    onChange={(e) => handleInputChange('controllingShareholder', parseInt(e.target.value) || 0)}
                    placeholder="请输入" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">是否存在境外股东</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="offshore" 
                        checked={formData.hasOffshore === true}
                        onChange={() => handleInputChange('hasOffshore', true)}
                        className="mr-2" 
                      /> 是
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="offshore" 
                        checked={formData.hasOffshore === false}
                        onChange={() => handleInputChange('hasOffshore', false)}
                        className="mr-2" 
                      /> 否
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 mb-24">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600">体检费用</span>
                <span className="text-2xl font-bold text-primary-900">¥49.9</span>
              </div>
              
              <button 
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full btn-gradient text-white py-4 rounded-xl font-medium text-lg flex items-center justify-center disabled:opacity-50"
              >
{isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    AI分析中...
                  </>
                ) : (
                  '开始体检'
                )}
              </button>
              
              <p className="text-center text-gray-500 text-sm mt-3">
                AI即时分析，立即出结果
              </p>
            </div>
          </>
        )}

        {/* 体检结果 */}
        {result && (
          <div className="mb-24">
            {/* 总分卡片 */}
            <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-2xl shadow-xl p-8 mb-6 text-white">
              <div className="text-center">
                <p className="text-primary-200 mb-2">综合评分</p>
                <div className="relative inline-block">
                  <span className={`text-7xl font-bold ${getScoreColor(result.overallScore)}`}>
                    {result.overallScore}
                  </span>
                  <span className="text-2xl text-primary-200">/100</span>
                </div>
                <p className="mt-4 text-lg">{result.summary}</p>
              </div>
              
              <div className="flex justify-center gap-4 mt-6">
                <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg flex items-center text-sm">
                  <Download size={16} className="mr-2" />
                  下载报告
                </button>
                <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg flex items-center text-sm">
                  <Share2 size={16} className="mr-2" />
                  分享
                </button>
              </div>
            </div>

            {/* 分项结果 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800">详细分析</h2>
              </div>
              
              {Object.entries(result.details).map(([key, value]: [string, any]) => (
                <div key={key} className="border-b last:border-b-0">
                  <button
                    onClick={() => toggleSection(key)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        value.status === 'pass' ? 'bg-green-100' :
                        value.status === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
                      }`}>
                        <CheckCircle className={
                          value.status === 'pass' ? 'text-green-600' :
                          value.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                        } size={24} />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900">{key}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(value.status)}`}>
                          {getStatusText(value.status)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-2xl font-bold ${getScoreColor(value.score)}`}>
                        {value.score}
                      </span>
                      {expandedSections[key] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </button>
                  
                  {expandedSections[key] && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600 text-sm mb-3">{value.details}</p>
                      {value.issues && value.issues.length > 0 && (
                        <div className="space-y-2">
                          {value.issues.map((issue: string, idx: number) => (
                            <div key={idx} className="flex items-start text-sm text-yellow-700 bg-yellow-50 px-3 py-2 rounded-lg">
                              <AlertCircle size={14} className="mr-2 mt-0.5 flex-shrink-0" />
                              {issue}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 改进建议 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">改进建议</h2>
              
              <div className="space-y-3">
                {result.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start p-4 bg-gray-50 rounded-xl">
                    <span className={`px-2 py-1 rounded text-xs font-medium mr-3 ${getPriorityBadge(rec.priority)}`}>
                      {rec.priority === 'high' ? '高优先级' : rec.priority === 'medium' ? '中优先级' : '低优先级'}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{rec.category}</p>
                      <p className="text-gray-600 text-sm">{rec.suggestion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 再次体检 */}
            <button 
              onClick={() => setResult(null)}
              className="w-full border-2 border-primary-600 text-primary-600 py-4 rounded-xl font-medium text-lg mb-6"
            >
              再次体检
            </button>
            
            <p className="text-center text-gray-500 text-sm">
              <Clock size={14} className="inline mr-1" />
              报告生成时间：{new Date().toLocaleString('zh-CN')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
