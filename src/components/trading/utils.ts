export const getScenarioExplanation = (riskReward: number, potential: number, confidence: number) => {
  let explanation = "";
  
  if (confidence >= 80) {
    explanation = "High confidence setup with strong technical alignment. Consider following strict risk management rules.";
  } else if (confidence >= 60) {
    explanation = "Moderate confidence setup. Exercise caution and consider reducing position size.";
  } else {
    explanation = "Low confidence setup. Consider waiting for better opportunities or skip this trade.";
  }
  
  if (riskReward >= 3) {
    explanation += " Favorable risk-to-reward ratio suggests good potential for profits.";
  } else if (riskReward >= 2) {
    explanation += " Acceptable risk-to-reward ratio, manage position size accordingly.";
  } else {
    explanation += " Lower risk-to-reward ratio, consider waiting for better setups.";
  }
  
  return explanation;
};