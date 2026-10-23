-- ====================================================================
-- PostgreSQL Database Schema: SMK PGRI 2 Ponorogo AI Chatbot System
-- Enterprise-grade DDL with High-Concurrency Indexes and AES-256 Support
-- ====================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table: chat_sessions
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_identifier VARCHAR(128) NOT NULL DEFAULT 'anonymous-student',
    style_preference VARCHAR(32) NOT NULL DEFAULT 'formal',
    domain_focus VARCHAR(32) NOT NULL DEFAULT 'all',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: messages (AES-256-GCM Encrypted Storage)
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role VARCHAR(16) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    ciphertext TEXT NOT NULL,         -- Hex-encoded AES-256-GCM encrypted payload
    iv VARCHAR(32) NOT NULL,          -- Initialization Vector (12 bytes / 24-32 hex chars)
    auth_tag VARCHAR(32) NOT NULL,    -- GCM Authentication Tag (16 bytes / 32 hex chars)
    latency_ms INTEGER DEFAULT 0,
    from_cache BOOLEAN DEFAULT FALSE,
    tokens_estimate INTEGER DEFAULT 0,
    grounding_sources JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: caching_metrics (Redis Telemetry & Cache Logs)
CREATE TABLE IF NOT EXISTS caching_metrics (
    id SERIAL PRIMARY KEY,
    query_hash VARCHAR(64) NOT NULL,
    cache_hit BOOLEAN NOT NULL,
    latency_ms INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: school_knowledge_base (SMK PGRI 2 Ponorogo Domain Entities)
CREATE TABLE IF NOT EXISTS school_knowledge_base (
    id SERIAL PRIMARY KEY,
    category VARCHAR(64) NOT NULL, -- 'jurusan', 'ppdb', 'bkk', 'fasilitas', 'prestasi'
    entity_name VARCHAR(128) NOT NULL,
    details TEXT NOT NULL,
    industry_partners TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- High-Performance Indexes for Sub-millisecond Lookups
CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_caching_metrics_hash ON caching_metrics(query_hash);
CREATE INDEX IF NOT EXISTS idx_knowledge_category ON school_knowledge_base(category);

-- Seed Initial Knowledge Base for SMK PGRI 2 Ponorogo
INSERT INTO school_knowledge_base (category, entity_name, details, industry_partners) VALUES
('jurusan', 'Teknik Kendaraan Ringan Otomotif (TKRO)', 'Konsentrasi keahlian mekanikal roda empat dengan standar industri modern, mencakup EFI, transmisi matic, ECU tuning, dan servis berkala.', ARRAY['PT Astra Daihatsu Motor', 'PT Toyota Astra Motor']),
('jurusan', 'Teknik Bisnis Sepeda Motor (TBSM)', 'Kelas Industri resmi sepeda motor roda dua bersertifikasi resmi mekanik AHASS tingkat internasional.', ARRAY['PT Astra Honda Motor (AHM)', 'MPM Motor Jatim']),
('jurusan', 'Teknik Pemesinan (TP)', 'Keahlian manufaktur logam presisi, bubut konvensional, frais, dan pemrograman CNC (Computer Numerical Control).', ARRAY['PT Pama Persada Nusantara', 'PT Omron Manufacturing Indonesia']),
('jurusan', 'Desain Komunikasi Visual (DKV)', 'Studio visual kreatif mencakup fotografi profesional, videografi sinematik, desain grafis percetakan, dan animasi digital.', ARRAY['Creative Agency Jawa Timur', 'Industri Media Penyiaran']),
('jurusan', 'Rekayasa Perangkat Lunak (RPL)', 'Keahlian rekayasa software, web full-stack development, mobile application, database management, dan AI integration.', ARRAY['Software House Nasional', 'Startups']),
('bkk', 'Bursa Kerja Khusus (BKK) Sterida', 'Pusat rekrutmen tenaga kerja resmi sekolah dengan serapan kerja lebih dari 85% langsung ke BUMN, industri otomotif, alat berat, dan program magang kerja resmi ke Jepang.', ARRAY['Astra Group', 'PAMA', 'Magang Jepang IM Japan']),
('ppdb', 'PPDB SMK PGRI 2 Ponorogo', 'Penerimaan Peserta Didik Baru dengan jalur Minat Bakat, Prestasi Akademik/Non-Akademik, Reguler, serta program beasiswa khusus.', ARRAY['Jl. Soekarno-Hatta No. 94 Ponorogo'])
ON CONFLICT DO NOTHING;
