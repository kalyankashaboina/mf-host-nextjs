// app/utils/mfeConfig.ts
export const MFE_REGISTRY = {
  users: {
    url: process.env.NEXT_PUBLIC_USERS_URL || 'http://localhost:5001/assets/remoteEntry.js',
    scope: 'users_app',
    module: './UsersWidget',
    title: 'User Management',
    icon: '👤',
  },
  sales: {
    url: process.env.NEXT_PUBLIC_SALES_URL || 'http://localhost:5002/assets/remoteEntry.js',
    scope: 'sales_app',
    module: './SalesChart',
    title: 'Revenue Analytics',
    icon: '📊',
  },
} as const;

export type MfeKey = keyof typeof MFE_REGISTRY;