const axios = require("axios");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const versionTime = new Date().getTime();
const baseHost =
	process.env.NODE_ENV === "dev"
		? "http://127.0.0.1:3300"
		: "http://127.0.0.1:3300";

module.exports = {
	/*
	 ** Headers of the page
	 */
	env: {
		baseHost: baseHost,
	},
	head: {
		htmlAttrs: {
			lang: "en",
			amp: true,
		},
		titleTemplate: (titleChunk) => {
			// If undefined or blank then we don't need the hyphen
			return titleChunk ? `${titleChunk} | 木博` : "木博";
		},
		// title: process.env.npm_package_name || '', <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
		meta: [
			// { charset: 'utf-8' },
			{ "http-equiv": "content-type", content: "text/html; charset=UTF-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{
				hid: "description",
				name: "description",
				content:
					"分享工作中前端开发经验和常用的vue框架使用技巧，搭建运维个人博客成为学习后端、运维的重要提升途径，其中个人博客从无到有的故事也成为分享的内容之一",
			},
			{
				hid: "keywords",
				name: "keywords",
				content: "前端开发,web前端,vue框架,vue项目,node",
			},
		],
		link: [
			// { rel: "stylesheet", href: "https://public.taoxzhe.com/public/blog/style/iview.css" },
			{ rel: "icon", type: "image/x-icon", href: "/logo.ico" },
			{
				rel: "stylesheet",
				href: "https://unpkg.com/view-design@4.5.0/dist/styles/iview.css",
			},
			{ rel: "stylesheet", href: "/common.css" },
			{ rel: "stylesheet", href: "/mediaStyle.css" },
			{ rel: "stylesheet", href: "/base.css" },
			{ rel: "stylesheet", href: "/hljs-style.css" },
			{ rel: "stylesheet", href: "/markdown.css" },
			// rel: "preload", as: "style" prefetch,
			// { rel: "prefetch", href: "/hljs-style.css" },
			// { rel: "prefetch", href: "/markdown.css" },
		],
		script: [
			process.env.NODE_ENV === "prod"
				? {
					src: "/monit.js",
				}
				: {},
		],
	},
	/*
	 ** Customize the progress-bar color
	 */
	loading: { color: "#fff" },
	/*
	 ** Global CSS
	 */
	css: [
		// 'view-design/dist/styles/iview.css',
		// '~/assets/css/base.css',
		// '~/assets/css/common.css',
		/* '~/assets/css/hljs-style.css',
			'~/assets/css/markdown.css',
			'~/assets/css/mediaStyle.css', */
		// '~/assets/font/iconfont.css',
	],
	/*
	 ** Plugins to load before mounting the App
	 */
	plugins: [
		// '~/plugins/view-design'
		{
			src: "~/plugins/view-design",
			ssr: true,
		},
	],
	router: {
		// trailingSlash: false,
	},
	/*
	 ** Nuxt.js dev-modules
	 */
	buildModules: [],
	/*
	 ** Nuxt.js modules
	 */
	modules: [],
	/*
	 ** Build configuration
	 */
	build: {
		/*
		 ** You can extend webpack config here
		 */
		extend(config, ctx) {
			config.output.filename = `js/[name].${versionTime}.js`;
			config.output.chunkFilename = `js/[name].${versionTime}.js`;
		},
		extractCSS: process.env.NODE_ENV === "prod",
		plugins: [
			// Gzip
			new CompressionWebpackPlugin({
				algorithm: "gzip", // 使用gzip压缩
				test: /\.js$|\.html$|\.css$/, // 匹配文件名
				filename: "[path].gz[query]", // 压缩后的文件名(保持原文件名，后缀加.gz)
				minRatio: 1, // 压缩率小于1才会压缩
				threshold: 10240, // 对超过10k的数据压缩
				deleteOriginalAssets: false, // 是否删除未压缩的源文件
			}),
		],
	},
	server: {
		port: 2000, // default: 3000
		host: "0.0.0.0", // default: localhost,
		// host: '192.168.1.104' // default: localhost,
	},
	// 静态页面
	generate: {
		interval: 100,
		routes() {
			// return axios.get('http://120.78.218.176:3000/api/article_list', {
			return axios
				.get(`${baseHost}/api/article_list`, {
					params: {
						title: "",
						pageNo: 1,
						limit: 9999,
						status: 1,
					},
				})
				.then((res) => {
					let result = res.data.data.list.map((article) => {
						return {
							route: "/articleDetail/" + article._id,
							payload: article,
						};
					});
					return result;
				});
		},
	},
	telemetry: false,
};
