import { pipeline } from '@xenova/transformers';

let model: any;

export const loadModel = async () => {
  if (!model) {
    model = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return model;
};

const cosineSimilarity = (a: number[], b: number[]): number => {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return dot / (magA * magB);
};

export const getInsightScore = async (
  jobText: string,
  seekerText: string
): Promise<{ score: number; similarity: number }> => {
  const model = await loadModel();

  const jobEmbedding = await model(jobText, { pooling: 'mean', normalize: true });
  const seekerEmbedding = await model(seekerText, { pooling: 'mean', normalize: true });

  const similarity = cosineSimilarity(jobEmbedding.data, seekerEmbedding.data);
  const score = Math.round(similarity * 10 * 10) / 10;

  return {
    score,
    similarity: Math.round(similarity * 10000) / 10000,
  };
};
