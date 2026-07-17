# EdLernity CRM

Staff CRM for EdLernity — manage users, interns, trainers, certificates, offers, and operations.

## Local development

```bash
cd crm
npm install
npm run dev
```

Runs on [http://localhost:3001](http://localhost:3001).

Set `crm/.env.local`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001
NEXT_PUBLIC_CRM_URL=http://localhost:3001
```

## Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
