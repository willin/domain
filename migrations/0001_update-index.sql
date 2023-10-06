DROP INDEX idx_records_pk;
CREATE INDEX IF NOT EXISTS idx_records_main ON records(`name`, `zone_id`);
