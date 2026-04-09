-- VocalPDF Persistence Infrastructure
-- Prefix: vp_

-- 1. Create Documents Metadata Table
CREATE TABLE IF NOT EXISTS vp_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    size INTEGER NOT NULL, -- Size in bytes
    current_sentence_index INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Documents
ALTER TABLE vp_documents ENABLE ROW LEVEL SECURITY;

-- Documents Policies
CREATE POLICY "Users can manage their own vp_documents" ON vp_documents
    FOR ALL USING (auth.uid() = user_id);

-- 2. Create Storage Bucket (vp_storage)
-- Note: This must be run through the Supabase Dashboard or API
-- You can use the Supabase UI to create a bucket named 'vp_storage'
-- and then apply the following RLS policies:

-- Storage Policies for 'vp_storage'
-- 1. Give users access to their own folder (auth.uid() path structure)
CREATE POLICY "Users can upload their own vp_pdfs" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'vp_storage' AND 
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can view their own vp_pdfs" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'vp_storage' AND 
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can delete their own vp_pdfs" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'vp_storage' AND 
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- 3. Automatic Updated At
CREATE OR REPLACE FUNCTION update_vp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER tr_vp_update_documents_timestamp
    BEFORE UPDATE ON vp_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_vp_updated_at();
