export class SemanticTextChunker {
  chunkSize: number;
  chunkOverlap: number;

  constructor(chunkSize: number = 512, chunkOverlap: number = 64) {
    this.chunkSize = chunkSize;
    this.chunkOverlap = chunkOverlap;
  }

  split_text(text: string): string[] {
    const cleanedText = text.replace(/\s+/g, " ").trim();
    if (!cleanedText) return [];

    const sentences = cleanedText.split(/(?<=[.!?]) +/);
    const chunks: string[] = [];
    let currentChunk: string[] = [];
    let currentLength = 0;

    for (const sentence of sentences) {
      if (currentLength + sentence.length > this.chunkSize && currentChunk.length > 0) {
        chunks.push(currentChunk.join(" "));
        currentChunk = [];
        currentLength = 0;
      }
      currentChunk.push(sentence);
      currentLength += sentence.length;
    }

    if (currentChunk.length > 0) {
      chunks.push(currentChunk.join(" "));
    }

    return chunks;
  }
}
