const webpack = require('webpack');
const path = require('path');
const globule = require('globule');

// ディレクトリの設定
const srcDir = path.join(__dirname, 'src');
const outDir = path.join(__dirname, 'dist');

// keyの拡張子のファイルが、valueの拡張子のファイルに変換される
const convertExtensions = {
  pug: 'html',
  sass: 'css'
};

// トランスパイルするファイルを列挙する
// _から始まるファイルは、他からimportされるためのファイルとして扱い、個別のファイルには出力しない
const files = {};
Object.keys(convertExtensions).forEach(from => {
  const to = convertExtensions[from];
  globule
    .find([`**/*.${from}`, `!**/_*.${from}`], { cwd: srcDir })
    .forEach(filename => {
      files[
        filename.replace(new RegExp(`.${from}$`, 'i'), `.${to}`)
      ] = path.join(srcDir, filename);
    });
});

// Sassをトランスパイルし、autoprefixerをかけるようにする
const sassLoader = [
  {
    loader: 'css-loader',
    options: {
      minimize: true
    }
  },
  {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: () => [require('autoprefixer')()]
    }
  },
  'sass-loader'
];

const config = {
  context: srcDir,
  entry: files,
  output: {
    filename: '[name]',
    path: outDir
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: 'pug-plain-loader'
      },
      {
        test: /\.sass$/,
        use: sassLoader
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ],
  devServer: {
    contentBase: outDir,
    watchContentBase: true
  }
};

if (process.env.NODE_ENV === 'production') {
  config.plugins = config.plugins.concat([
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin()
  ]);
}

module.exports = config;
