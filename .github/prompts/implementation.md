# Review NeoTeacher implementation

You are reviewing the current implementation of NeoTeacher, a self-hosted language learning web app inspired by classic 1990s multimedia language trainers.

Your task is to verify whether the project is a real working application, not only a static UI prototype.

## Main goal

Check if the current codebase actually implements the core NeoTeacher functionality:

- user profiles,
- exercise sets,
- learning mode,
- test mode,
- answer checking,
- progress tracking,
- repeated mistakes,
- SQLite persistence,
- frontend/backend integration.

If something is missing or only mocked, fix it directly in the code.

Do not only describe problems. Make concrete code changes.

---

## Architecture expectations

The project should use:

- React,
- TypeScript,
- Vite,
- Tailwind CSS,
- Node.js backend,
- Express or Fastify,
- Prisma ORM,
- SQLite,
- local media uploads,
- monorepo structure.

Expected structure:

```text
/neoteacher
  /frontend
  /backend
  /docs
  /sample-data
  /.github
    /prompts
    main.md
  docker-compose.yml
  README.md