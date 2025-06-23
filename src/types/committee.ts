
export interface CommitteeMember {
  sequence: number;
  position: string;
  name: string;
  ssc_batch: string;
  hsc_batch: string;
  profession: string;
  organization: string;
  whatsapp: string;
  email: string;
  photo: string;
}

export interface CommitteeData {
  title: string;
  subtitle: string;
  term: string;
  members: CommitteeMember[];
}
