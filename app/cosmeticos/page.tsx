import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cosméticos - 62 Beauty',
  description: 'Página em construção',
};

export default function CosmeticosPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-light text-gray-900 mb-6">
            Cosméticos
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Página em construção
          </p>
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    </div>
  );
}