/** @type {import('tailwindcss').Config} */
module.exports = {
    corePlugins: {
        preflight: false,
    },
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        colors: {
            black: '#000000',
            blue: '#0000ff',
            green: "#06c755",
            grey: '#6c757d',
            palegrey: '#acb9c5',
            paleblue: '#cfe2f3',
            palegreen: '#d9ead3',
            palered: '#f4cccc',
            paleorange: '#fce5cd',
            paleyellow: '#fff2cc',
            orange: '#e05200',
            lightgrey: '#efefef',
            snow: '#fcfcfc',
            red: "#ff0000",
            cream: '#fffdcf',
            white: '#ffffff',
        }
    },
    plugins: [],
}