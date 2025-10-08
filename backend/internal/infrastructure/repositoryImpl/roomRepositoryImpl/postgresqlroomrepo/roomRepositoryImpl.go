package postgresqlroomrepo

import (
	"context"
	"errors"

	"example.com/infrahandson/internal/domain/entity"
	"example.com/infrahandson/internal/domain/repository"
	"github.com/jmoiron/sqlx"
)

type RoomRepositoryImpl struct {
	db *sqlx.DB
}

type NewRoomRepositoryImplParams struct {
	DB *sqlx.DB
}

func (p *NewRoomRepositoryImplParams) Validate() error {
	if p.DB == nil {
		return errors.New("db cannot be nil")
	}
	return nil
}

func NewRoomRepositoryImpl(p *NewRoomRepositoryImplParams) repository.RoomRepository {
	if err := p.Validate(); err != nil {
		panic(err)
	}

	return &RoomRepositoryImpl{
		db: p.DB,
	}
}

func (r *RoomRepositoryImpl) SaveRoom(ctx context.Context, room *entity.Room) (entity.RoomID, error) {
	return entity.RoomID(""), nil
}

func (r *RoomRepositoryImpl) GetRoomByID(ctx context.Context, id entity.RoomID) (*entity.Room, error) {
	return nil, nil
}

func (r *RoomRepositoryImpl) GetAllRooms(ctx context.Context) ([]*entity.Room, error) {
	return nil, nil
}

func (r *RoomRepositoryImpl) GetUsersInRoom(ctx context.Context, roomID entity.RoomID) ([]*entity.User, error) {
	return nil, nil
}

func (r *RoomRepositoryImpl) AddMemberToRoom(ctx context.Context, roomID entity.RoomID, userID entity.UserID) error {
	return nil
}

func (r *RoomRepositoryImpl) RemoveMemberFromRoom(ctx context.Context, roomID entity.RoomID, userID entity.UserID) error {
	return nil
}

func (r *RoomRepositoryImpl) GetRoomByNameLike(ctx context.Context, name string) ([]*entity.Room, error) {
	return nil, nil
}

func (r *RoomRepositoryImpl) UpdateRoomName(ctx context.Context, roomID entity.RoomID, name string) error {
	return nil
}

func (r *RoomRepositoryImpl) DeleteRoom(ctx context.Context, roomID entity.RoomID) error {
	return nil
}