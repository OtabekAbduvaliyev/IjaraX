'use client';

export default function DeleteModal({ isOpen, onClose, onConfirm, propertyName, isLoading = false }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm bg-black/40 z-50 flex items-center justify-center animate-fadeIn"
      onClick={!isLoading ? onClose : undefined}
    >
      <div 
        className="bg-white/90 backdrop-blur-md rounded-lg p-8 max-w-md w-full mx-4 animate-slideUp shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-2xl font-light text-black mb-6">
          Mulkni o'chirish
        </h3>
        <p className="text-gray-700 mb-8 leading-relaxed">
          Siz rostdan ham "<span className="font-medium text-black">{propertyName}</span>" mulkini ro'yxat o'chirmoqchimisiz?
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className={`px-6 py-2.5 text-sm text-gray-600 transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:text-black'
            }`}
          >
            Bekor qilish
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-6 py-2.5 text-sm bg-black text-white rounded-md transition-all flex items-center gap-2 ${
              isLoading ? 'opacity-90 cursor-not-allowed' : 'hover:bg-gray-800'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                O'chirilmoqda...
              </>
            ) : (
              "O'chirish"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
