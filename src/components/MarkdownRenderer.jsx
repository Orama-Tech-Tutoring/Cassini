import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MarkdownRenderer = ({ content }) => {
    return (
        <div style={{
            fontSize: '14px',
            lineHeight: '1.6',
            color: 'rgba(255, 255, 255, 0.9)'
        }}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <SyntaxHighlighter
                                style={atomDark}
                                language={match[1]}
                                PreTag="div"
                                customStyle={{
                                    margin: '12px 0',
                                    borderRadius: '8px',
                                    fontSize: '13px'
                                }}
                                {...props}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        ) : (
                            <code
                                style={{
                                    background: 'rgba(0, 0, 0, 0.3)',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    fontSize: '13px',
                                    fontFamily: 'monospace'
                                }}
                                {...props}
                            >
                                {children}
                            </code>
                        );
                    },
                    h1: ({ children }) => (
                        <h1 style={{ fontSize: '20px', fontWeight: 600, marginTop: '16px', marginBottom: '8px' }}>
                            {children}
                        </h1>
                    ),
                    h2: ({ children }) => (
                        <h2 style={{ fontSize: '18px', fontWeight: 600, marginTop: '14px', marginBottom: '6px' }}>
                            {children}
                        </h2>
                    ),
                    h3: ({ children }) => (
                        <h3 style={{ fontSize: '16px', fontWeight: 600, marginTop: '12px', marginBottom: '4px' }}>
                            {children}
                        </h3>
                    ),
                    p: ({ children }) => (
                        <p style={{ marginTop: '8px', marginBottom: '8px' }}>
                            {children}
                        </p>
                    ),
                    ul: ({ children }) => (
                        <ul style={{ marginLeft: '20px', marginTop: '8px', marginBottom: '8px' }}>
                            {children}
                        </ul>
                    ),
                    ol: ({ children }) => (
                        <ol style={{ marginLeft: '20px', marginTop: '8px', marginBottom: '8px' }}>
                            {children}
                        </ol>
                    ),
                    li: ({ children }) => (
                        <li style={{ marginTop: '4px', marginBottom: '4px' }}>
                            {children}
                        </li>
                    ),
                    blockquote: ({ children }) => (
                        <blockquote style={{
                            borderLeft: '3px solid rgba(255, 255, 255, 0.3)',
                            paddingLeft: '12px',
                            marginLeft: '0',
                            marginTop: '8px',
                            marginBottom: '8px',
                            color: 'rgba(255, 255, 255, 0.7)'
                        }}>
                            {children}
                        </blockquote>
                    ),
                    a: ({ children, href }) => (
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: 'var(--accent-blue)',
                                textDecoration: 'none',
                                borderBottom: '1px solid var(--accent-blue)'
                            }}
                        >
                            {children}
                        </a>
                    ),
                    strong: ({ children }) => (
                        <strong style={{ fontWeight: 600 }}>
                            {children}
                        </strong>
                    ),
                    em: ({ children }) => (
                        <em style={{ fontStyle: 'italic' }}>
                            {children}
                        </em>
                    )
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer;
