import { resolve } from "path";
import { defineConfig } from "vite";

const isGitHubActions = process.env.GITHUB_ACTIONS === "true";

export default defineConfig({
  base: isGitHubActions ? "/wdd330-SleepOutside-Tm14/" : "/",
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        cart: resolve(__dirname, "src/cart/index.html"),
        checkout: resolve(__dirname, "src/checkout/index.html"),
        product: resolve(__dirname, "src/product_pages/index.html"),
        productListing: resolve(__dirname, "src/product_listing/index.html"),
      },
    },
  },
});
