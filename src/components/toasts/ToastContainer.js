// Import library
import React from 'react';
import { useSelector } from 'react-redux';
// Import components/assets/sections/....
import Toast from './Toast';

export default function ToastContainer() {
    const toasts = useSelector((state) => state.toasts);
    return (
        <div className="fixed right-[16px] bottom-[16px] flex flex-col-reverse overflow-hidden z-[999]">
            {toasts?.map((toast) => (
                <Toast key={toast.id} toast={toast} />
            ))}
        </div>
    );
}
