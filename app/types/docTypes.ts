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
