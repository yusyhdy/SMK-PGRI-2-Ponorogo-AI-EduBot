export interface GroundingSource {
  title: string;
  url: string;
}

export interface EncryptedPayload {
  ciphertext: string;
  iv: string;
  tag: string;
  algorithm?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: GroundingSource[];
  latencyMs?: number;
  fromCache?: boolean;
  cacheStatus?: string;
  encryptedPayload?: EncryptedPayload;
  suggestions?: string[];
  tokensEstimate?: number;
}

export interface DevOpsMetrics {
  totalRequests: number;
  cacheHits: number;
  cacheMisses: number;
  totalLatencyMs: number;
  queriesGroundingCount: number;
  activeConnections: number;
  dbRowsCount: number;
  avgLatencyMs: number;
  cacheHitRate: string;
  redisKeysCount: number;
  uptimeSeconds: number;
  systemStatus: {
    geminiEngine: string;
    redisCache: string;
    postgresDb: string;
    apiGateway: string;
  };
}

export interface DbRecord {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  createdAt: string;
  latencyMs: number;
  fromCache: boolean;
  tokensEstimate: number;
  encryptedCiphertext: string;
  fullCiphertext: string;
  iv: string;
  tag: string;
  decryptedPlaintext: string;
}

export type StyleOption = 'formal' | 'santai' | 'informatif' | 'konselor';
export type DomainOption = 'all' | 'ppdb' | 'jurusan' | 'bkk' | 'fasilitas';
