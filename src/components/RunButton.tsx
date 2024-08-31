interface RunButtonProps {
	onClick: () => void;
}

export default function RunButton({ onClick }: RunButtonProps) {
	return (
		<button
			type="button"
			className="mt-4 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
			onClick={onClick}
		>
			Run
		</button>
	);
}
