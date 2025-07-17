type dataType = {
  id: number | null;
  uid: string | null;
  title: string;
  content: string;
  access: number;
};

type updateDataType = {
  id: number | null;
  title: string;
  content: string;
  flag: boolean;
};

type collabType = {
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  username: string;
};

type incomingData = {
  auth: number;
  collaborator: collabType;
  id: number;
};

export {
  type dataType,
  type updateDataType,
  type collabType,
  type incomingData,
};
