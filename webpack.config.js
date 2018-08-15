module.exports = (env = {}) => {
	return {
		entry: ['./src/scss/colors.scss'],
		output: {
			// filename: 'assets/js/bundle.js',
		},
		module: {
			rules: [
				{
					test: /\.scss$/,
					use: [
						{
							loader: 'file-loader',
							options: {
								name: '[name].css',
								outputPath: '/'
							}
						},
						{
							loader: 'extract-loader'
						},
						{
							loader: 'css-loader'
						},
						{
							loader: 'sass-loader'
						}
					]
				}
			]
		}
	}
};