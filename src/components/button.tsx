const Button = ({ onClick, children, disabled = false }: { onClick: () => void; children: React.ReactNode; disabled?: boolean }) => (
    <button
      onClick={onClick}
      className={`w-full py-2 px-4 rounded-md bg-blue-600 text-white ${disabled ? 'bg-gray-400' : 'hover:bg-blue-700'} transition`}
      disabled={disabled}
    >
      {children}
    </button>
  );
  
  export default Button;
  