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
  static get rounds () { return 'rounds' };
  static get round () { return 'round' };
  static get courses () { return 'courses' };
  static get course () { return 'course' };
  static get updated() {return 'updated'};
  static get versions() {return 'versions'};
  static get hole() { return 'hole' };
  static get updatedUser () { return 'updatedUser'};
}


