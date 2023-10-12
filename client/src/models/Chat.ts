export interface Chat {
    id: number;
    members: Member[];
    created_at: Date;
    updated_at: Date;
  }


  export interface Member {
    firstId: number;
    secondId: number;
  }
