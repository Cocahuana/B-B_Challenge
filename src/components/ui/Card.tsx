import React from "react";
import * as UI from "./index";
type Props = {};
const { Box, Title } = UI;
const Card = (props: Props) => {
	return (
		<div className='my-custom-styles'>
			<Box>
				<Title>Card title</Title>
				<p>Card description</p>
			</Box>
		</div>
	);
};

export default Card;
