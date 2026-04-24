import React, { useState } from 'react';
import { Network, PlayCircle, Settings2, Hexagon as HexagonIcon } from 'lucide-react';
import HoneycombCanvas from './HoneycombCanvas';
import DrillDownViews from './DrillDownViews';
import RuleMatrix from './RuleMatrix';
import SimulationPanel from './SimulationPanel';

const INITIAL_FRAMEWORK_STATE = {
    frameworkId: 'FW-001',
    frameworkName: 'CDFI Underwriting Framework',
    status: 'Active',
    version: '1.0',
    decisionBands: [
        { label: 'Decline', min: 0, max: 39, color: 'text-rose-500', bg: 'bg-rose-500/10' },
        { label: 'Refer / Review', min: 40, max: 64, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { label: 'Approve', min: 65, max: 100, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    ],
    modules: [
        {
            moduleId: 'MOD-1',
            moduleName: 'Business Strength',
            description: 'Evaluates business maturity and resilience.',
            weight: 20,
            aggregationType: 'WEIGHTED_AVERAGE',
            colorTheme: '#3b82f6', // Blue
            score: 72,
            confidence: 94,
            features: [
                {
                    featureId: 'FEAT-1',
                    featureName: 'Operational History',
                    description: 'Time in business and stability',
                    weight: 100,
                    score: 72,
                    attributes: []
                }
            ]
        },
        {
            moduleId: 'MOD-2',
            moduleName: 'Cash Flow Strength',
            description: 'Measures cash flow stability and capacity.',
            weight: 25,
            aggregationType: 'WEIGHTED_AVERAGE',
            colorTheme: '#0d9488', // Teal
            score: 68,
            confidence: 88,
            features: [
                {
                    featureId: 'FEAT-2',
                    featureName: 'Operating Cash Flow',
                    description: 'Evaluates operating cash flow indicators',
                    weight: 40,
                    score: 72,
                    attributes: [
                        { 
                            id: 'A1', 
                            name: 'Annual Revenue Tier', 
                            type: 'Derived',
                            sourceVariable: 'revenue_totalAnnual',
                            format: 'Categorical_Band',
                            bins: [
                                { id: 'B1', label: 'Very Low', min: 0, max: 10000, inclusive: true }, 
                                { id: 'B2', label: 'Low', min: 10000, max: 50000, inclusive: true },
                                { id: 'B3', label: 'Medium', min: 50000, max: 250000, inclusive: true },
                                { id: 'B4', label: 'High', min: 250000, max: 1000000, inclusive: true },
                                { id: 'B5', label: 'Very High', min: 1000000, max: 9999999, inclusive: true }
                            ] 
                        },
                        { 
                            id: 'A2', 
                            name: 'Capacity Size Bucket', 
                            type: 'Direct',
                            sourceVariable: 'ftes_current',
                            format: 'Categorical_Band',
                            bins: [
                                { id: 'B1', label: '0-1 FTE', min: 0, max: 1, inclusive: true }, 
                                { id: 'B2', label: '1-2 FTEs', min: 1, max: 2, inclusive: true },
                                { id: 'B3', label: '3-5 FTEs', min: 3, max: 5, inclusive: true },
                                { id: 'B4', label: '5-10 FTEs', min: 5, max: 10, inclusive: true },
                                { id: 'B5', label: '10+ FTEs', min: 10, max: 999, inclusive: true }
                            ] 
                        },
                        { 
                            id: 'A3', 
                            name: 'Business Maturity', 
                            type: 'Derived',
                            sourceVariable: 'busAge_yrs',
                            format: 'Categorical_Band',
                            bins: [
                                { id: 'B1', label: 'Startup (0-2)', min: 0, max: 2, inclusive: true }, 
                                { id: 'B2', label: 'Early Phase (2-3)', min: 2, max: 3, inclusive: true },
                                { id: 'B3', label: 'Growth (3-5)', min: 3, max: 5, inclusive: true },
                                { id: 'B4', label: 'Established (5-10)', min: 5, max: 10, inclusive: true },
                                { id: 'B5', label: 'Mature (10+)', min: 10, max: 99, inclusive: true }
                            ] 
                        }
                    ],
                    auxiliaryInputs: [
                        { id: 'AUX1', name: 'industry_code', type: 'Categorical', sourceVariable: 'naics_code' }
                    ],
                    rules: [
                        // Intelligence Logic Layer attached to combination
                        { 
                            ruleId: 'R1', 
                            conditions: { A1: 'B4', A2: 'B4', A3: 'B3' }, 
                            auxiliaryCondition: { AUX1: 'Manufacturing'},
                            propensityScore: 2.8, 
                            modelSuggestedScore: 3.1,
                            sampleCount: 62,
                            goodBadRatio: 0.88,
                            confidenceFlag: 'high'
                        },
                        { 
                            ruleId: 'R2', 
                            conditions: { A1: 'B1', A2: 'B1', A3: 'B1' }, 
                            propensityScore: 0.4, 
                            modelSuggestedScore: 0.9,
                            sampleCount: 8,
                            goodBadRatio: 0.22,
                            confidenceFlag: 'low' // Needs human review due to low n
                        }
                    ]
                },
                { featureId: 'FEAT-3', featureName: 'Revenue & Growth', description: '', weight: 30, score: 65, attributes: [] },
                { featureId: 'FEAT-4', featureName: 'Cash Flow Volatility', description: '', weight: 30, score: 60, attributes: [] }
            ]
        },
        { moduleId: 'MOD-3', moduleName: 'Financial Health', description: '', weight: 20, aggregationType: 'AVERAGE', colorTheme: '#8b5cf6', score: 65, confidence: 91, features: [] },
        { moduleId: 'MOD-4', moduleName: 'Digital Footprint', description: '', weight: 15, aggregationType: 'AVERAGE', colorTheme: '#10b981', score: 58, confidence: 71, features: [] },
        { moduleId: 'MOD-5', moduleName: 'Community Impact', description: '', weight: 10, aggregationType: 'AVERAGE', colorTheme: '#f59e0b', score: 75, confidence: 85, features: [] }
    ]
};

const HoneycombLayout = () => {
    const [framework, setFramework] = useState(INITIAL_FRAMEWORK_STATE);
    
    // Drill-down selection states defining context
    const [selectedModuleId, setSelectedModuleId] = useState('MOD-2');
    const [selectedFeatureId, setSelectedFeatureId] = useState('FEAT-2');
    const [selectedAttributeId, setSelectedAttributeId] = useState('A1');

    // Context getters
    const getActiveModule = () => framework.modules.find(m => m.moduleId === selectedModuleId);
    const getActiveFeature = () => {
        const mod = getActiveModule();
        return mod ? mod.features.find(f => f.featureId === selectedFeatureId) : null;
    };
    const getActiveAttribute = () => {
        const feat = getActiveFeature();
        return feat ? feat.attributes.find(v => v.id === selectedAttributeId) : null;
    };

    // State updaters
    const handleUpdateModule = (updatedModule) => {
        setFramework(prev => ({
            ...prev,
            modules: prev.modules.map(m => m.moduleId === updatedModule.moduleId ? updatedModule : m)
        }));
    };

    const handleUpdateFeature = (updatedFeature) => {
        const mod = getActiveModule();
        if (!mod) return;
        const newMod = {
            ...mod,
            features: mod.features.map(f => f.featureId === updatedFeature.featureId ? updatedFeature : f)
        };
        handleUpdateModule(newMod);
    };

    // Strict Navigation Handlers
    const handleSelectModule = (id) => {
        setSelectedModuleId(id);
        const mod = framework.modules.find(m => m.moduleId === id);
        if (mod && mod.features.length > 0) {
            setSelectedFeatureId(mod.features[0].featureId);
            const firstFeat = mod.features[0];
            if (firstFeat.attributes && firstFeat.attributes.length > 0) {
                setSelectedAttributeId(firstFeat.attributes[0].id);
            } else {
                setSelectedAttributeId(null);
            }
        } else {
            setSelectedFeatureId(null);
            setSelectedAttributeId(null);
        }
    };

    const handleSelectFeature = (id) => {
        setSelectedFeatureId(id);
        const feat = getActiveModule()?.features.find(f => f.featureId === id);
        if (feat && feat.attributes && feat.attributes.length > 0) {
            setSelectedAttributeId(feat.attributes[0].id);
        } else {
            setSelectedAttributeId(null);
        }
    };

    const handleSelectAttribute = (id) => {
        setSelectedAttributeId(id);
    };


    return (
        <div className="flex flex-col h-full w-full bg-slate-50 text-slate-700 font-sans overflow-x-hidden overflow-y-auto custom-scrollbar pb-10">
            
            <div className="p-4 space-y-4 max-w-[1600px] w-full mx-auto">
                {/* ROW 1: CANVAS */}
                <div className="w-full">
                    <HoneycombCanvas 
                        framework={framework} 
                        selectedModuleId={selectedModuleId} 
                        onSelectModule={handleSelectModule} 
                    />
                </div>

                {/* ROW 2: DRILL DOWN (Module | Feature | Attribute) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-1">
                        <DrillDownViews 
                            viewMode="module" 
                            data={getActiveModule()} 
                            onUpdate={handleUpdateModule}
                            selectedFeatureId={selectedFeatureId}
                            onSelectFeature={handleSelectFeature}
                        />
                    </div>
                    <div className="lg:col-span-1">
                        <DrillDownViews 
                            viewMode="feature" 
                            data={getActiveFeature()} 
                            onUpdate={handleUpdateFeature}
                            selectedAttributeId={selectedAttributeId}
                            onSelectAttribute={handleSelectAttribute}
                        />
                    </div>
                    <div className="lg:col-span-1">
                        <DrillDownViews 
                            viewMode="attribute" 
                            data={getActiveAttribute()} 
                            featureData={getActiveFeature()}
                            onUpdateFeature={handleUpdateFeature}
                        />
                    </div>
                </div>

                {/* ROW 3: RULE MATRIX WITH INTELLIGENCE OVERLAYS */}
                <div className="w-full">
                    <RuleMatrix 
                        feature={getActiveFeature()} 
                        onUpdateFeature={handleUpdateFeature} 
                    />
                </div>

                {/* ROW 4: PREVIEW WITH DECISIONS & MANAGEMENT */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <SimulationPanel framework={framework} />
                    
                    {/* Management Panel */}
                    <div className="bg-white border border-slate-200 rounded-xl flex flex-col p-5 shadow-lg">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">7. Framework Management</h3>
                        </div>
                        <div className="flex flex-col gap-2">
                            {[
                                { name: 'CDFI Underwriting Framework v1.0', status: 'Active', date: 'May 12, 2024'},
                                { name: 'CDFI Underwriting Framework v0.9', status: 'Draft', date: 'Apr 20, 2024'},
                                { name: 'SME Quick Score v1.0', status: 'Published', date: 'Mar 15, 2024'},
                                { name: 'Green Loan Framework v1.0', status: 'Draft', date: 'Feb 10, 2024'}
                            ].map((fw, i) => (
                                <div key={i} className="flex justify-between items-center py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg">
                                    <span className="text-xs font-semibold text-slate-700">{fw.name}</span>
                                    <div className="flex items-center gap-4 text-xs font-mono">
                                        <span className={`${fw.status === 'Active' ? 'text-emerald-400' : fw.status === 'Draft' ? 'text-slate-400' : 'text-blue-400'}`}>{fw.status}</span>
                                        <span className="text-slate-400">{fw.date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="mt-4 w-1/3 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg text-xs transition-colors self-start shadow-md border border-blue-500 shadow-blue-500/20">
                            + Create New Framework
                        </button>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default HoneycombLayout;
