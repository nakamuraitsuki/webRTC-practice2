package signalingcase

import (
	"example.com/infrahandson/internal/domain/repository"
	"example.com/infrahandson/internal/domain/service"
	"example.com/infrahandson/internal/interface/factory"
)

type SignalingUseCase struct {
	// TODO: 必要な依存関係を追記
	wsClientRepo     repository.WebsocketClientRepository
	websocketManager service.WebsocketManager
	clientIDFactory  factory.WsClientIDFactory
}
