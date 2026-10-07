export interface Session {
  user: {
    id: string;
    name: string | null;
    email: string;
    emailVerified: boolean;
    image: string | null;
    role: string; // e.g., 'admin' or 'user'
    banned: boolean;
    banReason: string | null;
    banExpires: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress: string | null;
    userAgent: string | null;
    impersonatedBy: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
}
