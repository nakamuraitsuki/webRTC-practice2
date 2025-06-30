package signalingcase

import (
	"context"

	"example.com/infrahandson/internal/domain/entity"
)

type SignalingUseCaseInterface interface {
	// StartSession は指定されたルームIDとユーザーIDで新しいセッションを開始します。
	// 既存のセッションがある場合は、それを再利用します。
	// 失敗した場合はエラーを返します。
	StartSession(ctx context.Context, req StartSessionInput) error

	// LeaveSession は指定されたルームIDとユーザーIDのセッションを終了します。
	LeaveSession(ctx context.Context, req LeaveSessionInput) error

	// SendOffer, SendAnswer, SendCandidate はそれぞれSDPメッセージとICE候補を送信します。
	SendOffer(ctx context.Context, msg entity.SDPMessage) error
	SendAnswer(ctx context.Context, msg entity.SDPMessage) error
	SendCandidate(ctx context.Context, msg entity.ICECandidate) error
}
