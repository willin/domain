CREATE TABLE `records` (
	`username` text NOT NULL,
	`pending` integer DEFAULT 1,
	`pursose` text,
	`name` text NOT NULL,
	`content` text NOT NULL,
	`type` text NOT NULL,
	`zone_id` text NOT NULL,
	`ttl` integer DEFAULT 1,
	`proxied` integer DEFAULT 1,
	`priority` integer,
	`raw` text NOT NULL,
	`created_at` INTEGER NOT NULL DEFAULT current_timestamp,
	id AS (json_extract(`raw`, '$.id')) STORED
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_records_pk ON records(`name`, `zone_id`);
CREATE INDEX IF NOT EXISTS idx_records_user ON records(`username`, `created_at`);
CREATE INDEX IF NOT EXISTS idx_records_status ON records(`pending`, `created_at`);
CREATE INDEX IF NOT EXISTS idx_records_id ON records(`id`);
CREATE INDEX IF NOT EXISTS idx_records_zone_id ON records(`zone_id`);
