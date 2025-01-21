import { motion } from "framer-motion";
import { Brain, Loader2 } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";
import { TradingData, AIResponse } from "@/types/trading";

interface ImageAnalysisSectionProps {
  loading: boolean;
  aiResponse: AIResponse;
  onAnalysisComplete: (data: TradingData) => void;
  onGetAISuggestion: () => void;
}

export const ImageAnalysisSection = ({
  loading,
  aiResponse,
  onAnalysisComplete,
  onGetAISuggestion
}: ImageAnalysisSectionProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="backdrop-blur-lg bg-[#1A1F2C]/50 rounded-2xl p-6 border border-[#9b87f5]/20 relative overflow-hidden group hover:border-[#9b87f5]/40 transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#9b87f5]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <h2 className="text-xl font-semibold mb-4 text-[#9b87f5] relative z-10">Image Analysis</h2>
      <div className="relative z-10 space-y-4">
        <ImageUploader onAnalysisComplete={onAnalysisComplete} />
        
        <button
          onClick={onGetAISuggestion}
          disabled={loading}
          className="w-full relative z-10 py-3 px-4 bg-gradient-to-r from-[#9b87f5] to-[#8b77e5] hover:from-[#8b77e5] hover:to-[#7a66d4] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Analyzing Trading Data...</span>
            </>
          ) : (
            <>
              <Brain className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span>Get AI Trading Suggestion</span>
            </>
          )}
        </button>

        {aiResponse.suggestion && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="p-4 rounded-lg bg-[#1A1F2C]/50 border border-[#9b87f5]/20 relative z-10"
          >
            <p className="text-sm text-[#D6BCFA] leading-relaxed">{aiResponse.suggestion}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};