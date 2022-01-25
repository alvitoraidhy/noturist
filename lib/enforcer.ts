const RBAC: { [role: string]: string[] } = {
  user: [
    "create:note:self",
    "read:note:self",
    "update:note:self",
    "delete:note:self",

    "read:user:self",
  ],
};

export const enforce = (role: string, action: string) => {
  return RBAC[role] && RBAC[role].includes(action);
};
