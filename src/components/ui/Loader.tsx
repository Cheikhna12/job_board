export default function Loader({ text = 'Chargement...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
      <p className="mt-4 text-slate-600">{text}</p>
    </div>
  );
}
