import { UserDataInterface } from './user-data-interface';
export enum DirectionEnum {
  Next,
  Previous
}

export class StorageKeys {
  /** 
   * access_token
   * appName
   * expires_in
   * firstName
   * fullName
   * lastName
   * regId
   * role
   * token_type
   * userId
   * username
   **/
  static get userData() { return "userData" };
  static get login() { return 'login '};
}


