package signalingcase

type NewSignalingUseCaseParams struct {
	// TODO: 必要な依存関係を追記
}

func (*NewSignalingUseCaseParams) Validate() error {
	// TODO: 依存関係の検証
	return nil
}

func NewSignalingUseCase(p *NewSignalingUseCaseParams) (SignalingUseCaseInterface) {
	if err := p.Validate(); err != nil {
		panic(err)
	}

	return &SignalingUseCase{}
}
