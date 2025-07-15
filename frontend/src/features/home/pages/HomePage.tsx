import { Link } from 'react-router-dom';
import { useAuth } from '../../../app/hooks/useAuth';
import styles from './HomePage.module.css';

export const HomePage = () => {
  const { user } = useAuth();
  return (
    <div className={styles.container}>
      <h1 className={styles.hero}>Chat-INFRA</h1>
      <p>ようこそ、ユーザーさん！</p>
      {!user ? (
        <div>
          <Link to="/user/register">
            新規登録
          </Link>
          または
          <Link to="/user/login">
            ログイン
          </Link>
        </div>
      ) : (
        <Link to='/room'>チャットを開始する</Link>
      )}
    </div>
  );
};
