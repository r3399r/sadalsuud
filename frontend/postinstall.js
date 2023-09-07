const fs = require('fs');

fs.readFile('node_modules/react-scripts/config/webpack.config.js', 'utf8', (err, data) => {
  if (err) {
    return console.log(err);
  }
  const result = data
    .replaceAll("'postcss-flexbugs-fixes',", "'postcss-flexbugs-fixes','postcss-nesting',")
    .replaceAll("'tailwindcss',", "'tailwindcss/nesting', 'tailwindcss',");

  fs.writeFile('node_modules/react-scripts/config/webpack.config.js', result, 'utf8', (err) => {
    if (err) {
      return console.log(err);
    }
    return console.log(true);
  });
  return console.log(true);
});
