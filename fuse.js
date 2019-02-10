const {
  FuseBox,
  RawPlugin,
  StyledComponentsPlugin,
  WebIndexPlugin,
} = require('fuse-box')

const fuse = FuseBox.init({
  homeDir: 'src',
  output: 'dist/$name.js',
  target: 'browser@es6',
  sourceMaps: true,
  useTypescriptCompiler: true,
  debug: true,
  alias: {
    src: '~',
  },
  plugins: [
    RawPlugin(['*.js.txt']),
    StyledComponentsPlugin(),
    WebIndexPlugin({
      template: 'src/index.html',
    }),
  ],
})

fuse.dev()

fuse
  .bundle('app')
  .watch()
  .hmr()
  .instructions('> index.ts +util')

fuse.run()
