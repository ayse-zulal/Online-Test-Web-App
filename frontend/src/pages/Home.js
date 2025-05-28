import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <h1>Ana Sayfa</h1>
      <ul>
        <li><Link to="/test/1">Test 1'e Git</Link></li>
        <li><Link to="/user">Kullanıcı Sayfası</Link></li>
      </ul>
    </div>
  );
}
