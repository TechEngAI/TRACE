/**
 * TRACE Shared Domain Contracts & TypeScript Types.
 *
 * Status: Frozen Initial Architecture & Data Contracts (Part 1).
 * Mirrors backend Pydantic schemas and /docs/api-contract.md.
 */

/** The 5 exact permitted outcome classifications. */
export type OutcomeEnum =
  | 'DISCREPANCY_CONFIRMED'
  | 'LIKELY_ROOT_CAUSE'
  | 'INSUFFICIENT_EVIDENCE'
  | 'CONFLICTING_EVIDENCE'
  | 'NO_DISCREPANCY_FOUND';

export const OUTCOMES: readonly OutcomeEnum[] = [
  'DISCREPANCY_CONFIRMED',
  'LIKELY_ROOT_CAUSE',
  'INSUFFICIENT_EVIDENCE',
  'CONFLICTING_EVIDENCE',
  'NO_DISCREPANCY_FOUND',
] as const;

/** The 4 exact permitted qualitative strength labels. Numerical percentages prohibited. */
export type StrengthEnum = 'HIGH' | 'MODERATE' | 'LOW' | 'INSUFFICIENT';

export const STRENGTHS: readonly StrengthEnum[] = [
  'HIGH',
  'MODERATE',
  'LOW',
  'INSUFFICIENT',
] as const;

export type InstitutionParty =
  | 'ORIGINATING_BANK'
  | 'SWITCH'
  | 'RECEIVING_BANK'
  | 'MERCHANT';

export type EventAction =
  | 'DEBIT'
  | 'CREDIT'
  | 'SWITCH_IN'
  | 'SWITCH_OUT'
  | 'ACK'
  | 'REVERSAL_ATTEMPT'
  | 'TIMEOUT';

export type EventStatus = 'SUCCESS' | 'PENDING' | 'FAILED' | 'TIMEOUT';

export type FlagSeverity = 'LOW' | 'MEDIUM' | 'CRITICAL';

export type CaseStatus = 'OPEN' | 'ANALYZED' | 'REVIEWED' | 'CLOSED';

export type ReviewVerdict = 'CONCUR' | 'OVERRULE' | 'REQUEST_FURTHER_EVIDENCE';

/** Canonical normalized timeline event. */
export interface TimelineEvent {
  event_id: string;
  timestamp: string; // ISO 8601 with timezone offset
  party: InstitutionParty;
  action: EventAction;
  status: EventStatus;
  amount_minor_units: number; // Stored in integer minor units (kobo)
  currency: string;
  reference?: string | null;
  session_id?: string | null;
  rrn?: string | null;
  channel?: string | null;
  raw_record_id: string;
  data_quality_notes?: string | null;
}

/** Expected evidence missing from submission. */
export interface MissingEvidenceItem {
  expected_party: InstitutionParty;
  expected_action: EventAction;
  window_start: string;
  window_end: string;
  reason: string;
}

/** Data quality anomaly flag. Critical flags cap strength at MODERATE. */
export interface DataQualityFlagItem {
  flag_code: string;
  severity: FlagSeverity;
  description: string;
  affected_event_ids: string[];
  impact: string;
}

/** Counterfactual hypothesis or 'what-if' condition. */
export interface CounterfactualItem {
  scenario: string;
  condition: string;
  outcome_if_condition_met: OutcomeEnum;
  explanation: string;
}

/** Canonical Deterministic Analysis Response Contract (10 required fields). */
export interface AnalysisResponse {
  case_id: string;
  outcome: OutcomeEnum;
  strength: StrengthEnum;
  rule_version: string;
  category: string;
  timeline: TimelineEvent[];
  supporting_event_ids: string[];
  missing_evidence: MissingEvidenceItem[];
  data_quality_flags: DataQualityFlagItem[];
  counterfactuals: CounterfactualItem[];
}

