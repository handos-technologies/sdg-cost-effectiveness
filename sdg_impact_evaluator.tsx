import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { 
  Activity, ShieldAlert, CheckCircle2, ChevronRight, FileText, 
  Users, Calendar, DollarSign, BrainCircuit, Lock, BarChart3, AlertTriangle
} from 'lucide-react';

// Simulated baselines for different sectors in the Global South (Cost per outcome)
const SECTOR_BASELINES = {
  healthcare: { name: "Healthcare & WASH", baseCost: 45.50, variance: 0.3, risk: "High" },
  education: { name: "Education & Literacy", baseCost: 120.00, variance: 0.2, risk: "Medium" },
  infrastructure: { name: "Infrastructure & Energy", baseCost: 350.00, variance: 0.4, risk: "High" },
  agriculture: { name: "Agriculture & Food Security", baseCost: 85.00, variance: 0.25, risk: "Medium" },
  microfinance: { name: "Microfinance & Livelihoods", baseCost: 25.00, variance: 0.15, risk: "Low" }
};

export default function App() {
  // Brand Fonts Injection
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,700;1,400&family=DM+Serif+Display&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  // UI State
  const [step, setStep] = useState(1); // 1: Input, 2: Processing, 3: Dashboard
  const [loadingStep, setLoadingStep] = useState(0);
  
  // Form Data State
  const [formData, setFormData] = useState({
    description: '',
    sector: 'healthcare',
    population: '',
    timeline: '',
    budget: ''
  });

  // AI Output State
  const [aiResults, setAiResults] = useState(null);
  
  // Friction / Governance State
  const [justification, setJustification] = useState('');
  const [isApproved, setIsApproved] = useState(false);

  // Form Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Simulated Backend Process
  const handleAnalyze = () => {
    setStep(2);
    
    // Simulate AI Pipeline Stages
    const pipelineStages = [
      "Sanitizing historical donor data...",
      "Mapping regional economic variables...",
      "Calculating Cost-of-Effectiveness (COE)...",
      "Evaluating data scarcity & confidence intervals..."
    ];

    let currentStage = 0;
    const interval = setInterval(() => {
      setLoadingStep(currentStage);
      currentStage++;
      if (currentStage >= pipelineStages.length) {
        clearInterval(interval);
        generateAiResults();
      }
    }, 1200);
  };

  const generateAiResults = () => {
    const { sector, population, budget } = formData;
    const sectorData = SECTOR_BASELINES[sector];
    
    const pop = parseInt(population) || 1;
    const bud = parseInt(budget) || 1;
    
    // Calculate raw cost per capita
    const requestedCostPerCapita = bud / pop;
    
    // AI determines the realistic cost based on baselines + random variance
    const varianceFactor = 1 + (Math.random() * sectorData.variance * 2 - sectorData.variance);
    const aiProjectedCostPerCapita = sectorData.baseCost * varianceFactor;
    const aiProjectedTotal = aiProjectedCostPerCapita * pop;

    // Determine Confidence Score (Handos Methodology)
    // If requested budget is absurdly low compared to AI projection, flag as Low Confidence
    let confidence = "High";
    let confidenceColor = "text-emerald-600";
    let requiresJustification = false;
    let narrative = "";

    if (requestedCostPerCapita < aiProjectedCostPerCapita * 0.4) {
      confidence = "Low";
      confidenceColor = "text-rose-600";
      requiresJustification = true;
      narrative = `The requested budget (${requestedCostPerCapita.toFixed(2)} per capita) is significantly below the regional historical baseline for ${sectorData.name} (${aiProjectedCostPerCapita.toFixed(2)} per capita). Data for this specific region is highly fragmented, suggesting a high risk of project failure or hidden supply chain costs. Institutional override is required.`;
    } else if (requestedCostPerCapita > aiProjectedCostPerCapita * 1.5) {
      confidence = "Medium";
      confidenceColor = "text-amber-600";
      narrative = `The requested budget appears inflated compared to historical models. While data quality is adequate, the AI detects potential inefficiencies in the proposed timeline.`;
    } else {
      confidence = "High";
      confidenceColor = "text-emerald-600";
      narrative = `The proposed budget aligns with historical cost-effectiveness ratios for ${sectorData.name} in similar economic zones. The AI model has high confidence in these projections based on robust historical donor data.`;
    }

    setAiResults({
      sectorName: sectorData.name,
      requestedTotal: bud,
      aiProjectedTotal: aiProjectedTotal,
      requestedCOE: requestedCostPerCapita,
      aiProjectedCOE: aiProjectedCostPerCapita,
      confidence,
      confidenceColor,
      requiresJustification,
      narrative,
      chartData: [
        { name: 'Requested Budget', amount: bud, fill: '#76747B' },
        { name: 'AI Projected Cost', amount: Math.round(aiProjectedTotal), fill: '#1F2937' }
      ]
    });
    
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-[#f4f4f5] text-[#1F2937]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#1F2937] text-white flex items-center justify-center font-bold font-serif rounded-sm">H</div>
          <div>
            <h1 className="font-bold text-lg leading-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>
              SDG Impact Evaluator
            </h1>
            <p className="text-xs text-[#76747B] font-medium tracking-wide uppercase">Handos Digital Infrastructure</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-[#76747B]">
          <span className="flex items-center gap-1"><ShieldAlert className="w-4 h-4"/> Governance Active</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-12 px-6">
        
        {/* Step 1: Input Form */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 text-center">
              <h2 className="text-3xl mb-3 text-[#1F2937]" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Project Parameter Input
              </h2>
              <p className="text-[#76747B] max-w-2xl mx-auto">
                Enter the baseline parameters for the proposed development project. Our AI will normalize the data against regional historical variables to compute an accurate Cost-of-Effectiveness (COE) baseline.
              </p>
            </div>

            <div className="bg-white shadow-xl rounded-sm border border-gray-100 overflow-hidden">
              <div className="p-8 space-y-6">
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#76747B]"/> Project Description
                  </label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1F2937] focus:border-transparent outline-none transition-all resize-none h-32"
                    placeholder="Briefly describe the intervention, location, and key deliverables..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#76747B]"/> Sector Target
                    </label>
                    <select 
                      name="sector"
                      value={formData.sector}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1F2937] focus:border-transparent outline-none bg-white"
                    >
                      <option value="healthcare">Healthcare & WASH</option>
                      <option value="education">Education & Literacy</option>
                      <option value="infrastructure">Infrastructure & Energy</option>
                      <option value="agriculture">Agriculture & Food Security</option>
                      <option value="microfinance">Microfinance & Livelihoods</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#76747B]"/> Target Population Size
                    </label>
                    <input 
                      type="number"
                      name="population"
                      value={formData.population}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1F2937] focus:border-transparent outline-none"
                      placeholder="e.g., 50000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#76747B]"/> Timeline (Months)
                    </label>
                    <input 
                      type="number"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1F2937] focus:border-transparent outline-none"
                      placeholder="e.g., 24"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-[#76747B]"/> Requested Budget (USD)
                    </label>
                    <input 
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1F2937] focus:border-transparent outline-none"
                      placeholder="e.g., 1500000"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-end">
                <button 
                  onClick={handleAnalyze}
                  disabled={!formData.population || !formData.budget}
                  className="bg-[#1F2937] text-white px-8 py-3 rounded-sm font-bold flex items-center gap-2 hover:bg-[#374151] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <BrainCircuit className="w-5 h-5"/>
                  Initialize AI Analysis
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Loading/Processing */}
        {step === 2 && (
          <div className="flex flex-col items-center justify-center py-32 animate-in fade-in duration-300">
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-[#1F2937] rounded-full border-t-transparent animate-spin"></div>
              <BrainCircuit className="absolute inset-0 m-auto w-8 h-8 text-[#1F2937]" />
            </div>
            <h3 className="text-2xl font-serif text-[#1F2937] mb-6">Processing Institutional Data</h3>
            
            <div className="w-full max-w-md space-y-3">
              {["Sanitizing historical donor data...", "Mapping regional economic variables...", "Calculating Cost-of-Effectiveness (COE)...", "Evaluating data scarcity & confidence intervals..."].map((text, idx) => (
                <div key={idx} className={`flex items-center gap-3 p-3 rounded-sm transition-all duration-500 ${
                  loadingStep >= idx ? 'bg-white shadow-sm border border-gray-200' : 'opacity-30'
                }`}>
                  {loadingStep > idx ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : loadingStep === idx ? (
                    <div className="w-5 h-5 border-2 border-[#1F2937] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                  )}
                  <span className={`text-sm ${loadingStep >= idx ? 'text-[#1F2937] font-medium' : 'text-gray-500'}`}>
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Results Dashboard */}
        {step === 3 && aiResults && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">
            
            <div className="flex justify-between items-end mb-4">
              <div>
                <h2 className="text-3xl text-[#1F2937] mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  Evaluation Dashboard
                </h2>
                <p className="text-[#76747B]">Sector: {aiResults.sectorName}</p>
              </div>
              <button 
                onClick={() => { setStep(1); setIsApproved(false); setJustification(''); }}
                className="text-sm font-bold text-[#76747B] hover:text-[#1F2937] transition-colors flex items-center gap-1"
              >
                Reset Analysis
              </button>
            </div>

            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
                <div className="text-sm font-bold text-[#76747B] mb-1 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4"/> Requested COE
                </div>
                <div className="text-3xl font-serif text-gray-400">
                  ${aiResults.requestedCOE.toFixed(2)}
                </div>
                <div className="text-xs text-gray-400 mt-2">Cost per impact outcome</div>
              </div>

              <div className="bg-white p-6 rounded-sm border border-[#1F2937] shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gray-50 rounded-bl-full -mr-8 -mt-8 z-0"></div>
                <div className="relative z-10">
                  <div className="text-sm font-bold text-[#1F2937] mb-1 flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4"/> AI Projected COE
                  </div>
                  <div className="text-4xl font-serif text-[#1F2937]">
                    ${aiResults.aiProjectedCOE.toFixed(2)}
                  </div>
                  <div className="text-xs text-[#76747B] mt-2">Normalized against historical baselines</div>
                </div>
              </div>

              {/* Confidence Score */}
              <div className={`bg-white p-6 rounded-sm border shadow-sm ${aiResults.requiresJustification ? 'border-rose-200 bg-rose-50' : 'border-gray-200'}`}>
                <div className="text-sm font-bold text-[#76747B] mb-1 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4"/> Data Confidence Score
                </div>
                <div className={`text-3xl font-serif ${aiResults.confidenceColor} flex items-center gap-2`}>
                  {aiResults.confidence}
                  {aiResults.requiresJustification && <AlertTriangle className="w-6 h-6 animate-pulse"/>}
                </div>
                <div className="text-xs text-[#76747B] mt-2">Based on regional data scarcity</div>
              </div>

            </div>

            {/* Chart and Narrative Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2 bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
                <h3 className="font-bold text-[#1F2937] mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#76747B]"/> Budget Variance Analysis
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={aiResults.chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                      <XAxis type="number" tickFormatter={(value) => `$${(value/1000000).toFixed(1)}M`} />
                      <YAxis dataKey="name" type="category" width={120} tick={{fill: '#4b5563', fontSize: 12, fontWeight: 600}} />
                      <Tooltip formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)} />
                      <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Explainability */}
              <div className="bg-[#1F2937] p-6 rounded-sm shadow-xl text-white flex flex-col">
                <h3 className="font-serif text-xl mb-4 text-gray-200 border-b border-gray-700 pb-3">
                  Explainability Protocol
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed flex-grow">
                  {aiResults.narrative}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="text-xs text-gray-400 flex items-center justify-between">
                    <span>Line 2 Defence Active</span>
                    <Lock className="w-3 h-3"/>
                  </div>
                </div>
              </div>

            </div>

            {/* Friction Gate */}
            {aiResults.requiresJustification && !isApproved && (
              <div className="bg-rose-50 border-l-4 border-rose-600 p-6 rounded-r-sm shadow-sm animate-in fade-in duration-500">
                <h3 className="text-lg font-bold text-rose-900 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5"/> Mandatory Institutional Friction
                </h3>
                <p className="text-rose-800 text-sm mb-4">
                  To combat automation bias, Handos architecture requires human validation when AI confidence is Low. Please provide a written justification for accepting this cost-effectiveness ratio before proceeding.
                </p>
                <textarea 
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  className="w-full p-3 border border-rose-200 rounded-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none mb-4 h-24 text-sm"
                  placeholder="Enter institutional knowledge justifying this variance (e.g., 'Pre-existing local partnerships will artificially lower supply chain costs...')"
                />
                <button 
                  onClick={() => setIsApproved(true)}
                  disabled={justification.length < 20}
                  className="bg-rose-600 text-white px-6 py-2 rounded-sm font-bold text-sm hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Log Override & Approve <ChevronRight className="w-4 h-4"/>
                </button>
                {justification.length > 0 && justification.length < 20 && (
                  <p className="text-xs text-rose-600 mt-2">Justification must be at least 20 characters.</p>
                )}
              </div>
            )}

            {/* Success State post-friction */}
            {(!aiResults.requiresJustification || isApproved) && (
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600"/>
                  <div>
                    <h3 className="font-bold text-emerald-900">Evaluation Logged</h3>
                    <p className="text-sm text-emerald-700">This project analysis has been recorded in the central audit ledger.</p>
                  </div>
                </div>
                <button className="bg-emerald-600 text-white px-6 py-2 rounded-sm font-bold text-sm hover:bg-emerald-700 transition-colors">
                  Export Report
                </button>
              </div>
            )}

          </div>
        )}
      </main>
    </div>
  );
}