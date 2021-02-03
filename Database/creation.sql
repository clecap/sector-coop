CREATE TABLE identity.users(
	id 					BIGINT,
	username 			VARCHAR(64) NOT NULL,
	hashed_password 	VARCHAR(64) NOT NULL,
	aes256_key 			VARCHAR(128),
	datablob 			VARCHAR(100),				
	created 			TIMESTAMP with time zone,
	PRIMARY KEY(id)
);

CREATE TABLE identity.pseudonyms(
	id					BIGINT,
	pseudonym			VARCHAR(64) NOT NULL,
	associated_user		BIGINT NOT NULL,
	PRIMARY KEY(id),
	FOREIGN KEY (associated_user) REFERENCES (identity.users.id)
);

-- what the documentation suggests:
CREATE TABLE documents.documents(
	id 					BIGINT;
	hash 				VARCHAR(64) NOT NULL,
	object_url 			VARCHAR(128),
	created 			TIMESTAMP with time zone,
	accepted 			TIMESTAMP with time zone,
	PRIMARY KEY(id)
);

----------------------------------------------------------------
-- instead, if the document itself is stored in the db:
CREATE TABLE documents.hashes(
	id					BIGINT;
	hash				VARCHAR(64) NOT NULL,
	PRIMARY KEY(id),
	FOREIGN KEY (hash) REFERENCES (documents.data.hash)
);

CREATE TABLE documents.data(
	hash				VARCHAR(64),
	binfile				BYTEA NOT NULL,
	PRIMARY KEY(hash)
);

CREATE TABLE documents.meta(
	id					BIGINT,
	created 			TIMESTAMP with time zone,
	accepted 			TIMESTAMP with time zone,
	FOREIGN KEY (id) REFERENCES (documents.hashes.id)
);
