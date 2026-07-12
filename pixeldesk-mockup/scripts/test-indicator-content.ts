import { config } from "dotenv";
config({ path: ".env.local" });

import { generateIndicatorContent } from "../lib/indicator-content";

async function main() {
  try {
    const result = await generateIndicatorContent("RSI (Relative Strength Index)");
    console.log("สำเร็จ:");
    console.log(JSON.stringify(result, null, 2));
  } catch (e: any) {
    console.log("ล้มเหลว: " + e.message);
  }
}

main();