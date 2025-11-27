import { ValidateAccountNumberRequest } from "../requests/validate-account-number";
import { ValidateAccountNumberResponse } from "../responses/validate-account-number";
import { postFunction } from "./post";

export const validate_account_number = postFunction(ValidateAccountNumberRequest(), ValidateAccountNumberResponse());
