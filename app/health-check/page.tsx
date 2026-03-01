export default function HealthCheckPage() {
  return (
    <div className="min-h-screen bg-gray-50">
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
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">基本信息</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">公司名称</label>
              <input type="text" placeholder="请输入公司名称" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">行业类型</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>请选择行业</option>
                <option>科技</option>
                <option>金融</option>
                <option>消费</option>
                <option>医疗健康</option>
                <option>新能源</option>
                <option>房地产</option>
                <option>其他</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">是否采用VIE架构</label>
              <div className="flex items-center">
                <label className="flex items-center mr-6">
                  <input type="radio" name="vie" className="mr-2" /> 是
                </label>
                <label className="flex items-center">
                  <input type="radio" name="vie" className="mr-2" /> 否
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
                <input type="number" placeholder="最近一年" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">前一年盈利</label>
                <input type="number" placeholder="前一年" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">大前年盈利</label>
                <input type="number" placeholder="大前年" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">预计市值（亿港元）</label>
              <input type="number" placeholder="请输入" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">最近一年营收（亿港元）</label>
              <input type="number" placeholder="请输入" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">股权架构</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">控股股东持股比例（%）</label>
              <input type="number" placeholder="请输入" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">是否存在境外股东</label>
              <div className="flex items-center">
                <label className="flex items-center mr-6">
                  <input type="radio" name="offshore" className="mr-2" /> 是
                </label>
                <label className="flex items-center">
                  <input type="radio" name="offshore" className="mr-2" /> 否
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">招股书上传（可选）</h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
            <div className="text-4xl mb-2">📄</div>
            <p className="text-gray-600">点击上传PDF招股书</p>
            <p className="text-gray-400 text-sm mt-1">支持PDF格式，最大50MB</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-24">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600">体检费用</span>
            <span className="text-2xl font-bold text-primary-900">¥49.9</span>
          </div>
          
          <button className="w-full btn-gradient text-white py-4 rounded-xl font-medium text-lg">
            开始体检
          </button>
          
          <p className="text-center text-gray-500 text-sm mt-3">
            预计3-5个工作日内出报告
          </p>
        </div>
      </div>
    </div>
  );
}
