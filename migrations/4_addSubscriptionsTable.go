package main

import (
	"fmt"

	"github.com/go-pg/migrations/v8"
)

func init() {
	migrations.MustRegisterTx(func(db migrations.DB) error {
		fmt.Println("creating table subscriptions...")
		_, err := db.Exec(`CREATE TABLE subscriptions(
			id SERIAL PRIMARY KEY,
			engagement_id INT NOT NULL,
			first_name TEXT NOT NULL,
			last_name TEXT NOT NULL,
			mobile TEXT NOT NULL,
			email TEXT NOT NULL,
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
			modified_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		)`)
		return err
	}, func(db migrations.DB) error {
		fmt.Println("dropping table subscriptions...")
		_, err := db.Exec(`DROP TABLE subscriptions`)
		return err
	})
}
