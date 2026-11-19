declare module "web-push" {
  export interface PushSubscription {
    endpoint: string;
    expirationTime?: number | null | undefined;
    keys: {
      p256dh: string;
      auth: string;
    };
  }

  export interface RequestOptions {
    headers?: Record<string, string> | undefined;
    TTL?: number | undefined;
    vapidDetails?:
      | {
          subject: string;
          publicKey: string;
          privateKey: string;
        }
      | undefined;
    urgency?: "very-low" | "low" | "normal" | "high" | undefined;
    topic?: string | undefined;
  }

  export interface SendResult {
    statusCode: number;
    body: string;
    headers: Record<string, string>;
  }

  export function setVapidDetails(subject: string, publicKey: string, privateKey: string): void;

  export function sendNotification(
    subscription: PushSubscription,
    payload?: string | Buffer | null,
    options?: RequestOptions,
  ): Promise<SendResult>;

  export function generateVAPIDKeys(): {
    publicKey: string;
    privateKey: string;
  };
}
