import { execa } from "execa";

export async function pushToGitHub(message: string): Promise<boolean> {
  try {
    console.log("📦 [DEZ GITHUB] Staging local project changes...");
    await execa("git", ["add", "."]);
    
    console.log(`✍️ [DEZ GITHUB] Creating automated commit: "${message}"`);
    await execa("git", ["commit", "-m", message]);
    
    console.log("🚀 [DEZ GITHUB] Pushing codebase upstream to origin main...");
    await execa("git", ["push", "origin", "main"]);
    
    console.log("🏁 [DEZ GITHUB] Push operation completed successfully!");
    return true;
  } catch (err: any) {
    console.error("❌ [DEZ GITHUB] Pipeline push failed:", err.message || err);
    return false;
  }
}