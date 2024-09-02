"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ResultPage() {
	const { slug } = useParams();
	const [code, setCode] = useState("");

	useEffect(() => {
		const fetchData = async () => {
			const res = await fetch(`/api/project/${slug}`);
			const data = await res.json();
			setCode(data.code);
		};

		fetchData();
	}, [slug]);

	return <div dangerouslySetInnerHTML={{ __html: code }} />;
}
