package postgresql

import (
	"errors"
	"log"

	"example.com/infrahandson/internal/interface/gateway"
	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	"github.com/jmoiron/sqlx"
)

type PostgresInitializer struct {
	dsn            string
	migrationsPath string
}

type NewPostgresInitializerParams struct {
	DSN            *string
	MigrationsPath string
}

func (p *NewPostgresInitializerParams) Validate() error {
	if p.DSN == nil {
		return errors.New("DSN is required")
	}
	if p.MigrationsPath == "" {
		return errors.New("migrationsPath is required")
	}
	return nil
}

func NewPostgresInitializer(params *NewPostgresInitializerParams) gateway.DBInitializer {
	if err := params.Validate(); err != nil {
		panic(err)
	}
	// Validateに通るなら，*params.DSNがnil pointerにならないことが保証される
	return &PostgresInitializer{
		dsn:            *params.DSN,
		migrationsPath: params.MigrationsPath,
	}
}

func (i *PostgresInitializer) Init() (*sqlx.DB, error) {
	db, err := sqlx.Open("postgres", i.dsn)
	if err != nil {
		return nil, err
	}

	if err := db.Ping(); err != nil {
		return nil, err
	}
	log.Printf("PostgreSQL connected\n")
	return db, nil
}

func (i *PostgresInitializer) InitSchema(db *sqlx.DB) error {
	driver, err := postgres.WithInstance(db.DB, &postgres.Config{})
	if err != nil {
		return err
	}

	path := "file://" + i.migrationsPath

	m, err := migrate.NewWithDatabaseInstance(
		path,
		"postgres",
		driver,
	)
	if err != nil {
		return err
	}

	if err := m.Up(); err != nil && !errors.Is(err, migrate.ErrNoChange) {
		return err
	}
	log.Printf("PostgreSQL migrated\n")
	return nil
}
