import Link from 'next/link';

const Home: React.FC = () => {
  return (
    <div>
      <h1>Welcome to My Notification App</h1>
      <p>
      <Link href="/notifications">Go to Notifications</Link>
      </p>
    </div>
  );
};

export default Home;
