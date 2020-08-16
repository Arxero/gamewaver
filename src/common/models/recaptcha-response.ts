export class RecaptchResponse {
  constructor(input: any) {
    this.success = input.success;
    this.challengeTs = input.challenge_ts;
    this.hostname = input.hostname;
    this.errorCodes = input['error-codes'];
  }

  success: boolean;
  challengeTs: Date;
  hostname: string;
  errorCodes: any[];
}