/** Case creation request payload. */
export interface CaseCreateRequest {
  reference: string;
  initiating_party: InstitutionParty;
  counterparty: InstitutionParty;
  disputed_amount: number; // Integer minor units (e.g. 8500000 kobo for ₦85,000)
  currency?: string;
  session_id?: string;
  rrn?: string;
  narrative?: string;
  metadata?: Record<string, unknown>;
}

/** Case overview response. */
export interface CaseResponse {
  case_id: string;
  reference: string;
  initiating_party: InstitutionParty;
  counterparty: InstitutionParty;
  disputed_amount: number;
  currency: string;
  status: CaseStatus;
  created_at: string;
  metadata?: Record<string, unknown>;
}

/** Case list item. */
export interface CaseListItem {
  case_id: string;
  reference: string;
  initiating_party: InstitutionParty;
  counterparty: InstitutionParty;
  disputed_amount: number;
  currency: string;
  status: CaseStatus;
  created_at: string;
  latest_outcome?: OutcomeEnum | null;
  latest_strength?: StrengthEnum | null;
}

/** Paginated case list response. */
export interface CaseListResponse {
  items: CaseListItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

/** Comprehensive case details. */
export interface CaseDetailResponse {
  case_id: string;
  reference: string;
  initiating_party: InstitutionParty;
  counterparty: InstitutionParty;
  disputed_amount: number;
  currency: string;
  status: CaseStatus;
  created_at: string;
  metadata?: Record<string, unknown>;
  events_count: number;
  latest_analysis?: AnalysisResponse | null;
}

/** Health check response. */
export interface HealthResponse {
  status: string;
  service: string;
  version: string;
  timestamp: string;
  environment: string;
}

/** Correlation linkage status enum. */
export type CorrelationStatus = 'CONFIRMED' | 'CANDIDATE' | 'AMBIGUOUS' | 'UNMATCHED';

export type CorrelationMethod =
  | 'SESSION_AND_RRN_MATCH'
  | 'SESSION_ID_MATCH'
  | 'RRN_MATCH'
  | 'INSTITUTION_SCOPED_REFERENCE'
  | 'TEMPORAL_AMOUNT_PROXIMITY'
  | 'PARTIAL_REFERENCE_HEURISTIC'
  | 'NONE';

export type CorrelationReasonCode =
  | 'STRONG_SESSION_AND_RRN_CONSISTENT'
  | 'STRONG_SESSION_ID_CONSISTENT'
  | 'STRONG_RRN_CONSISTENT'
  | 'SECONDARY_INSTITUTION_REFERENCE_VERIFIED'
  | 'AMBIGUOUS_IDENTIFIER_CONFLICT'
  | 'AMBIGUOUS_MULTIPLE_CANDIDATE_COLLISION'
  | 'CANDIDATE_TEMPORAL_AMOUNT_PROXIMITY'
  | 'CANDIDATE_PARTIAL_REFERENCE_ONLY'
  | 'INSUFFICIENT_IDENTIFIERS'
  | 'CURRENCY_MISMATCH'
  | 'TIMESTAMP_OUT_OF_TOLERANCE'
  | 'CROSS_CASE_BOUNDARY_VIOLATION';

export interface CorrelationEventRef {
  event_id: string;
  raw_record_id: string;
  party: InstitutionParty;
  action: EventAction;
  status: EventStatus;
  amount_minor_units: number;
  currency: string;
  session_id?: string | null;
  rrn?: string | null;
  reference?: string | null;
  event_timestamp: string;
}

export interface CorrelationGroup {
  group_id: string;
  status: CorrelationStatus;
  method: CorrelationMethod;
  reason_code: CorrelationReasonCode;
  reason_description: string;
  member_event_ids: string[];
  events: CorrelationEventRef[];
  identifying_keys: Record<string, unknown>;
  temporal_ordering_ambiguous: boolean;
  contradictions: string[];
}

export interface CaseCorrelationResult {
  case_id: string;
  algorithm_version: string;
  computed_at: string;
  total_events: number;
  groups: CorrelationGroup[];
  summary: Record<string, number>;
}
