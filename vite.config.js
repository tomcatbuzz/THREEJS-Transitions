// import defineConfig from 'vite'
import glsl from 'vite-plugin-glsl'
// import requireTransform from 'vite-plugin-require-transform'
// import vitePluginRequire from 'vite-plugin-require'

export default {
    plugins:
    [
        glsl(),
    //     requireTransform({}),
    //     vitePluginRequire({
		// 	// @fileRegex RegExp
		// 	// optional：default file processing rules are as follows
		// 	// fileRegex:/(.jsx?|.tsx?|.vue)$/

    //         // Conversion mode. The default mode is import
    //         // importMetaUrl | import,
    //         // importMetaUrl see https://vitejs.cn/guide/assets.html#new-url-url-import-meta-url 
    //         translateType: "importMetaUrl" | "import"
		// })
    ]
}
