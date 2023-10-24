import { type Config } from "tailwindcss";

export default {
  content: ["./html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: { chat: ["GillSans"], league: ["League+Gothic"] },
      colors: {
        "base-white": "#fffefe",
        "base-lightest-blue": "#c2d6ff",
        "base-light-blue": "#6699ff",
        "base-medium-blue": "#3366cc",
        "base-dark-blue": "#1e407c",
        "base-gray": "#535353",
        "base-light-gray": "#c7c7c7",
        "base-white-transparent": "#fcfcfcbe",
        "base-black-transparent": "#303030be",
        "base-black-semi-transparent": "#303030ce",
        "base-black-translucent": "#303030fd",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
} satisfies Config;
