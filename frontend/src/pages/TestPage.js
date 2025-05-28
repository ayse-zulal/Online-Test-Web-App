import { useParams } from 'react-router-dom';

export default function TestPage() {
  const { id } = useParams();

  return (
    <div>
      <h2>Test Sayfası</h2>
    </div>
  );
}
