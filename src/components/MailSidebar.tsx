import Link from 'next/link';
import { usePathname } from 'next/navigation';

const folders = [
	{ name: 'Inbox', path: '/inbox' },
	{ name: 'Sent', path: '/sent' },
	{ name: 'Drafts', path: '/drafts' },
	{ name: 'Trash', path: '/trash' },
	{ name: 'Spam', path: '/spam' },
	{ name: 'Labels', path: '/labels' },
];

export default function MailSidebar() {
	const pathname = usePathname();
	return (
		<aside className="w-64 min-h-screen bg-gray-50 border-r flex flex-col py-8 px-4">
			<Link
				href="/compose"
				className="mb-8 px-4 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition-colors text-center"
			>
				+ Compose
			</Link>
			<h2 className="text-xl font-bold mb-8 text-blue-700">Mail</h2>
			<nav className="flex flex-col gap-2">
				{folders.map(folder => (
					<Link
						key={folder.path}
						href={folder.path}
						className={`px-4 py-2 rounded hover:bg-blue-100 transition-colors font-medium ${
							pathname.startsWith(folder.path)
								? 'bg-blue-200 text-blue-900'
								: 'text-gray-700'
						}`}
					>
						{folder.name}
					</Link>
				))}
			</nav>
		</aside>
	);
}
