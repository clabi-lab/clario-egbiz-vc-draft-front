export interface IndexedDBItem {
  chatGroupId: number;
  title: string;
  createdDate: string;
}

export interface SatisfactionDBItem {
  chatGroupId: number;
  satisfactionId: number;
  memo: string;
  createdDate: string;
}

export interface ShareDBItem {
  chatGroupId: number;
  title: string;
  createdDate: string;
  encodedData: string;
}
