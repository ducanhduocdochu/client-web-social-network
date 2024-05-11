// Toast.js
import React from 'react';
import { useDispatch } from 'react-redux';
import { removeToast } from 'state';

import { CloseIcon, ErrorIcon, InfoIcon, LoadingIcon, SuccessIcon, WarningIcon } from './iconToast';
import { useTheme } from '@mui/material';

export default function Toast({ toast }) {
    const theme = useTheme();
    const dispatch = useDispatch();

    const toastType = [
        { type: 'success', component: <SuccessIcon className="animate-bounce" key="success" /> },
        { type: 'info', component: <InfoIcon className="animate-bounce" key="info" /> },
        { type: 'warning', component: <WarningIcon className="animate-bounce" key="warning" /> },
        { type: 'error', component: <ErrorIcon className="animate-bounce" key="error" /> },
        {
            type: 'loading',
            component: <LoadingIcon className="animate-spin" key="loading" />,
        },
    ];

    const toastStyle = { text: '', bg: '' };
    switch (toast.type) {
        case 'success':
            toastStyle.text = 'text-[#47d864]';
            toastStyle.bg = 'bg-[#47d864]';
            break;
        case 'info':
            toastStyle.text = 'text-[#2f86eb]';
            toastStyle.bg = 'bg-[#2f86eb]';
            break;
        case 'warning':
            toastStyle.text = 'text-[#ffc021]';
            toastStyle.bg = 'bg-[#ffc021]';
            break;
        case 'error':
            toastStyle.text = 'text-[#ff623d]';
            toastStyle.bg = 'bg-[#ff623d]';
            break;
        case 'loading':
            toastStyle.text = 'text-[#999]';
            toastStyle.bg = 'bg-[#999]';
            break;
        default:
            // code block
    }

    const iconComponent = toastType.find(item => item.type === toast.type)?.component;

    return (
        <div className="flex items-center shadow-lg rounded-lg my-2 px-2 py-4 animate-fromRight relative bg-white">
            <div className="mx-[12px]">
                {iconComponent}
            </div>
            <div className="w-[300px]">
                <h5 className={`${toastStyle.text}`}>{toast.title}</h5>
                <p className={theme.palette.mode === "light" ? `py-1 text-[#000000]` : `py-1 text-[#ffffff]`}>{toast.message}</p>
            </div>
            <button onClick={() => dispatch(removeToast(toast.id))}>
                <CloseIcon />
            </button>
            <div className={`absolute top-0 left-0 animate-growWidth h-[3px] ${toastStyle.bg}`}></div>
        </div>
    );
}
