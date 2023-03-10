import { Params } from "react-router-dom";

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
  query: string | undefined;
};

export interface IgetContactParams {
  params: Params<string>;
};

export interface IeditParams {
  params: Params<string>;
  request: Request;
};

export interface IdeleteParams {
  params: Params<string>;
};

export interface IcontactLoader {
  contact: Icontact;
};

export interface IsearchRequest {
  request: Request;
}