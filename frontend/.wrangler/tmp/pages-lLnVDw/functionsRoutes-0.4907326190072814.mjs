import { onRequestOptions as __api_media_presign_js_onRequestOptions } from "C:\\Users\\Joseph Brian S. Balu\\Desktop\\TPA-Website\\frontend\\functions\\api\\media\\presign.js"
import { onRequestPost as __api_media_presign_js_onRequestPost } from "C:\\Users\\Joseph Brian S. Balu\\Desktop\\TPA-Website\\frontend\\functions\\api\\media\\presign.js"

export const routes = [
    {
      routePath: "/api/media/presign",
      mountPath: "/api/media",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_media_presign_js_onRequestOptions],
    },
  {
      routePath: "/api/media/presign",
      mountPath: "/api/media",
      method: "POST",
      middlewares: [],
      modules: [__api_media_presign_js_onRequestPost],
    },
  ]