import { useUser } from "../../context/UserContext";

export function Header() {
	const { nombre } = useUser();
	const inicial = nombre ? nombre.trim().charAt(0).toUpperCase() : "U";
	return (
		<header className="w-full flex items-center justify-between px-4 py-2 bg-white border-b">
			<img src="/logo.png" alt="JamDoc Logo" className="h-8 w-auto object-contain"/>
			<div className="flex items-center gap-3">
				<div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
					{inicial}
				</div>
			</div>
		</header>
	);
}
