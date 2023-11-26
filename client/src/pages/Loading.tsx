import React from "react";

const Loader: React.FC = () => {
	return (
		<div className="flex items-center justify-center flex-shrink-0 h-screen transition-colors ease-linear dark:bg-dark dark:text-white">
			<div className="relative">
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center ">
					<span>Loading</span>
					<div className="animate-pulse">.</div>
					<div className="animate-pulse">.</div>
					<div className="animate-pulse">.</div>
				</div>
				<div className=" animate-spin rounded-full h-36 w-36 border-t-2 border-b-2 border-primary"></div>
			</div>
		</div>
	);
};

export default Loader;
