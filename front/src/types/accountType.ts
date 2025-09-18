import type { collabType } from "~/types/docTypes.tsx";

export type userType = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
};

export type DBUserType = {
  id: number;
  username: string;
  email: string;
};

export type FileListType = {
  id: number;
  uid: string;
  name: string;
  short_name: string | null;
  owner: DBUserType;
  doc: number;
  public_access: boolean;
  created_at: string;
  updated_at: string;
  last_modified_by: string;
  collaborators: collabType[];
};
