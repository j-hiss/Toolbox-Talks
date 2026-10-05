import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTs,
  {
    ignores: [".next/**", "out/**", "preview/dist/**", "ios/**", "android/**", "prototype/**", "next-env.d.ts"],
  },
];

export default config;
