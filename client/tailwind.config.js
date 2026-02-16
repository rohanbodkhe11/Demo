/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#0f172a", // Deep Blue
                secondary: "#d4af37", // Warm Gold
            }
        },
    },
    plugins: [],
}
