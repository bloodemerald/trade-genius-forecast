/**
 * Generates a scenario explanation based on risk/reward ratio, potential gain, and confidence level
 * @param riskReward - The risk to reward ratio of the trade
 * @param potential - The potential percentage gain
 * @param confidence - The confidence score (0-100)
 * @returns A string explaining the trading scenario
 */
export const getScenarioExplanation = (riskReward: number, potential: number, confidence: number) => {
  let explanation = "";
  
  // Determine confidence level explanation
  if (confidence >= 80) {
    explanation = "High confidence setup with strong technical alignment. Consider following strict risk management rules.";
  } else if (confidence >= 60) {
    explanation = "Moderate confidence setup. Exercise caution and consider reducing position size.";
  } else {
    explanation = "Low confidence setup. Consider waiting for better opportunities or skip this trade.";
  }
  
  // Add risk/reward analysis
  if (riskReward >= 3) {
    explanation += " Favorable risk-to-reward ratio suggests good potential for profits.";
  } else if (riskReward >= 2) {
    explanation += " Acceptable risk-to-reward ratio, manage position size accordingly.";
  } else {
    explanation += " Lower risk-to-reward ratio, consider waiting for better setups.";
  }
  
  return explanation;
};