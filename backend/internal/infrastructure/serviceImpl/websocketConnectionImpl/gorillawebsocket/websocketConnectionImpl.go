package gorillawebsocket

import (
	"errors"

	"example.com/infrahandson/internal/domain/entity"
	"example.com/infrahandson/internal/domain/service"
	"example.com/infrahandson/internal/interface/adapter"
	"github.com/mitchellh/mapstructure"
)

type GorillaWebSocketConnection struct {
	conn adapter.ConnAdapter
}

type NewGorillaWebSocketConnectionParams struct {
	Conn adapter.ConnAdapter
}

func (p *NewGorillaWebSocketConnectionParams) Validate() error {
	if p.Conn == nil {
		return errors.New("conn is required")
	}
	return nil
}

func NewGorillaWebSocketConnection(
	p *NewGorillaWebSocketConnectionParams,
) service.WebSocketConnection {
	if err := p.Validate(); err != nil {
		panic(err)
	}
	return &GorillaWebSocketConnection{
		conn: p.Conn,
	}
}

// 汎用メッセージDTO
// payloadにそれぞれのDTOを入れる
type MessageDTO struct {
	MsgType service.MsgType `json:"message_type"` // メッセージのタイプ
	Payload any             `json:"payload"`  // メッセージの内容
}

func (c *GorillaWebSocketConnection) ReadMessage() (service.MsgType, any, error) {
	var msgDTO MessageDTO
	err := c.conn.ReadJSON(&msgDTO)
	if err != nil {
		return "", nil, err
	}

	// payload の型不定を解消しにかかる
	// とりあえず map[string]any として扱う
	rawMap, ok := msgDTO.Payload.(map[string]any)
	if !ok {
		return "", nil, errors.New("invalid payload type")
	}

	if msgDTO.MsgType == service.MsgTypeText {
		var textMsgDTO TextMessageDTO
		// map[string]any から TextMessageDTO に変換
		// mapstructure を使う
		if err := mapstructure.Decode(rawMap, &textMsgDTO); err != nil {
			return "", nil, err
		}

		// TextMessageDTO から entity.Message に変換
		message := textMsgDTO.ToEntity()
		if message == nil {
			return "", nil, errors.New("failed to convert TextMessageDTO to entity.Message")
		}

		return msgDTO.MsgType, message, nil
	}
	if msgDTO.MsgType == service.MsgTypeSDP {
		var sdpMsgDTO SDPMessageDTO
		// map[string]any から SDPMessageDTO に変換
		if err := mapstructure.Decode(rawMap, &sdpMsgDTO); err != nil {
			return "", nil, err
		}
		
		// SDPMessageDTO から entity.SDPMessage に変換
		sdpMessage := sdpMsgDTO.ToEntity()
		if sdpMessage == nil {
			return "", nil, errors.New("failed to convert SDPMessageDTO to entity.SDPMessage")
		}

		return msgDTO.MsgType, sdpMessage, nil
	}

	return msgDTO.MsgType, msgDTO.Payload, errors.New("unsupported message type")
}

func (c *GorillaWebSocketConnection) WriteMessage(msgType service.MsgType, msg any) error {
	// メッセージのタイプによって使い分け
	if msgType == service.MsgTypeText {
		if message, ok := msg.(*entity.Message); ok {
			msgDTO := TextMessageDTO{}
			msgDTO.FromEntity(message)
			
			return c.conn.WriteJSON(&MessageDTO{
				MsgType: msgType,
				Payload: msgDTO,
			})
		}

		return errors.New("invalid message type for text message")
	}
	if msgType == service.MsgTypeSDP {
		if sdpMessage, ok := msg.(*entity.SDPMessage); ok {
			msgDTO := SDPMessageDTO{}
			msgDTO.FromEntity(sdpMessage)

			return c.conn.WriteJSON(&MessageDTO{
				MsgType: msgType,
				Payload: msgDTO,
			})
		}

		return errors.New("invalid message type for SDP message")
	}

	return errors.New("unsupported message type")
}

func (c *GorillaWebSocketConnection) Close() error {
	err := c.conn.CloseFunc()
	if err != nil {
		return err
	}
	return nil
}
