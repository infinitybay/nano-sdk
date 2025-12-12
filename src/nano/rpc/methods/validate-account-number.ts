import { postFunction } from "../http/post";
import { ValidateAccountNumberRequest } from "../requests/validate-account-number";
import { ValidateAccountNumberResponse } from "../responses/validate-account-number";

export const validate_account_number = postFunction(ValidateAccountNumberRequest(), ValidateAccountNumberResponse());
