export class ViralityScorer {
  static calculate_score(views: number, publishedTimestampSec: number, velocityMultiplier: number = 0.2, credibilityFactor: number = 1.0): number {
    const ageHours = Math.max(0.1, (Date.now() / 1000 - publishedTimestampSec) / 3600.0);
    const baseScore = Math.pow(views / (ageHours + 2.0), 1.2);
    const finalScore = baseScore * (1.0 + velocityMultiplier) * credibilityFactor;
    return Math.round(finalScore * 100) / 100;
  }
}
