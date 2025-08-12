export type Category = {
  id: string;
  name: string;
  description?: string | null;
};
export type User = {
  id: string;
  name: string;
  email: string;
  userType?: string;
  lawyerId?: string;
  preferredCategories?: Category[];
  // Add other user properties as needed
};
