export interface GenericResponse<T> {
  errorCode: number;
  errorDescription: string|undefined;
  result: T;
}
  

