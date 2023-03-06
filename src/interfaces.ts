export interface Icontact {
  id: string;
  createdAt: number;
  first?: string;
  last?: string;
  avatar?: string;
  twitter?: string;
  notes?: string;
  favorite: boolean;
};

export interface IrootLoader {
  contacts: Icontact[];
};