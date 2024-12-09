import React from 'react';
import { JSONToHTML } from 'html-to-json-parser';
import xss from 'xss';
import './styling.css';

// Function to escape HTML entities
const escapeHtml = (html) => {
  return html.replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
};

// Function to wrap <code> contents with triple backticks
const escapeCodeBlocks = (html) => {
  return html.replace(/<code>([\s\S]*?)<\/code>/g, (match, p1) => {
    return `<code>\`\`\`\n${escapeHtml(p1)}\n\`\`\`</code>`;
  });
};

const View = async ({ initialValue }) => {
  // Convert JSON to HTML
  const result = await JSONToHTML(initialValue, true);

  // Escape code blocks by wrapping content with triple backticks
  const escapedHtml = escapeCodeBlocks(result);

  // Sanitize HTML with xss
  const sanitizedHtml = xss(escapedHtml);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      className='ProseMirror'
    />
  );
};

export default View;
