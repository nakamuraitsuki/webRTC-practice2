import { useState, useEffect } from 'react';
import { RoomRepo } from '../repository/roomRepositoryImpl';
import { Room } from '../models/room';

export const useRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]); // ルームのデータを格納
  const [loading, setLoading] = useState<boolean>(true); // ローディング状態
  const [error, setError] = useState<string | null>(null); // エラーメッセージ

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError(null); // エラーメッセージをリセット

        const rooms = await RoomRepo.getAllRooms();

        setRooms(rooms); // 取得したデータを設定
      } catch (err: any) {
        setError(err.message || "ルームの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []); // コンポーネントのマウント時に1度だけ実行

  return { rooms, loading, error };
};
