import Link from "next/link";

export default function Sidebar() {
    return (
        <aside className="bg-primary text-white w-64 p-4 min-h-screen">
            <h2 className="text-lg font-bold">Navigation</h2>
            <ul className="mt-4 space-y-2">
                <li>
                    <Link href="/" className="block p-2 rounded hover:bg-secondary">
                        Home
                    </Link>
                </li>
                <li>
                    <Link href="/admin" className="block p-2 rounded hover:bg-secondary">
                        Manage Listings
                    </Link>
                </li>
                <li>
                    <Link href="/add-listing" className="block p-2 rounded hover:bg-secondary">
                        Add Listing
                    </Link>
                </li>
            </ul>
        </aside>
    );
}
