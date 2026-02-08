# Job Application Tracker

<div align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Nhost-Backend-1A56DB?style=for-the-badge" alt="Nhost" />
</div>

<br />

<div align="center">
  <h3>🚀 A modern, beautiful job application tracking system</h3>
  <p>Keep track of all your job applications in one place. Never lose an opportunity again.</p>
</div>

---

## ✨ Features

- **📝 Track Applications** - Keep all your job applications organized with detailed status tracking
- **📊 Analytics Dashboard** - Get insights into your job search progress with comprehensive statistics
- **🔍 Smart Search** - Quickly find applications with powerful search and filtering capabilities
- **🏷️ Custom Tags** - Organize applications with custom tags for easy categorization
- **📅 Recontact Dates** - Set follow-up reminders to never miss an opportunity
- **📤 Export/Import** - Export your data to CSV or import existing applications
- **🌙 Dark Mode** - Beautiful dark mode support for comfortable viewing
- **📱 Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices
- **🔐 Secure Authentication** - Your data is protected with enterprise-grade security

## 🖼️ Screenshots

| Landing Page | Dashboard | Application Form |
|:---:|:---:|:---:|
| Modern landing with animations | Track all applications | Easy-to-use form |

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom animations
- **Backend**: Nhost (PostgreSQL + Hasura GraphQL)
- **Authentication**: Nhost Auth
- **State Management**: React Hooks
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A [Nhost](https://nhost.io) account (free tier available)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/job-application-tracker.git
cd job-application-tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Nhost Backend

#### Create a Nhost Project

1. Go to [Nhost Dashboard](https://app.nhost.io)
2. Click "Create Project"
3. Choose a name and region for your project
4. Wait for the project to be provisioned

#### Set up the Database

1. In your Nhost dashboard, go to **Database** → **SQL Editor**
2. Copy and paste the contents of `code.sql` file
3. Run the SQL to create the tables and triggers

#### Configure Hasura Permissions

After running the SQL, you need to set up permissions in Hasura:

1. Go to **Hasura** in your Nhost dashboard (or click "Open Hasura Console")
2. Navigate to **Data** → **applications** table → **Permissions** tab

**For the `user` role:**

| Permission | Configuration |
|------------|---------------|
| **Insert** | Row: `{"user_id":{"_eq":"X-Hasura-User-Id"}}` <br> Columns: All except `id`, `user_id`, `created_at`, `updated_at` <br> Column Preset: `user_id` = `X-Hasura-User-Id` |
| **Select** | Row: `{"user_id":{"_eq":"X-Hasura-User-Id"}}` <br> Columns: All |
| **Update** | Row: `{"user_id":{"_eq":"X-Hasura-User-Id"}}` <br> Columns: All except `id`, `user_id`, `created_at` |
| **Delete** | Row: `{"user_id":{"_eq":"X-Hasura-User-Id"}}` |

3. Do the same for the **analytics** table:

| Permission | Configuration |
|------------|---------------|
| **Select** | Row: `{"user_id":{"_eq":"X-Hasura-User-Id"}}` <br> Columns: All |

#### Get Your Nhost Credentials

1. In your Nhost dashboard, go to **Settings** → **Environment Variables**
2. Find and copy:
   - **Subdomain** (e.g., `abcdefghijklmnop`)
   - **Region** (e.g., `us-east-1`)

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_NHOST_SUBDOMAIN=your-subdomain-here
VITE_NHOST_REGION=your-region-here
```

### 5. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🌐 Deploying to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and sign in
3. Click "New Project" and import your repository
4. Add Environment Variables:
   - `VITE_NHOST_SUBDOMAIN` = your Nhost subdomain
   - `VITE_NHOST_REGION` = your Nhost region
5. Click "Deploy"

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts and add environment variables when asked
```

### Important Notes for Deployment

- Make sure to add your Vercel deployment URL to Nhost's allowed redirect URLs
- In Nhost Dashboard → Settings → Auth → Allowed Redirect URLs, add:
  - `https://your-app.vercel.app`

## 📁 Project Structure

```
├── src/
│   ├── components/         # React components
│   │   ├── AnalyticsWidget.tsx
│   │   ├── ApplicationCard.tsx
│   │   ├── ApplicationForm.tsx
│   │   ├── Auth.tsx
│   │   ├── Dashboard.tsx
│   │   ├── LandingPage.tsx
│   │   └── Layout.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useAnalytics.ts
│   │   ├── useApplications.ts
│   │   ├── useAuth.ts
│   │   └── useTheme.ts
│   ├── lib/                # Library configurations
│   │   └── nhost.ts
│   ├── utils/              # Utility functions
│   │   └── csvUtils.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── code.sql                # Database schema for Nhost
├── .env.example            # Environment variables template
└── README.md
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 📊 Application Status Types

| Status | Description |
|--------|-------------|
| 🔵 **Applied** | Initial application submitted |
| 🟡 **Waiting** | Awaiting response |
| 🟢 **Interview** | Interview scheduled/completed |
| 🔴 **Rejected** | Application rejected |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Developer

Made with ❤️ by [Spandan](https://spandanb.com.np)

---

<div align="center">
  <p>If you found this project helpful, please consider giving it a ⭐</p>
</div>
