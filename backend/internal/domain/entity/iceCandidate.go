package entity

import "errors"

// ICECandidate は WebRTC の通信に必要な ICE 候補情報を表します。
// 多対多を想定しているため、ルーム情報を含みます。
type ICECandidate struct {
	candidate     string
	sdpMid        string
	sdpMLineIndex uint16
	from          UserID
	to            UserID
	roomID        RoomID
}

type ICECandidateInput struct {
	Candidate     string
	SdpMid        string
	SdpMLineIndex uint16
	From          UserID
	To            UserID
	RoomID        RoomID
}

func (i *ICECandidateInput) Validate() error {
	if i.Candidate == "" {
		return errors.New("iceCandidateInput: Candidate is required")
	}
	if i.SdpMid == "" {
		return errors.New("iceCandidateInput: SdpMid is required")
	}
	if i.From == "" {
		return errors.New("iceCandidateInput: From is required")
	}
	if i.To == "" {
		return errors.New("iceCandidateInput: To is required")
	}
	if i.RoomID == "" {
		return errors.New("iceCandidateInput: RoomID is required")
	}
	return nil
}

func NewICECandidate(input ICECandidateInput) (*ICECandidate, error) {
	if err := input.Validate(); err != nil {
		return nil, err
	}

	return &ICECandidate{
		candidate:     input.Candidate,
		sdpMid:        input.SdpMid,
		sdpMLineIndex: input.SdpMLineIndex,
		from:          input.From,
		to:            input.To,
		roomID:        input.RoomID,
	}, nil
}

func (i *ICECandidate) GetCandidate() string {
	return i.candidate
}

func (i *ICECandidate) GetSdpMid() string {
	return i.sdpMid
}

func (i *ICECandidate) GetSdpMLineIndex() uint16 {
	return i.sdpMLineIndex
}

func (i *ICECandidate) GetFrom() UserID {
	return i.from
}

func (i *ICECandidate) GetTo() UserID {
	return i.to
}

func (i *ICECandidate) GetRoomID() RoomID {
	return i.roomID
}