
export interface CommitteeMember {
  sequence: number;
  position: string;
  name: string;
  ssc_batch: string;
  hsc_batch: string;
  profession: string;
  organization: string | null;
  whatsapp: string | null;
  email: string | null;
  photo: string;
}

export interface CommitteeData {
  title: string;
  subtitle: string;
  term: string;
  executiveCommittee: CommitteeMember[];
  advisorCouncil: CommitteeMember[];
  ambassadors: CommitteeMember[];
}
