import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-6">Welcome to Eldermate</h1>
      <Link href="/signin" legacyBehavior>
        <a className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Go to Sign In Page
        </a>
      </Link>
    </div>
  );
}
