export function buildUpdatePrompt({ existingFiles, changeRequest }) {
  return `
You are editing an existing full-stack website. Here are the CURRENT project files as JSON:

${JSON.stringify(existingFiles, null, 2)}

USER CHANGE REQUEST: ${changeRequest}

Apply ONLY the requested changes. Keep every other file's content identical unless the change requires touching it.

Respond with ONLY a single valid JSON object, no markdown fences, no commentary, matching this exact shape:

{
  "message": "Short confirmation of what was changed",
  "frontend": { ... every frontend file, updated or unchanged ... },
  "backend": { ... every backend file, updated or unchanged ... }
}

Return the COMPLETE file map — every file that existed before must still be present, even if unchanged.
`;
}