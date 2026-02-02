import React from "react";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "./SectionHeading";
import { Instagram } from "lucide-react";

interface InstagramPost {
    id: string;
    image: string;
    link?: string;
}

const defaultPosts: InstagramPost[] = [
    { id: "1", image: "/images/instagram-1.jpg" },
    { id: "2", image: "/images/instagram-2.jpg" },
    { id: "3", image: "/images/instagram-3.jpg" },
    { id: "4", image: "/images/instagram-4.jpg" },
    { id: "5", image: "/images/instagram-5.jpg" },
    { id: "6", image: "/images/instagram-6.jpg" },
];

interface InstagramGalleryProps {
    posts?: InstagramPost[];
    instagramHandle?: string;
}

const InstagramGallery: React.FC<InstagramGalleryProps> = ({
    posts = defaultPosts,
    instagramHandle = "epoxysista",
}) => {
    return (
        <section className="section bg-gray-50">
            <div className="container-custom">
                <div className="text-center mb-10">
                    <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-2 block">
                        Follow Along
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        @{instagramHandle}
                    </h2>
                    <p className="text-gray-600">
                        Join our community and see latest creations on Instagram
                    </p>
                </div>

                {/* Instagram Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {posts.map((post) => (
                        <Link
                            key={post.id}
                            href={post.link || `https://instagram.com/${instagramHandle}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative aspect-square overflow-hidden rounded-xl"
                        >
                            <Image
                                src={post.image}
                                alt="Instagram post"
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <Instagram size={32} className="text-white" />
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Follow Button */}
                <div className="text-center mt-8">
                    <Link
                        href={`https://instagram.com/${instagramHandle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline inline-flex items-center gap-2"
                    >
                        <Instagram size={18} />
                        Follow on Instagram
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default InstagramGallery;
