import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Calendar, User, FileText, Microscope, Download, 
  Activity, ChevronDown, ChevronUp,
  Droplets, ShieldAlert, Target, ScanFace
} from "lucide-react";

// Robust Interface Definitions
interface ScanCondition {
  label: string;
}

interface LifestyleTip {
  title?: string;
  description?: string;
}

interface ScanData {
  id: string | number;
  image_url: string;
  created_at: string;
  user_name?: string;
  overall_severity?: string;
  skin_type?: string;
  confidence: number;
  score: number;
  conditions?: ScanCondition[];
  treatment?: string;
  precautions?: string;
  lifestyle?: LifestyleTip[];
}

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  scan: ScanData | null;
}

export default function ScanDetailsDrawer({ isOpen, onClose, scan }: DrawerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!scan) return null;

  const isConcern = scan.overall_severity?.toLowerCase() !== 'healthy';
  const formattedDate = new Date(scan.created_at).toLocaleDateString('en-US', { 
    month: 'long', day: 'numeric', year: 'numeric' 
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[1000]"
          />
          
          {/* Main Drawer */}
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-[600px] bg-white border-l border-slate-200 z-[1001] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <header className="px-8 py-5 bg-white border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#00A3AD] flex items-center justify-center text-white">
                  <ScanFace size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-slate-900 leading-none">Facial Assessment</h2>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[9px] font-bold uppercase tracking-wider border border-slate-200">
                      v2.4 Core
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    REFERENCE ID: <span className="font-mono text-slate-600 uppercase">{scan.id?.toString().slice(0, 8)}</span>
                  </p>
                </div>
              </div>
              
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-200"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </header>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-8 py-8 space-y-10">
              
              {/* Patient Top Section */}
              <section className="flex gap-8 items-start">
                <div className="relative shrink-0">
                  <div className="w-44 h-44 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                    <img src={scan.image_url} alt="Scan Result" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-lg border border-slate-200 text-[#00A3AD]">
                    <Target size={18} />
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-2 gap-3">
                  <div className="col-span-2 mb-1">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Metadata Registry</h3>
                  </div>
                  <InfoPlate icon={<User size={14}/>} label="Subject" value={scan.user_name || "Anonymous"} />
                  <InfoPlate icon={<Calendar size={14}/>} label="Timestamp" value={formattedDate} />
                  <InfoPlate icon={<Activity size={14}/>} label="Status" value={isConcern ? "Review Required" : "Healthy / Stable"} />
                  <InfoPlate icon={<ShieldAlert size={14}/>} label="Methodology" value="AI-Vision" />
                </div>
              </section>

              {/* Key Diagnostics */}
              <div className="grid grid-cols-3 gap-3">
                <MetricCard icon={<Droplets size={14}/>} label="Skin Texture" value={scan.skin_type || "Type II"} variant="neutral" />
                <MetricCard icon={<ShieldAlert size={14}/>} label="Confidence" value={`${Math.round(scan.confidence)}%`} variant={isConcern ? "warning" : "success"} />
                <MetricCard icon={<Target size={14}/>} label="Health Score" value={`${scan.score}/100`} variant="highlight" />
              </div>

              {/* Summary Callout */}
              <section className="bg-slate-50 rounded-2xl p-6 border border-slate-200 relative overflow-hidden">
                <div className="relative z-10">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Diagnostic Observation</h4>
                  <p className="text-lg font-medium text-slate-800 leading-snug">
                    {scan.conditions?.[0]?.label || "No significant dermatological irregularities detected."}
                  </p>
                </div>
                <Microscope size={60} className="absolute -bottom-2 -right-2 text-slate-200/50 pointer-events-none" />
              </section>

              {/* Action Plan */}
              <motion.section layout className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="text-[#00A3AD]" size={18} />
                    <h4 className="font-semibold text-slate-900">Clinical Protocol</h4>
                  </div>
                  <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-xs font-bold text-[#00A3AD] hover:underline flex items-center gap-1"
                  >
                    {isExpanded ? 'Collapse' : 'Detailed Report'}
                    {isExpanded ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                  </button>
                </div>

                <div className="p-6 grid grid-cols-2 gap-8">
                  <ProtocolItem label="Strategy" content={scan.treatment} />
                  <ProtocolItem label="Precautions" content={scan.precautions} />
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="overflow-hidden bg-slate-50/50"
                    >
                      <div className="p-6 pt-0 space-y-6">
                        <div className="h-px bg-slate-200 w-full" />
                        <div>
                          <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Lifestyle Adjustments</h5>
                          <div className="space-y-2">
                            {scan.lifestyle?.map((tip, i) => (
                              <div key={i} className="flex items-center gap-3 text-sm text-slate-600 bg-white p-3 rounded-xl border border-slate-100">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#00A3AD]" />
                                {tip.title || tip.description}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.section>
            </div>

            {/* Sticky Footer */}
            <footer className="px-8 py-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">End-to-End Encrypted</span>
              </div>
              <button className="flex items-center gap-2.5 px-6 py-3 bg-[#0f172a] text-white rounded-xl font-semibold text-sm hover:bg-slate-800 transition-all active:scale-[0.98]">
                <Download size={16} />
                Export PDF
              </button>
            </footer>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Sub-components with refined styling
function MetricCard({ icon, label, value, variant }: { icon: any, label: string, value: string, variant: string }) {
  const styles: Record<string, string> = {
    neutral: "bg-white border-slate-200 text-slate-900",
    success: "bg-emerald-50/50 border-emerald-100 text-emerald-700",
    warning: "bg-amber-50/50 border-amber-100 text-amber-700",
    highlight: "bg-[#00A3AD]/5 border-[#00A3AD]/20 text-[#00A3AD]",
  };

  return (
    <div className={`p-4 rounded-2xl border ${styles[variant]}`}>
      <div className="flex items-center gap-2 mb-1.5 opacity-70">
        {icon}
        <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}

function InfoPlate({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="px-3 py-2.5 bg-slate-50/50 rounded-xl border border-slate-100 flex items-center gap-3">
      <div className="text-slate-400">{icon}</div>
      <div className="min-w-0">
        <p className="text-[8px] font-bold text-slate-400 uppercase leading-none mb-1">{label}</p>
        <p className="text-[13px] font-medium text-slate-700 truncate leading-none">{value}</p>
      </div>
    </div>
  );
}

function ProtocolItem({ label, content }: { label: string, content?: string }) {
  return (
    <div className="space-y-1.5">
      <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</h5>
      <p className="text-slate-600 text-[13px] leading-relaxed">
        {content || "No specific data provided."}
      </p>
    </div>
  );
}