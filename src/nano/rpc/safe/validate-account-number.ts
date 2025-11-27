import { ValidateAccountNumberRequest } from "../requests/validate-account-number";
import { ValidateAccountNumberResponse } from "../responses/validate-account-number";
import { safePostFunction } from "./post";

export const validate_account_number = safePostFunction(
  ValidateAccountNumberRequest(),
  ValidateAccountNumberResponse()
);
