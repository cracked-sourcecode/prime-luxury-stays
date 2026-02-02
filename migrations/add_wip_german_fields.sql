-- Add German translation fields to wip_tasks table
ALTER TABLE wip_tasks ADD COLUMN IF NOT EXISTS title_de VARCHAR(255);
ALTER TABLE wip_tasks ADD COLUMN IF NOT EXISTS next_step_de TEXT;
ALTER TABLE wip_tasks ADD COLUMN IF NOT EXISTS notes_de TEXT;
