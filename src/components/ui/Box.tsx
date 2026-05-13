import React from "react";

interface BoxProps extends React.ComponentPropsWithoutRef<"div"> {
	customProp?: string;
}

const Box = ({ customProp, style, ...props }: BoxProps) => {
	return (
		<div {...props} style={{ display: "Block", width: "100%", ...style }} />
	);
};

export default Box;
