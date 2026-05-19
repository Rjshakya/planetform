// ─── Enums / Unions ──────────────────────────────────────────────────────────

type BundleMethod = "ubiquitous" | "optimal" | "force";

type CertificateCA = "digicert" | "google" | "lets_encrypt" | "ssl_com";

type DCVMethod = "http" | "txt" | "email";

type DomainValidationType = "dv";

type MinTLSVersion = "1.0" | "1.1" | "1.2" | "1.3";

type OnOff = "on" | "off";

type SSLStatus =
  | "initializing"
  | "pending_validation"
  | "deleted"
  | "pending_issuance"
  | "pending_deployment"
  | "pending_deletion"
  | "pending_expiration"
  | "expired"
  | "active"
  | "initializing_timed_out"
  | "validation_timed_out"
  | "issuance_timed_out"
  | "deployment_timed_out"
  | "deletion_timed_out"
  | "pending_cleanup"
  | "staging_deployment"
  | "staging_active"
  | "deactivating"
  | "inactive"
  | "backup_issued"
  | "holding_deployment";

export type HostnameStatus =
  | "active"
  | "pending"
  | "active_redeploying"
  | "moved"
  | "pending_deletion"
  | "deleted"
  | "pending_blocked"
  | "pending_migration"
  | "pending_provisioned"
  | "test_pending"
  | "test_active"
  | "test_active_apex"
  | "test_blocked"
  | "test_failed"
  | "provisioned"
  | "blocked";

// ─── Shared Primitives ───────────────────────────────────────────────────────

interface ApiMessage {
  code: number;
  message: string;
  documentation_url?: string;
  source?: {
    pointer?: string;
  };
}

interface SSLSettings {
  ciphers?: string[];
  early_hints?: OnOff;
  http2?: OnOff;
  min_tls_version?: MinTLSVersion;
  tls_1_3?: OnOff;
}

interface DCVRecord {
  cname?: string;
  cname_target?: string;
  emails?: string[];
  http_body?: string;
  http_url?: string;
  status?: string;
  txt_name?: string;
  txt_value?: string;
}

// ─── SSL Object ──────────────────────────────────────────────────────────────

interface CustomHostnameSSL {
  id?: string;
  bundle_method?: BundleMethod;
  certificate_authority?: CertificateCA;
  custom_certificate?: string;
  custom_csr_id?: string;
  custom_key?: string;
  dcv_delegation_records?: DCVRecord[];
  expires_on?: string;
  hosts?: string[];
  issuer?: string;
  method?: DCVMethod;
  serial_number?: string;
  settings?: SSLSettings;
  signature?: string;
  status?: SSLStatus;
  type?: DomainValidationType;
  uploaded_on?: string;
  validation_errors?: Array<{ message?: string }>;
  validation_records?: DCVRecord[];
  wildcard?: boolean;
}

// ─── Result Object ───────────────────────────────────────────────────────────

export interface CustomHostnameResult {
  id: string;
  hostname: string;
  created_at?: string;
  custom_metadata?: Record<string, string>;
  custom_origin_server?: string;
  custom_origin_sni?: string;
  ownership_verification?: {
    name?: string;
    type?: "txt";
    value?: string;
  };
  ownership_verification_http?: {
    http_body?: string;
    http_url?: string;
  };
  ssl?: CustomHostnameSSL;
  status?: HostnameStatus;
  verification_errors?: string[];
}

// ─── Top-level Response ──────────────────────────────────────────────────────

export type CreateCustomHostnameResponse =
  | {
      errors: ApiMessage[];
      messages: ApiMessage[];
      success: true;
      result: CustomHostnameResult;
    }
  | {
      errors: ApiMessage[];
      messages: ApiMessage[];
      success: false;
      result: undefined;
    };

export type DeleteCustomHostnameResponse =
  | {
      errors: ApiMessage[];
      messages: ApiMessage[];
      success: true;
      result: {
        id: string;
      };
    }
  | {
      errors: ApiMessage[];
      messages: ApiMessage[];
      success: false;
      result: undefined;
    };

export type GetCustomHostnameResponse =
  | {
      errors: ApiMessage[];
      messages: ApiMessage[];
      success: true;
      result: CustomHostnameResult;
    }
  | {
      errors: ApiMessage[];
      messages: ApiMessage[];
      success: false;
      result: undefined;
    };
