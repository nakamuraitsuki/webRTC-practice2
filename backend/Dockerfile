# ビルド用イメージ
FROM golang:1.24-bullseye AS builder
WORKDIR /app

# 必要なパッケージを追加
RUN apt-get update && apt-get install -y git gcc sqlite3 libsqlite3-dev && rm -rf /var/lib/apt/lists/*


COPY backend/go.mod backend/go.sum ./
RUN go mod download

COPY backend/ .

RUN go build -o server cmd/main.go

# 実行用イメージ
FROM golang:1.24-bullseye
WORKDIR /app
COPY backend/ .

# SQLiteを使うため
# SQLite3 ランタイムをインストール
RUN apt-get update && apt-get install -y sqlite3 libsqlite3-0 && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/server .

# SQLiteのDBファイルを保存するディレクトリ
RUN mkdir -p /app/config

# ポートを開放
EXPOSE 8080

# サーバーを起動
CMD ["./server"]

