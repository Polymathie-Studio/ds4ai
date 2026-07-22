// Client-safe provider metadata. No SDK imports, so this is safe in the browser.
// The key never has to be recognized by a server for any of this to work.

export type ProviderId = 'anthropic' | 'openai' | 'google' | 'xai' | 'mistral'

export type Provider = {
  id: ProviderId
  label: string
  short: string
  placeholder: string
  keyUrl: string
  prefix: string | null
  defaultModel: string
}

// Order matters for auto-detect: distinctive prefixes are checked before the
// generic "sk-" so an Anthropic key is not read as OpenAI.
export const PROVIDERS: Provider[] = [
  { id: 'anthropic', label: 'Anthropic · Claude', short: 'Claude', placeholder: 'sk-ant-...', keyUrl: 'https://console.anthropic.com/settings/keys', prefix: 'sk-ant-', defaultModel: 'claude-sonnet-5' },
  { id: 'google', label: 'Google · Gemini', short: 'Gemini', placeholder: 'AIza...', keyUrl: 'https://aistudio.google.com/apikey', prefix: 'AIza', defaultModel: 'gemini-2.0-flash' },
  { id: 'xai', label: 'xAI · Grok', short: 'Grok', placeholder: 'xai-...', keyUrl: 'https://console.x.ai', prefix: 'xai-', defaultModel: 'grok-2-latest' },
  { id: 'openai', label: 'OpenAI · GPT', short: 'GPT', placeholder: 'sk-...', keyUrl: 'https://platform.openai.com/api-keys', prefix: 'sk-', defaultModel: 'gpt-4o' },
  { id: 'mistral', label: 'Mistral', short: 'Mistral', placeholder: 'your Mistral key', keyUrl: 'https://console.mistral.ai/api-keys', prefix: null, defaultModel: 'mistral-large-latest' },
]

export function detectProvider(key: string): ProviderId | null {
  const k = key.trim()
  for (const p of PROVIDERS) {
    if (p.prefix && k.startsWith(p.prefix)) return p.id
  }
  return null
}

export function getProvider(id: ProviderId): Provider | undefined {
  return PROVIDERS.find((p) => p.id === id)
}
