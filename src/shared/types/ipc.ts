export interface Commitment {
  id: string;
  time?: string;
  email?: string;
  description: string;
  commitment?: string;
}

/**
 * Request
 */
export type SaveCommitmentRequest = {
  id?: string;
  email?: string;
  description?: string;
  commitment?: string;
  time?: string;
};

export interface FetchCommitmentRequest {
  id: string;
  email: string;
}

export interface DeleteCommitmentRequest {
  id: string;
  email: string;
}

/**
 * Response
 */
export interface FetchAllCommitmentsResponse {
  data: Commitment[];
}

export interface FetchCommitmentResponse {
  data: Commitment;
}

export interface CreateCommitmentResponse {
  data: Commitment;
}
