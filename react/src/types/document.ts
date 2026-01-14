export interface DocumentUploadResponse {
  message: string;
  document_id: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
}
