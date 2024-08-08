import React, {ChangeEvent, FormEvent, useState} from 'react';
import {Button, buttonVariant} from "@/components/ui/button";

const Modal = ({ isOpen, onClose, onSubmit, submitMessage, buttonVariant = "default", children }: {isOpen: boolean, onClose: () => void, onSubmit: (data: object) => void,submitMessage: string, buttonVariant?: buttonVariant, children: React.ReactNode}) => {
    const [inputData, setInputData] = useState({});

    const handleChange = (e: ChangeEvent<HTMLFormElement>) => {
        const { name, value } = e.target;
        setInputData({ ...inputData, [name]: value });
    };

    const handleClose = () => {
        setInputData({});
        onClose();
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(inputData);
        setInputData({});
    };

    if (!isOpen) {
        return null
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                <button
                    className="absolute top-0 right-0 mt-4 mr-4 text-gray-500 hover:text-gray-700"
                    onClick={handleClose}
                >
                    &times;
                </button>
                <form onSubmit={handleSubmit} onChange={handleChange}>
                    {children}
                    <div className="mt-4 flex gap-1 justify-end">
                        <Button
                            type="button"
                            onClick={handleClose}
                            variant={"secondary"}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant={buttonVariant}>
                            {submitMessage}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;
