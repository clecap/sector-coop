CREATE SCHEMA documents
    AUTHORIZATION postgres;

CREATE TABLE documents.hashes
(
    sha256_hash character(64) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT hashes_pkey PRIMARY KEY (sha256_hash)
)

TABLESPACE pg_default;

ALTER TABLE documents.hashes
    OWNER to postgres;