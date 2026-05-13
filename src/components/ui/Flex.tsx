// WHY: Flex is a flexbox layout atom.
// It adds no visual styling (no background, no border, no padding) —
// purely a convenience wrapper so section components don't duplicate
// `flex` plus direction/align/gap/wrap props on every container div.
// Like Box, it defaults to full width so sections can rely on consistent expansion.
import React from "react";

interface FlexProps extends React.ComponentPropsWithoutRef<"div"> {
	/** flex-direction. Default: row. */
	direction?: React.CSSProperties["flexDirection"];
	/** align-items. Default: stretch. */
	align?: React.CSSProperties["alignItems"];
	/** justify-content. Default: flex-start. */
	justify?: React.CSSProperties["justifyContent"];
	/** gap (Tailwind handles most cases, but inline gap is useful for dynamic values). */
	gap?: React.CSSProperties["gap"];
	/** flex-wrap. Default: nowrap. */
	wrap?: React.CSSProperties["flexWrap"];
}

function Flex({
	direction,
	align,
	justify,
	gap,
	wrap,
	style,
	className,
	...props
}: FlexProps) {
	return (
		<div
			className={["flex w-full", className].filter(Boolean).join(" ")}
			style={{
				flexDirection: direction,
				alignItems: align,
				justifyContent: justify,
				gap,
				flexWrap: wrap,
				...style,
			}}
			{...props}
		/>
	);
}

export default Flex;
