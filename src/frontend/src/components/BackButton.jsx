import { useNavigate } from "react-router-dom";

export default function BackButton({ to }) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (to) {
            navigate(to);
        }
    };

    const preventSpaceClick = (e) => {
        if (e.key === " " || e.key === "Spacebar") e.preventDefault();
    };

    return (
        <button
            onClick={handleClick}
            onKeyDown={preventSpaceClick}
            className="px-6 py-1 rounded-sm bg-[#7e7bf1] text-white focus:outline-none"
        >
            Back
        </button>
    );
}
