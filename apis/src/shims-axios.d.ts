import { AxiosRequestConfig as ARC } from "axios";

declare module "axios" {
  export interface AxiosRequestConfig extends ARC {
    showLoading?: boolean;
    cancelToken?: any;
  }
}

// declare module "axios" {
//   export interface AxiosRequestConfig {
//     showLoading?: boolean;
//   }
// }
