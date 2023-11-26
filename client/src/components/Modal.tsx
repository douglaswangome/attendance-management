import React from "react";

interface ModalProps {
	show: boolean;
	children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ children, show }) => {
	return (
		<div
			className={`fixed top-0 left-0 grid place-items-center backdrop-brightness-[.3] w-full h-full ${
				show ? "mt-0" : "mt-[-100%]"
			} transition-all duration-300`}
		>
			<div className="bg-white dark:bg-dark h-fit w-fit p-2 rounded-lg">
				{children}
			</div>
		</div>
	);
};

export default Modal;
