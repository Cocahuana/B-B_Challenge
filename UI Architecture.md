# UI Architecture System

## Overview

This project follows a custom layered component architecture inspired by **Atomic Design** and the **Layout Isolation** principle - similar in philosophy to Chakra UI, but framework-agnostic and fully compatible with Tailwind CSS or any styling approach.

The core idea is a strict separation between **what a component is** and **how much space it occupies**. Atomic components have no opinion about their own dimensions - that responsibility always belongs to the parent container.

---

## Core Principle: Layout Isolation

> Atomic components are 100% width and height by default.  
> They never define their own size, margin, or position.  
> The parent container is always responsible for layout constraints.

This guarantees that every atomic component is inherently responsive - it fills whatever space its parent allows. Visual consistency is enforced at the container level, not the atom level.

---

## Layer Structure

### Layer 1 - Atoms (`/ui`)

Generic, flexible, stateless building blocks. Each atom maps to a single HTML element with sensible defaults and full prop passthrough via `React.ComponentPropsWithoutRef`.

**Rules:**

- Always `width: 100%` by default
- No hardcoded margins, padding, or sizes
- No business logic
- Accepts `className` and `style` overrides for flexibility
- Exported from a single `ui/index.ts` barrel file

**Examples:**

```tsx
// ui/Box.tsx - generic block container
const Box = ({ style, ...props }: BoxProps) => (
	<div {...props} style={{ display: "block", width: "100%", ...style }} />
);

// ui/Flex.tsx - flex container with direction/alignment props
const Flex = ({
	direction = "row",
	align,
	justify,
	className,
	...props
}: FlexProps) => (
	<div
		className={cn(
			"flex w-full",
			direction === "col" && "flex-col",
			className,
		)}
		{...props}
	/>
);

// ui/Title.tsx - semantic heading with style passthrough
const Title = ({ style, ...props }: TitleProps) => (
	<div {...props} style={{ ...style }} />
);
```

**Barrel export:**

```ts
// ui/index.ts
export { default as Box } from "./Box";
export { default as Flex } from "./Flex";
export { default as Title } from "./Title";
export { default as Text } from "./Text";
```

---

### Layer 2 - Components (`/components`)

Composed units built from atoms. Components define their own **fixed dimensions, spacing, and visual identity**. They are reusable across the entire project and always render consistently.

**Rules:**

- Import atoms via `* as UI from "../ui"`
- Define width, height, padding, and spacing here - never in atoms
- Can accept props for content variation, but not for layout variation
- No page-specific logic

**Example:**

```tsx
// components/Card.tsx
import * as UI from "../ui";
const { Box, Title } = UI;

const Card = () => (
	<div className='w-[320px] h-[200px] rounded-xl p-6 bg-white shadow'>
		<Box>
			<Title>Card Title</Title>
			<p>Card description</p>
		</Box>
	</div>
);
```

---

### Layer 3 - Sections (`/components/sections`)

Page-level blocks that compose multiple components into a meaningful UI region. Sections are connected to data (e.g. Sanity CMS) and represent the visual "chunks" that editors assemble into pages.

**Rules:**

- Orchestrate components - no direct atom usage unless necessary
- Receive typed props from Sanity schemas
- Each section is independently renderable (no inter-section dependencies)
- Registered in `SectionRenderer` for dynamic page assembly

**Example:**

```tsx
// components/sections/HeroSection.tsx
const HeroSection = ({ title, subtitle, image, cta }: HeroSectionProps) => (
	<section className='relative w-full min-h-screen flex items-center'>
		<SanityImage src={image} priority />
		<div className='max-w-4xl mx-auto px-8'>
			<Title>{title}</Title>
			<p>{subtitle}</p>
			<Button href={cta.href}>{cta.label}</Button>
		</div>
	</section>
);
```

---

### Layer 4 - Pages (`/app`)

Fully custom, non-reusable layout code. Each page is unique and has its own CSS/Tailwind composition. Pages do not share layout logic - they orchestrate sections and define the overall document structure.

**Rules:**

- Completely custom styling - no shared layout constraints
- Responsible for data fetching (GROQ queries, ISR config)
- Mount `SectionRenderer` for CMS-driven pages
- Define `generateMetadata()` for SEO

---

## Section Renderer Pattern

For CMS-driven pages, sections are assembled dynamically via a `SectionRenderer` component that maps Sanity `_type` values to React components:

```tsx
// components/SectionRenderer.tsx
const sectionMap = {
	heroSection: HeroSection,
	featureGrid: FeatureGrid,
	ctaBanner: CTABanner,
	faqSection: FAQSection,
};

export default function SectionRenderer({ sections }) {
	return sections.map((section) => {
		const Component = sectionMap[section._type];
		if (!Component) return null;
		return <Component key={section._key} {...section} />;
	});
}
```

This means editors can reorder, add, or remove sections from Sanity without any developer involvement.

---

## Import Convention

Atoms are always imported via the barrel file using namespace import:

```tsx
import * as UI from "../ui";
const { Box, Flex, Title } = UI;
```

This makes atom usage immediately identifiable in any file and keeps imports clean as the system grows.

---

## Layer Summary

| Layer     | Location               | Owns Layout?    | Owns Data?      | Reusable?      |
| --------- | ---------------------- | --------------- | --------------- | -------------- |
| Atom      | `/ui`                  | ❌ Never        | ❌ Never        | ✅ Always      |
| Component | `/components`          | ✅ Yes          | ❌ No           | ✅ Always      |
| Section   | `/components/sections` | ✅ Yes          | ✅ Via props    | ✅ Per context |
| Page      | `/app`                 | ✅ Fully custom | ✅ Direct fetch | ❌ Unique      |

---

## Design Philosophy

This system prioritizes:

- **Predictability** - atoms behave the same everywhere because they never own their size
- **Responsiveness by default** - 100% width atoms adapt to any container automatically
- **Separation of concerns** - styling decisions live at exactly one layer
- **CMS compatibility** - sections map directly to Sanity schema objects
- **Tooling flexibility** - works with Tailwind, CSS Modules, inline styles, or any combination
