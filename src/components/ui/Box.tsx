// WHY: Box is a zero-opinion semantic wrapper atom.
// It always takes 100% width so section composers can rely on predictable
// block-level expansion without setting width themselves.
// The `as` prop lets the caller emit the correct HTML element for semantics
// (section, article, header, footer, nav, div) while reusing the same atom.
import React from "react";

type BoxTag =
	| "div"
	| "section"
	| "article"
	| "header"
	| "footer"
	| "nav"
	| "main"
	| "aside";

type BoxProps<T extends BoxTag = "div"> = {
	/** The HTML element to render. Defaults to `div`. */
	as?: T;
} & React.ComponentPropsWithoutRef<T>;

// WHY generic + cast: TypeScript can't dynamically narrow
// ComponentPropsWithoutRef<T> when T is a union, so we cast through `any`
// only at the JSX level. The public API is still fully typed.
function Box<T extends BoxTag = "div">({
	as,
	className,
	...props
}: BoxProps<T>) {
	const Tag = (as ?? "div") as React.ElementType;
	return (
		<Tag
			className={["w-full block", className].filter(Boolean).join(" ")}
			{...props}
		/>
	);
}

export default Box;
