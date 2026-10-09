import { TEMPLATE_VARIABLE_NAMES } from '../constants/templateVariables';

const VARIABLE_PATTERN = /\{\{(\w+)\}\}/g;
const VARIABLE_SPAN_PATTERN = /<span data-variable="[^"]*">(.*?)<\/span>/gs;

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function wrapSubjectForEditor(subject: string): string {
  return `<p>${wrapVariablesForEditor(escapeHtml(subject))}</p>`;
}

export function wrapVariablesForEditor(html: string): string {
  return html.replace(VARIABLE_PATTERN, (match, name: string) => {
    if (!TEMPLATE_VARIABLE_NAMES.includes(name)) return match;
    return `<span data-variable="${name}">{{${name}}}</span>`;
  });
}

export function unwrapVariablesForApi(html: string): string {
  return html.replace(VARIABLE_SPAN_PATTERN, '$1');
}

export function findUnknownVariables(text: string): string[] {
  const unknown = new Set<string>();
  for (const match of text.matchAll(VARIABLE_PATTERN)) {
    const name = match[1];
    if (!TEMPLATE_VARIABLE_NAMES.includes(name)) unknown.add(name);
  }
  return [...unknown];
}
