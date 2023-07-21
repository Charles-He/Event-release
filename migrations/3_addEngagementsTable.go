package main

import (
	"fmt"

	"github.com/go-pg/migrations/v8"
)

func init() {
	migrations.MustRegisterTx(func(db migrations.DB) error {
		fmt.Println("creating table engagements...")
		_, err := db.Exec(`CREATE TABLE engagements(
			id SERIAL PRIMARY KEY,
			title TEXT NOT NULL,
			time TEXT NOT NULL,
			site TEXT NOT NULL,
			address TEXT NOT NULL,
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
			modified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
			user_id INT REFERENCES users ON DELETE CASCADE
		)`)
		return err
	}, func(db migrations.DB) error {
		fmt.Println("dropping table engagements...")
		_, err := db.Exec(`DROP TABLE engagements`)
		return err
	})
}
