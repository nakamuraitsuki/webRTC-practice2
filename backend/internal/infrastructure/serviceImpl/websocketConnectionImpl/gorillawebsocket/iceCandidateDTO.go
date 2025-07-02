package gorillawebsocket

import "example.com/infrahandson/internal/domain/entity"

type IceCandidateDTO struct {
	Candidate     string        `json:"candidate"`       // ICE候補の文字列
	SdpMid        string        `json:"sdp_mid"`         // SDPのメディア識別子
	SdpMLineIndex uint16        `json:"sdp_mline_index"` // SDPのメディア行インデックス
	From          entity.UserID `json:"from"`            // 送信者のユーザーID
	To            entity.UserID `json:"to"`              // 受信者のユーザーID
	RoomID        entity.RoomID `json:"room_id"`         // ルームID
}

func (dto *IceCandidateDTO) ToEntity() (*entity.ICECandidate, error) {
	input := entity.ICECandidateInput{
		Candidate:     dto.Candidate,
		SdpMid:        dto.SdpMid,
		SdpMLineIndex: dto.SdpMLineIndex,
		From:          dto.From,
		To:            dto.To,
		RoomID:        dto.RoomID,
	}
	
	return entity.NewICECandidate(input)
}

// TODO: FromはUseCaseで設定されるはず。確認フローは後で実装
func (dto *IceCandidateDTO) FromEntity(candidate *entity.ICECandidate) {
	dto.Candidate = candidate.GetCandidate()
	dto.SdpMid = candidate.GetSdpMid()
	dto.SdpMLineIndex = candidate.GetSdpMLineIndex()
	dto.From = candidate.GetFrom()
	dto.To = candidate.GetTo()
	dto.RoomID = candidate.GetRoomID()
}