const LoadingButton = ({ loading, children }) => {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`w-full flex items-center justify-center gap-2 
      text-white p-2 rounded-md bg-gradient-to-r from-green-500 to-blue-500
      transition disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {loading && (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      )}
      {children}
    </button>
  );
};

export default LoadingButton;
