import { useEffect, useRef, useState } from "react";

export const useDimensions = () => {
	const ref = useRef(null);
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

	useEffect(() => {
		if (ref.current) {
			const { offsetWidth, offsetHeight } = ref.current;
			setDimensions({ width: offsetWidth, height: offsetHeight });
		}
	}, [ref]); // Re-run if the ref object itself changes (unlikely)

	return { ref, dimensions };
};