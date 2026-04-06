"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface CodeExampleProps {
  code: string;
}

export default function CodeExample({ code }: CodeExampleProps) {
  return (
    <div className="mb-8 rounded-lg overflow-hidden">
      <div className="bg-gray-800 px-4 py-2 text-xs text-gray-400 font-mono">
        example
      </div>
      <SyntaxHighlighter
        language="python"
        style={vscDarkPlus}
        customStyle={{ margin: 0, borderRadius: 0, fontSize: "0.95rem" }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
