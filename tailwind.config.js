/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#1e40af", // Example blue
                secondary: "#1e293b", // Slate
            }
        },
    },
    plugins: [],
}
