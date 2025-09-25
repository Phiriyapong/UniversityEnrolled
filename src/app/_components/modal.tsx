"use client";
import React, { ReactNode } from 'react';

type ModalProps = {
  children: ReactNode;
  onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center text-black">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <button onClick={onClose} className="absolute top-0 right-0 m-4 text-black text-2xl">
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
