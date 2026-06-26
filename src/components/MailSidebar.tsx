import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiInbox, HiPaperAirplane, HiDocumentText, HiTrash, HiExclamation, HiTag, HiPencilAlt } from 'react-icons/hi';

const folders = [
	{ name: 'Inbox', path: '/inbox', icon: <HiInbox className="w-5 h-5 mr-2" /> },
	{ name: 'Sent', path: '/sent', icon: <HiPaperAirplane className="w-5 h-5 mr-2" /> },
	{ name: 'Drafts', path: '/drafts', icon: <HiDocumentText className="w-5 h-5 mr-2" /> },
	{ name: 'Trash', path: '/trash', icon: <HiTrash className="w-5 h-5 mr-2" /> },
	{ name: 'Spam', path: '/spam', icon: <HiExclamation className="w-5 h-5 mr-2" /> },
	{ name: 'Labels', path: '/labels', icon: <HiTag className="w-5 h-5 mr-2" /> },
];

const shulkproAddresses = [
	'no-reply@shulkpro.in',
	'shravan@shulkpro.in',
	'info@shulkpro.in',
	'support@shulkpro.in',
];

export default function MailSidebar({ selectedAddress, onAddressChange, onCompose }: { selectedAddress: string; onAddressChange: (address: string) => void; onCompose?: () => void }) {
	const pathname = usePathname();
	return (
		<aside className="w-72 min-h-screen bg-white border-r flex flex-col py-6 px-4 shadow-sm relative">
			<button
				type="button"
				onClick={onCompose}
				className="flex items-center gap-2 mb-8 px-6 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg fixed z-20 left-8 top-20"
				style={{ width: '200px' }}
			>
				<HiPencilAlt className="w-5 h-5" /> Compose
			</button>
			<div className="flex items-center gap-2 mb-8 mt-24">
				<h2 className="text-xl font-bold text-blue-700">Mail</h2>
				<select
					className="ml-2 px-2 py-1 rounded border bg-gray-50"
					value={selectedAddress}
					onChange={e => onAddressChange(e.target.value)}
				>
					{shulkproAddresses.map(addr => (
						<option key={addr} value={addr}>{addr}</option>
					))}
				</select>
			</div>
			<nav className="flex flex-col gap-1 mt-2">
				{folders.map(folder => (
					<Link
						key={folder.path}
						href={folder.path}
						className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors gap-2 text-base ${
							pathname.startsWith(folder.path)
								? 'bg-blue-100 text-blue-900 font-bold shadow'
								: 'text-gray-700 hover:bg-gray-100'
						}`}
					>
						{folder.icon}
						{folder.name}
					</Link>
				))}
			</nav>
		</aside>
	);
}
