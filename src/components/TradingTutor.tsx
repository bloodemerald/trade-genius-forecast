import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Loader2, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const TradingTutor = () => {
  const [question, setQuestion] = useState("");
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const askQuestion = async () => {
    if (!question.trim()) {
      toast({
        title: "Question Required",
        description: "Please enter a trading-related question.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('trading-tutor', {
        body: { question: question.trim() }
      });

      if (error) throw error;
      setExplanation(data.explanation);
      setQuestion("");
    } catch (error) {
      console.error('Error getting explanation:', error);
      toast({
        title: "Error",
        description: "Failed to get explanation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-lg bg-[#1A1F2C]/50 rounded-2xl p-6 border border-[#9b87f5]/20 relative overflow-hidden group hover:border-[#9b87f5]/40 transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#9b87f5]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="flex items-center gap-2 mb-4">
        <Brain className="text-[#9b87f5]" size={20} />
        <h2 className="text-xl font-semibold text-[#9b87f5]">Trading Tutor</h2>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about any trading concept..."
            className="flex-1 bg-[#1A1F2C] border border-[#9b87f5]/20 rounded-lg px-4 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:border-[#9b87f5]/40"
            onKeyPress={(e) => e.key === 'Enter' && askQuestion()}
          />
          <button
            onClick={askQuestion}
            disabled={loading}
            className="px-4 py-2 bg-[#9b87f5] hover:bg-[#8b77e5] text-white rounded-lg transition-colors duration-300 flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send size={16} />
            )}
            Ask
          </button>
        </div>

        {explanation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-[#1A1F2C]/50 border border-[#9b87f5]/20"
          >
            <p className="text-sm text-[#D6BCFA] leading-relaxed whitespace-pre-wrap">
              {explanation}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};