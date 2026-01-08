import React, { useState } from 'react';
import { ArrowLeft, Check, Layers, Users, Eye, Send } from 'lucide-react';
import Step1_Details from './Steps/Step1_Details';
import Step2_Template from './Steps/Step2_Template';
import Step3_Leads from './Steps/Step3_Leads';
import Step4_Preview from './Steps/Step4_Preview';
import Step5_Review from './Steps/Step5_Review';

const CampaignWizard = ({ onNavigate }) => {
    const [step, setStep] = useState(1);
    const [campaignData, setCampaignData] = useState({
        name: '',
        description: '',
        status: 'Draft',
        owner: 'Alex Morgan',
        channel: 'Email'
    });

    const updateData = (newData) => {
        setCampaignData(prev => ({ ...prev, ...newData }));
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const steps = [
        { num: 1, label: 'Details', icon: Layers },
        { num: 2, label: 'Template', icon: Layers }, // Placeholder icon
        { num: 3, label: 'Leads', icon: Users },
        { num: 4, label: 'Preview', icon: Eye },
        { num: 5, label: 'Review', icon: Send }
    ];

    return (
        <div className="h-screen flex flex-col bg-slate-50">
            {/* Wizard Header */}
            <div className="bg-white border-b border-slate-200 px-8 py-4 shadow-sm z-10 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button onClick={() => onNavigate('marketing-dashboard')} className="text-slate-400 hover:text-slate-800 transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="font-bold text-xl text-slate-800">New Campaign</h1>
                </div>

                {/* Progress Indicators */}
                <div className="flex items-center gap-2">
                    {steps.map((s, idx) => (
                        <div key={s.num} className="flex items-center">
                            <div className={`
                                flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border
                                ${step === s.num ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                    step > s.num ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white text-slate-400 border-transparent'}
                            `}>
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === s.num ? 'bg-blue-600 text-white' :
                                    step > s.num ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                    {step > s.num ? <Check size={10} /> : s.num}
                                </div>
                                <span className="hidden md:inline">{s.label}</span>
                            </div>
                            {idx < steps.length - 1 && (
                                <div className={`w-6 h-0.5 mx-1 ${step > s.num ? 'bg-green-200' : 'bg-slate-100'}`} />
                            )}
                        </div>
                    ))}
                </div>

                <div className="w-24"></div> {/* Spacer for balance */}
            </div>

            {/* Wizard Content */}
            <div className="flex-1 overflow-y-auto p-8">
                {step === 1 && (
                    <Step1_Details
                        data={campaignData}
                        onUpdate={updateData}
                        onNext={nextStep}
                    />
                )}
                {step === 2 && (
                    <Step2_Template
                        data={campaignData}
                        onUpdate={updateData}
                        onNext={nextStep}
                        onBack={prevStep}
                    />
                )}
                {step === 3 && (
                    <Step3_Leads
                        data={campaignData}
                        onUpdate={updateData}
                        onNext={nextStep}
                        onBack={prevStep}
                    />
                )}
                {step === 4 && (
                    <Step4_Preview
                        data={campaignData}
                        onUpdate={updateData}
                        onNext={nextStep}
                        onBack={prevStep}
                    />
                )}
                {step === 5 && (
                    <Step5_Review
                        data={campaignData}
                        onUpdate={updateData}
                        onNext={nextStep}
                        onBack={prevStep}
                    />
                )}
                {step === 6 && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                            <Send size={40} />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-800">Campaign Launched!</h2>
                        <p className="text-slate-600 max-w-md">
                            Your campaign has been successfully queued. You can track real-time performance in the dashboard.
                        </p>
                        <button
                            onClick={() => onNavigate('marketing-dashboard')}
                            className="mt-8 px-6 py-3 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900 shadow-md transition-all"
                        >
                            Return to Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CampaignWizard;
