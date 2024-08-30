"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ResultPage() {
	const { slug } = useParams();
	const [code, setCode] = useState<{
		html: string;
		css: string;
		js: string;
	} | null>(null);

	useEffect(() => {
		const savedCode = localStorage.getItem(slug!);
		if (savedCode) {
			setCode(JSON.parse(savedCode));
		}
	}, [slug]);

	if (!code) return <div>Loading...</div>;

	return (
		<div className="result">
			<style>{code.css}</style>
			<div dangerouslySetInnerHTML={{ __html: code.html }} />
			<script dangerouslySetInnerHTML={{ __html: code.js }} />
		</div>
	);
}
