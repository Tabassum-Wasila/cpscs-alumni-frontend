export interface ReunionCommitteeMember {
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

export interface ReunionCommitteeCategory {
  name: string;
  members: ReunionCommitteeMember[];
}

export interface ReunionCommitteeTerm {
  id: string;
  term: string;
  isActive: boolean;
}

export interface ReunionCommitteeData {
  title: string;
  subtitle: string;
  event_id: string;
  committees: {
    conveningCommittee: ReunionCommitteeMember[];
    registrationCommittee: ReunionCommitteeMember[];
    publicityCommittee: ReunionCommitteeMember[];
    foodCommittee: ReunionCommitteeMember[];
    sponsorCommittee: ReunionCommitteeMember[];
    sportsCommittee: ReunionCommitteeMember[];
    culturalCommittee: ReunionCommitteeMember[];
    receptionCommittee: ReunionCommitteeMember[];
    batchCoordinators: ReunionCommitteeMember[];
  };
}