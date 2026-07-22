// HASP: Hold Any-provider Secrets Privately. Bring your own key.
//
// The zero-dependency core: provider metadata, auto-detect, and a browser-only
// key store. The React layer (the modal and the hook) is at 'hasp-key/react'.

export {
  PROVIDERS,
  detectProvider,
  getProvider,
  type Provider,
  type ProviderId,
} from './providers'

export {
  setKey,
  getKey,
  getActiveProvider,
  clearKey,
  hasKey,
  type StoreKind,
} from './key-store'
