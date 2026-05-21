/**
 * Stubbed Gemini service for toy safety compliance.
 * Re-enable by reinstalling @google/genai and restoring the original implementation.
 */

export async function suggestTranslation(_text: string, targetLanguage: string): Promise<string> {
  return `[Stubbed] Translation to ${targetLanguage}: ${_text}`;
}

export async function proofreadTranslation(_text: string, _context: string): Promise<string> {
  return `[Stubbed] Proofread result: ${_text}`;
}
