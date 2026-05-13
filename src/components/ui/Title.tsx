// WHY: Title is a heading atom with a configurable tag.
// It deliberately carries no font-size or margin by default — those are set
// by the consuming section component, which understands the visual hierarchy.
// This separation means we never fight inherited margins in layouts.
import React from "react";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type TitleProps<T extends HeadingTag = "h2"> = {
	/** The heading level to render. Defaults to h2. */
	as?: T;
} & React.ComponentPropsWithoutRef<T>;

function Title<T extends HeadingTag = "h2">({ as, ...props }: TitleProps<T>) {
	const Tag = (as ?? "h2") as React.ElementType;
	return <Tag {...props} />;
}

export default Title;
