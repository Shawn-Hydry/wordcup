/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@dcloudio/uni-app' {
  const uni: any
  export default uni
  export * from '@dcloudio/uni-app'
}