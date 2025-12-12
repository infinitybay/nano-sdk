export type SuccessfulPostResult<TDataType> = {
  success: true;
  data: TDataType;
  status?: number;
  statusText?: string;
};

export type UnsuccessfulPostResult = {
  success: false;
  error: {
    message: string;
  };
  status?: number;
  statusText?: string;
};

export type PostResult<TDataType> = SuccessfulPostResult<TDataType> | UnsuccessfulPostResult;
