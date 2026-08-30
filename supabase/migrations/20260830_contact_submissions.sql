-- Create contact_submissions table in Supabase
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    city VARCHAR(100),
    subject VARCHAR(255) NOT NULL DEFAULT 'समाचार सुझाव / जनसमस्या',
    message TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'in_review', 'resolved'
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexing for fast search
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON public.contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_reference_id ON public.contact_submissions(reference_id);

-- Enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous users to insert contact messages
CREATE POLICY "Public can submit contact form" 
ON public.contact_submissions 
FOR INSERT 
WITH CHECK (true);

-- Allow authenticated staff / service_role to read and manage all contact submissions
CREATE POLICY "Staff can view and manage contact submissions" 
ON public.contact_submissions 
FOR ALL 
USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
