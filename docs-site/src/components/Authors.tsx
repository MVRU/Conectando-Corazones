import React from "react";
import clsx from "clsx";
import type { Author } from "@site/src/data/authors";
import { AUTHORS } from "@site/src/data/authors";

type Props = {
    names?: string[] | string;
    people?: Author[];
    variant?: "card" | "inline";
    size?: number;
    align?: "left" | "center" | "right";
    className?: string;
    showTitle?: boolean;
};

function AuthorBadge({
    author,
    size = 40,
    showTitle = true,
    variant = "card",
}: {
    author: Author;
    size?: number;
    showTitle?: boolean;
    variant?: "card" | "inline";
}) {
    const avatar = author.image_url ?? "/img/authors/default.png";
    const Img = (
        <img
            src={avatar}
            alt={author.name}
            width={size}
            height={size}
            style={{ borderRadius: "50%", objectFit: "cover" }}
            loading="lazy"
        />
    );

    const Name = <strong>{author.name}</strong>;
    const Title = showTitle && author.title ? (
        <small style={{ opacity: 0.8 }}>{author.title}</small>
    ) : null;

    const content =
        variant === "inline" ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                {Img}
                <span style={{ display: "inline-flex", flexDirection: "column" }}>
                    {Name}
                    {Title}
                </span>
            </span>
        ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {Img}
                <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
                    {Name}
                    {Title}
                </div>
            </div>
        );

    return author.url ? (
        <a href={author.url} rel="noopener noreferrer" target="_blank" aria-label={`Autor ${author.name}`}>
            {content}
        </a>
    ) : (
        content
    );
}

export function Authors({
    names = [],
    people = [],
    variant = "card",
    size = 40,
    align = "left",
    className,
    showTitle = true,
}: Props) {
    const nameList = Array.isArray(names) ? names : [names];

    const resolvedFromMap: Author[] = nameList
        .map((k) => AUTHORS[k])
        .filter(Boolean);

    const all: Author[] = [...resolvedFromMap, ...people];

    if (!all.length) return null;

    const justify =
        align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start";

    return (
        <div
            className={clsx("cc-doc-authors", className)}
            style={{
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap",
                justifyContent: justify,
                alignItems: "center",
                margin: "1rem 0",
            }}
        >
            {all.map((a) => (
                <AuthorBadge
                    key={a.id ?? a.name}
                    author={a}
                    size={size}
                    showTitle={showTitle}
                    variant={variant}
                />
            ))}
        </div>
    );
}

export default Authors;