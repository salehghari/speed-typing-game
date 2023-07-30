interface WinningModalProps {
  typingSpeed: number;
  timeLeft: number;
  message: string;
  onClose: () => void;
}

const WinningModal: React.FC<WinningModalProps> = ({ typingSpeed, timeLeft, message, onClose }) => {

  return (
    <div onClick={onClose} className="modal flex justify-center items-center fixed top-0 left-0 w-full h-full">
      <div className="modal-content bg-white rounded-lg p-5 text-center max-w-md">
        <h2 className="mb-6 text-2xl">{message}</h2>
        <p className="mb-2">Typing Speed: {typingSpeed.toFixed(2)} WPM</p>
        <p className="mb-2">Time Left: {timeLeft} seconds</p>
        <button className="close-btn border-0 transition-colors text-white py-2 px-4 rounded cursor-pointer" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default WinningModal;