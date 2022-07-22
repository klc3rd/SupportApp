/**
 * This object is meant for throwing errors
 * allowing a status
 */
export default class Err {
  status: number;
  message: string;

  constructor(status: number, message: string) {
    this.status = status;
    this.message = message;
  }
}
