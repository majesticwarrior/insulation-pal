-- Add 'won' status to assignment_status enum
-- This allows us to distinguish between:
-- - 'accepted': Contractor accepted the lead and submitted a quote
-- - 'won': Customer accepted this contractor's quote (won the bid)
-- - 'declined': Either contractor declined or lost the bid

-- First, add 'won' to the existing enum
ALTER TYPE assignment_status ADD VALUE IF NOT EXISTS 'won';

-- Note: After running this, contractors who win bids will have status 'won'
-- Contractors who lose bids will have status 'declined'

