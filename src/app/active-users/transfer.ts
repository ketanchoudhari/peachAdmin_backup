export interface ITransfer {
    password: any;
    // txntype:number;
    users: {
      userId: any;
      txnType: number;
      amount: any;
      remark: any;
      creditRef?: number;
      key?: number;
    }[];
  }
  