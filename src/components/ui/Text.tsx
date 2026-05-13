// WHY: Text is a body/inline text atom analogous to Title for headings.
// No font-size or color defaults — those are set by the section component.
// Keeping Text and Title as explicit primitives makes it clear at every
// call site that we're rendering either a heading or body text, which helps
// reviewers catch accessibility mistakes (e.g. heading used for body copy).
import React from "react";

type TextTag = "p" | "span" | "small" | "strong" | "em" | "label" | "li";

type TextProps<T extends TextTag = "p"> = {
	/** The HTML element to render. Defaults to p. */
	as?: T;
} & React.ComponentPropsWithoutRef<T>;

function Text<T extends TextTag = "p">({ as, ...props }: TextProps<T>) {
	const Tag = (as ?? "p") as React.ElementType;
	return <Tag {...props} />;
}

export default Text;
