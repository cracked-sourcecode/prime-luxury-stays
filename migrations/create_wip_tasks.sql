-- =============================================
-- WIP (Work In Progress) Tasks Table
-- =============================================
CREATE TABLE IF NOT EXISTS wip_tasks (
    id SERIAL PRIMARY KEY,
    
    -- Task info
    title VARCHAR(255) NOT NULL,
    next_step TEXT,
    priority VARCHAR(20) NOT NULL DEFAULT 'medium',  -- critical, high, medium, low
    
    -- Assignment
    assigned_to VARCHAR(100),
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'active',  -- active, complete
    is_complete BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Organization
    category VARCHAR(100),
    sort_order INTEGER DEFAULT 0,
    
    -- Notes
    notes TEXT,
    
    -- Tracking
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_wip_tasks_status ON wip_tasks(status);
CREATE INDEX IF NOT EXISTS idx_wip_tasks_priority ON wip_tasks(priority);
CREATE INDEX IF NOT EXISTS idx_wip_tasks_is_complete ON wip_tasks(is_complete);
CREATE INDEX IF NOT EXISTS idx_wip_tasks_assigned_to ON wip_tasks(assigned_to);
