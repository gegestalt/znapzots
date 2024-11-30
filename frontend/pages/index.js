import Link from 'next/link';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to the Architecture Firm Website</h1>
      <p>Click below to go to the Login page.</p>
      <Link href="/login" className="text-blue-500 hover:underline">
        Go to Login
      </Link>
    </div>
  );
};

export default HomePage;
