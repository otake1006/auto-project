const fullCommit = import.meta.env.RENDER_GIT_COMMIT ?? 'dev';
export const VERSION = fullCommit.slice(0, 7);
