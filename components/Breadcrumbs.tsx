import Link from 'next/link';

interface BreadcrumbItem {
    name: string;
    url: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav className="mb-8 text-sm" aria-label="Breadcrumb">
            <ol className="flex items-center flex-wrap space-x-2 text-gray-600">
                {items.map((item, index) => (
                    <li key={index} className="flex items-center">
                        {index > 0 && <span className="mx-2">/</span>}
                        {index === items.length - 1 ? (
                            <span className="text-gray-900 font-medium">{item.name}</span>
                        ) : (
                            <Link href={item.url} className="hover:text-primary transition-colors">
                                {item.name}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
