export interface UserObject {
  id: string | number;
  email: string;
  fullname?: {
    firstname: string;
    lastname?: string;
  };
  username: string;
}
