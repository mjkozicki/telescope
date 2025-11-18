import { json } from "@sveltejs/kit";
import { existsSync, mkdirSync, writeFileSync, readFileSync } from "fs";
import { join } from "path";
import AdmZip from "adm-zip";
const POST = async ({ request }) => {
  console.log("upload endpoint");
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file) {
      return json({ error: "No file uploaded" }, { status: 400 });
    }
    const filename = file.name;
    const testId = filename.replace(/\.zip$/i, "");
    if (!testId) {
      return json({ error: "Invalid filename" }, { status: 400 });
    }
    const resultsDir = join(process.cwd(), "static", "results");
    const testDir = join(resultsDir, testId);
    if (existsSync(testDir)) {
      return json(
        {
          error: "Directory already exists",
          testId
        },
        { status: 409 }
      );
    }
    mkdirSync(testDir, { recursive: true });
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const zip = new AdmZip(buffer);
    zip.extractAllTo(testDir, true);
    let manifest = null;
    const manifestPath = join(testDir, "manifest.json");
    if (!existsSync(manifestPath)) {
      const entries = zip.getEntries();
      manifest = {
        testId,
        uploadedAt: (/* @__PURE__ */ new Date()).toISOString(),
        files: entries.map((entry) => ({
          name: entry.entryName,
          size: entry.header.size
        }))
      };
      writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");
    } else {
      manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
    }
    return json({
      success: true,
      testId,
      manifest,
      url: `/results/${testId}/overview`
    });
  } catch (error) {
    console.error("Upload error:", error);
    return json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
};
export {
  POST
};
