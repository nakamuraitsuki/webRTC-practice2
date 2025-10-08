package postgresqlrepo

import (
	"context"
	"errors"
	"time"

	"example.com/infrahandson/internal/domain/entity"
	"example.com/infrahandson/internal/domain/repository"
	"github.com/jmoiron/sqlx"
)

type MessageRepositoryImpl struct {
	db *sqlx.DB
}

type NewMessageRepositoryImplParams struct {
	DB *sqlx.DB
}

func (p *NewMessageRepositoryImplParams) Validate() error {
	if p.DB == nil {
		return errors.New("DB is nil")
	}
	return nil
}

func NewMessageRepositoryImpl(params *NewMessageRepositoryImplParams) repository.MessageRepository {
	if err := params.Validate(); err != nil {
		panic(err)
	}
	return &MessageRepositoryImpl{
		db: params.DB,
	}
}

func (r *MessageRepositoryImpl) CreateMessage(ctx context.Context, message *entity.Message) error {
	return nil
}

func (r *MessageRepositoryImpl) GetMessageHistoryInRoom(
	ctx context.Context,
	roomID entity.RoomID,
	limit int,
	beforeSentAt time.Time,
) (messages []*entity.Message, nextBeforeSentAt time.Time, hasNext bool, err error) {
	return nil, time.Time{}, false, nil
}
