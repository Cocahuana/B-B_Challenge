// WHY: Section components import via `import * as UI from "@/components/ui"`
// (namespace import, not destructured). This keeps atomic primitives visually
// distinct from local variables in consuming components and makes it obvious
// when a component is using a design-system primitive vs its own markup.
export { default as Box } from "./Box";
export { default as Flex } from "./Flex";
export { default as Text } from "./Text";
export { default as Title } from "./Title";
