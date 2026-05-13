import React from "react";

interface TitleProps extends React.ComponentPropsWithoutRef<"div"> {
	customProp?: string;
}

const Title = ({ customProp, style, ...props }: TitleProps) => {
	return <div {...props} style={{ ...style }} />;
};

export default Title;
