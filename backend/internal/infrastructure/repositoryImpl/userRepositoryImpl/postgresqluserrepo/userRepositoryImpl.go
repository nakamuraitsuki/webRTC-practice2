package postgresqluserrepo

import (
	"context"
	"errors"

	"example.com/infrahandson/internal/domain/entity"
	"example.com/infrahandson/internal/domain/repository"
	"github.com/jmoiron/sqlx"
)

type UserRepositoryImpl struct {
	db *sqlx.DB
}

type NewUserRepositoryImplParams struct {
	DB *sqlx.DB
}

func (p *NewUserRepositoryImplParams) Validate() error {
	if p.DB == nil {
		return errors.New("db cannot be nil")
	}
	return nil
}

func NewUserRepositoryImpl(params *NewUserRepositoryImplParams) repository.UserRepository {
	if err := params.Validate(); err != nil {
		panic(err)
	}
	return &UserRepositoryImpl{
		db: params.DB,
	}
}

func (r *UserRepositoryImpl) SaveUser(ctx context.Context, user *entity.User) (*entity.User, error) {
	return nil, nil
}

func (r *UserRepositoryImpl) GetUserByID(ctx context.Context, id entity.UserID) (*entity.User, error) {
	return nil, nil
}

func (r *UserRepositoryImpl) GetUserByEmail(ctx context.Context, email string) (*entity.User, error) {
	return nil, nil
}
