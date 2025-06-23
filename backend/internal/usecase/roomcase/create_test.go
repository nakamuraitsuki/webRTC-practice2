package roomcase_test

import (
	"context"
	"errors"
	"testing"

	"example.com/infrahandson/internal/domain/entity"
	"example.com/infrahandson/internal/usecase/roomcase"
	"github.com/stretchr/testify/assert"
	"go.uber.org/mock/gomock"
)

// TestCreateRoom: CreateRoomのテスト
// 1. 正常系: 部屋が正常に作成されることを確認
// 2. NewRoomID失敗: RoomIDの生成に失敗した場合、エラーが返されることを確認
// 3. SaveRoom失敗: 部屋の保存に失敗した場合、エラーが返されることを確認
// 4. GetRoomByID失敗: 部屋の取得に失敗した場合、エラーが返されることを確認

func TestCreateRoom(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	roomUseCase, mockDeps := roomcase.NewTestRoomUseCase(ctrl)

	t.Run("1. 正常系", func(t *testing.T) {
		req := roomcase.CreateRoomRequest{
			Name: "Test Room",
		}
		roomID := entity.RoomID("public_room_1")

		mockDeps.RoomIDFactory.EXPECT().NewRoomID().Return(roomID, nil)
		mockDeps.RoomRepo.EXPECT().SaveRoom(context.Background(), gomock.Any()).Return(roomID, nil)
		mockDeps.RoomRepo.EXPECT().GetRoomByID(context.Background(), roomID).Return(entity.NewRoom(entity.RoomParams{
			ID:      roomID,
			Name:    req.Name,
			Members: []entity.UserID{},
		}), nil)

		resp, err := roomUseCase.CreateRoom(context.Background(), req)

		assert.NoError(t, err)
		assert.NotNil(t, resp.Room)
	})

	t.Run("2. RoomID生成失敗時", func(t *testing.T) {
		req := roomcase.CreateRoomRequest{
			Name: "Test Room",
		}
		expectedErr := errors.New("failed to generate room ID")
		roomID := entity.RoomID("public_room_1")

		mockDeps.RoomIDFactory.EXPECT().NewRoomID().Return(roomID, expectedErr)

		resp, err := roomUseCase.CreateRoom(context.Background(), req)

		assert.Error(t, err)
		assert.Nil(t, resp.Room)
		assert.Equal(t, expectedErr, err)
	})

	t.Run("3. SaveRoom失敗", func(t *testing.T) {
		req := roomcase.CreateRoomRequest{
			Name: "Test Room",
		}
		publicID := entity.RoomID("public_room_1")
		expectedErr := errors.New("failed to save room")
		mockDeps.RoomIDFactory.EXPECT().NewRoomID().Return(publicID, nil)
		mockDeps.RoomRepo.EXPECT().SaveRoom(context.Background(), gomock.Any()).Return(publicID, expectedErr)
		resp, err := roomUseCase.CreateRoom(context.Background(), req)
		assert.Error(t, err)
		assert.Nil(t, resp.Room)
		assert.Equal(t, expectedErr, err)
	})

	t.Run("4. GetRoomByID失敗", func(t *testing.T) {
		req := roomcase.CreateRoomRequest{
			Name: "Test Room",
		}
		publicID := entity.RoomID("public_room_1")
		expectedErr := errors.New("failed to get room by ID")

		mockDeps.RoomIDFactory.EXPECT().NewRoomID().Return(publicID, nil)
		mockDeps.RoomRepo.EXPECT().SaveRoom(context.Background(), gomock.Any()).Return(publicID, nil)
		mockDeps.RoomRepo.EXPECT().GetRoomByID(context.Background(), publicID).Return(nil, expectedErr)

		resp, err := roomUseCase.CreateRoom(context.Background(), req)

		assert.Error(t, err)
		assert.Nil(t, resp.Room)
		assert.Equal(t, expectedErr, err)
	})
}
