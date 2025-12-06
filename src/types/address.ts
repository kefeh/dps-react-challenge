export interface AddressData {
  locality: string;
  plz: string;
  availablePlzs: string[];
}

export enum LastEdited {
  Locality = 'locality',
  Plz = 'plz',
}

export interface AddressState {
  data: AddressData;
  lastEdited: LastEdited | null;
  loading: boolean;
  error: string | null;
}
