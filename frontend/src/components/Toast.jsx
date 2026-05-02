const Toast = ({ message, type = 'success' }) => {
  if (!message) return null;
  const color = type === 'success' ? 'bg-emerald-600' : 'bg-red-600';
  return (
    <div className={`fixed bottom-6 right-6 z-50 rounded-3xl px-5 py-4 text-white shadow-xl ${color}`}>
      {message}
    </div>
  );
};

export default Toast;
